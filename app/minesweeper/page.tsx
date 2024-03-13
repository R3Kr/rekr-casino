import React from "react";
import Minesweeper from "./Minesweeper";
import { DefaultPlayerBoard, genBombs, handleClicks } from "@/lib/minesweeper";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

export default async function page() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/");
  }

  const board = await prisma.playerMineSweeperBoard.findFirst({
    where: {
      playerId: session.user.id!,
      gameOver: null, //NOT: [{ gameOver: "LOST" }, { gameOver: "WON" }],
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

  if (!board)
    return (
      <div className="text-xl text-white">
        <Minesweeper />
      </div>
    );

  const playerBoard = new DefaultPlayerBoard(
    board.mineBoard.width,
    board.mineBoard.height,
    board.boxes.filter((b) => b.mine.isMine).length
  );

  const res = handleClicks(
    board.boxes
      .filter((b) => b.boxState === "CLICKED")
      .map((b) => b.mine.index),
    playerBoard,
    {
      board: board.boxes.map((b) => b.mine.isMine),
      mineCount: board.boxes.reduce<number>(
        (prev, curr) => (curr.mine.isMine ? prev + 1 : prev),
        0
      ),
      width: board.mineBoard.width,
      height: board.mineBoard.height,
    }
  );

  return (
    <div className="text-xl text-white">
      <Minesweeper
        p={{
          board: playerBoard.board,
          height: playerBoard.height,
          width: playerBoard.width,
          minecount: board.boxes.reduce<number>(
            (prev, curr) => (curr.mine.isMine ? prev + 1 : prev),
            0
          ),
          clickResult: res,
        }}
      />
    </div>
  );
}
