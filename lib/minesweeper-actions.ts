"use server";

import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "./authOptions";
import { redirect } from "next/dist/server/api-utils";
import {
  ClickResult,
  DefaultPlayerBoard,
  MineBoard,
  PlayerBoard,
  PlayerBox,
  genBoard,
  handleClick,
  handleClicks,
} from "./minesweeper";
import prisma from "./db";

const genBoardArgs = z
  .object({
    width: z.number().int().gte(10, "at least 10 width"),
    height: z.number().int().gte(10, "at least 10 height"),
    mines: z.number().int().gte(10, "at least 10 mines"),
    firstClick: z.number().int().gte(0, "invalid index"),
  })
  .superRefine((data, ctx) => {
    // Calculate the maximum number of mines based on width * height
    const maxMines = data.width * data.height - 10; // Leave at least one cell without a mine

    // Validate if the number of mines exceeds the maximum allowed
    if (data.mines > maxMines || data.firstClick >= data.width * data.height) {
      ctx.addIssue({
        path: ["mines"], // Path to the field with the issue
        code: "invalid_type",
        received: "number",
        expected: "nan",
        message: `must be less than or equal to the product of width and height minus one (${maxMines})`, // Custom error message
      });
    }
  });
export type PlayerBoardServerData = {
  width: number;
  height: number;
  board: PlayerBox[];
  clickResult: ClickResult;
  revealedMines?: MineBoard;
};
export const generateBoardAction = async (
  args: z.infer<typeof genBoardArgs>
) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw Error("unauthed");
  }
  const { height, width, mines, firstClick } = genBoardArgs.parse(args);
  const defaultPlayerBoard = new DefaultPlayerBoard(width, height, mines);
  defaultPlayerBoard.click(firstClick);

  const mineboard = await prisma.mineSweeperBoard.create({
    data: {
      height: height,
      width: width,
      mines: {
        createMany: {
          data: defaultPlayerBoard.mines.board.map((m, i) => {
            return { index: i, isMine: m };
          }),
        },
      },
    },
    include: {
      mines: {},
    },
  });
  const pb = await prisma.playerMineSweeperBoard.create({
    data: {
      playerId: session.user.id!,
      mineBoardId: mineboard.id,
      boxes: {
        createMany: {
          data: defaultPlayerBoard.board.map((b, i) => {
            return {
              mineId: mineboard.mines[i].id,
              boxState: b === "?" ? "NOTCLICKED" : "CLICKED",
            };
          }),
        },
      },
    },
  });
  const res: PlayerBoardServerData = {
    width: defaultPlayerBoard.width,
    height: defaultPlayerBoard.height,
    board: defaultPlayerBoard.board,
    clickResult: { clickedBoxes: [] },
  };
  return res;
};

class PlayerBoardDTO implements PlayerBoard {
  width: number;
  height: number;
  board: PlayerBox[];
  mines: MineBoard;
  playerBoardId: string;
  private constructor(
    width: number,
    height: number,
    board: PlayerBox[],
    mines: MineBoard,
    playerBoardId: string
  ) {
    this.width = width;
    this.height = height;
    this.board = board;
    this.mines = mines;
    this.playerBoardId = playerBoardId;
  }

  static async new(playerId: string) {
    const board = await prisma.playerMineSweeperBoard.findFirst({
      where: {
        playerId: playerId,
        gameOver: null,
      },
      include: {
        boxes: {
          include: {
            mine: {
              select: { index: true, isMine: true },
            },
          },
        },
        mineBoard: {},
      },
    });

    if (!board) {
      throw Error("no active game");
    }

    const width = board.mineBoard.width;
    const height = board.mineBoard.height;
    const mines: MineBoard = {
      ...board.mineBoard,
      mineCount: board.boxes.reduce<number>(
        (prev, curr) => (curr.mine.isMine ? prev + 1 : prev),
        0
      ),
      board: board.boxes.map((b) => b.mine.isMine),
    };
    const playerboard: PlayerBox[] = genBoard(
      mines,
      board.boxes
        .filter((b) => b.boxState === "CLICKED")
        .map((b) => b.mine.index)
    );

    return new PlayerBoardDTO(width, height, playerboard, mines, board.id);
  }

  click(clickIndex: number) {
    return handleClick(clickIndex, this, this.mines);
  }
  async handleClicks(boxesToClick: number[]): Promise<PlayerBoardServerData> {
    const results = handleClicks(boxesToClick, this, this.mines);

    await prisma.playerBox.updateMany({
      where: {
        playerBoardId: this.playerBoardId,
        AND: { mine: { index: { in: results.clickedBoxes } } },
      },
      data: { boxState: "CLICKED" },
    });

    results.gameOver &&
      (await prisma.playerMineSweeperBoard.update({
        where: { id: this.playerBoardId },
        data: { gameOver: results.gameOver === "won" ? "WON" : "LOST" },
      }));

    return {
      height: this.height,
      width: this.width,
      board: this.board,
      clickResult: results,
      revealedMines: results.gameOver !== undefined ? this.mines : undefined,
    };

    //const update = prisma.playerMineSweeperBoard.update({where: {id: this.playerBoardId}, data: {boxes: {updateMany: {data: {}}}}})
  }
}

const clickActionArgs = z.array(z.number().int().gte(0)).min(1);
export const clickAction = async (args: z.infer<typeof clickActionArgs>) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    throw Error("unauthed");
  }
  const boxesToClick = clickActionArgs.parse(args);
  const playerboard = await PlayerBoardDTO.new(session.user.id!);
  return await playerboard.handleClicks(boxesToClick);
};
