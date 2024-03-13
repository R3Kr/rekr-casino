"use client";
import {
  ClickResult,
  genPlayerBoard,
  handleClick,
  boxesToClickFromMiddleMouse,
  MineBoard,
  PlayerBoard,
  revealPlayerBoard,
  toggleFlag,
  genBombs,
  DefaultPlayerBoard,
} from "@/lib/minesweeper";
import {
  PlayerBoardServerData,
  generateBoardAction,
  clickAction,
  playAgain,
} from "@/lib/minesweeper-actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { ElementRef, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { revalidatePath } from "next/cache";

// const keysPressed: Record<string, boolean> = {};

// document.addEventListener("keydown", (e) => {
//   if (!keysPressed[e.key]) {
//     keysPressed[e.key] = true;
//   }
// });
// document.addEventListener("keyup", (e) => {
//   if (keysPressed[e.key]) {
//     keysPressed[e.key] = false;
//   }
// });

class DefaultClientPlayerBoard extends DefaultPlayerBoard {
  click(clickIndex: number): ClickResult {
    let pending = true;
    generateBoardAction({
      width: this.width,
      height: this.height,
      mines: this.mineCount,
      firstClick: clickIndex,
    })
      .then((val) => {
        this.board = val.board;
      })
      .finally(() => (pending = false));
    while (pending) {}
    return super.click(clickIndex);
  }
}

export default function Minesweeper({ p }: { p?: PlayerBoardServerData }) {
  const [shouldPlay, setShouldPlay] = useState(false);
  const [level, setLevel] = useState<
    "beginner" | "intermediate" | "expert" | "custom"
  >("beginner");
  const widthInput = useRef<ElementRef<"input">>(null);
  const heightInput = useRef<ElementRef<"input">>(null);
  const minesInput = useRef<ElementRef<"input">>(null);
  const queryClient = useQueryClient();

  if (p || shouldPlay) {
    p && queryClient.setQueryData(["board"], p);
    return (
      <MinesweeperGame
        board={
          p
            ? {
                ...p,
                click(clickIndex) {
                  return handleClick(clickIndex, this, this.mines);
                },
                mines: {
                  board: new Array<boolean>(p.board.length).fill(false), //client is not aware which squares are mines
                  mineCount: p.minecount,
                  height: p.height,
                  width: p.width,
                },
              }
            : new DefaultClientPlayerBoard(
                widthInput?.current?.valueAsNumber!,
                heightInput?.current?.valueAsNumber!,
                minesInput?.current?.valueAsNumber!
              )
        }
        prevClickResult={p?.clickResult}
        shouldPlay={setShouldPlay}
      />
    );
  }

  return (
    <>
      <button
        onClick={() => setLevel("beginner")}
        className={`btn btn-primary border-2 ${
          level === "beginner" && "border-green-400"
        }`}
      >
        Beginner
      </button>
      <button
        onClick={() => setLevel("intermediate")}
        className={`btn btn-primary border-2 ${
          level === "intermediate" && "border-green-400"
        }`}
      >
        Intermediate
      </button>
      <button
        onClick={() => setLevel("expert")}
        className={`btn btn-primary border-2 ${
          level === "expert" && "border-green-400"
        }`}
      >
        Expert
      </button>
      <button
        onClick={() => setLevel("custom")}
        className={`btn btn-primary border-2 ${
          level === "custom" && "border-green-400"
        }`}
      >
        Custom
      </button>
      <div className="flex flex-col">
        <label>Width: </label>
        <input
          defaultValue={10}
          value={
            level === "beginner"
              ? 9
              : level === "intermediate"
              ? 16
              : level === "expert"
              ? 30
              : undefined
          }
          className="text-black"
          type="number"
          ref={widthInput}
        ></input>
        <label>Height: </label>
        <input
          defaultValue={10}
          value={
            level === "beginner"
              ? 9
              : level === "intermediate"
              ? 16
              : level === "expert"
              ? 16
              : undefined
          }
          className="text-black"
          type="number"
          ref={heightInput}
        ></input>
        <label>Mines: </label>
        <input
          defaultValue={10}
          value={
            level === "beginner"
              ? 10
              : level === "intermediate"
              ? 40
              : level === "expert"
              ? 99
              : undefined
          }
          className="text-black"
          type="number"
          ref={minesInput}
        ></input>
        <div>
          <button
            className="p-2 bg-blue-200"
            onClick={() => setShouldPlay(true)}
          >
            Play
          </button>
        </div>
      </div>
    </>
  );
}

interface Props {
  board: PlayerBoard;
  prevClickResult?: ClickResult;
  shouldPlay?: (shouldPlay: boolean) => void;
}

function partitionBoard<T>(width: number, height: number, array: T[]) {
  return array.reduce<T[][]>(
    (acc, item, index) => {
      acc[Math.floor(index / height)].push(item);
      return acc;
    },
    [...new Array(height)].map<T[]>((_) => [])
  );
}

const onClick = (
  box: number,
  board: PlayerBoard,
  setBoard: (b: PlayerBoard) => void,
  setClickResult: (gg: ClickResult) => void
) => {
  setClickResult(board.click(box));
  setBoard({ ...board });
};

const getColor = (text: string): string => {
  switch (text) {
    case "1":
      return "#0000FF"; // Blue
    case "2":
      return "#007B00"; // Green
    case "3":
      return "#FF0000"; // Red
    case "4":
      return "#00007B"; // Dark Blue
    case "5":
      return "#7B0000"; // Dark Red
    case "6":
      return "#007B7B"; // Turquoise/Dark Cyan
    case "7":
      return "#000000"; // Black
    case "8":
      return "#7B7B7B"; // Gray
    case "unknown":
      return "#FFFFFF";
    default:
      return "#000000"; // Default color if no match
  }
};

// const placeFlag = (box: number, playerBoard: PlayerBoard) => {};
function MinesweeperGame({ board, prevClickResult, shouldPlay }: Props) {
  const [playerBoard, setPlayerBoard] = useState(board);
  const [flagIndecis, setFlagindeces] = useState(
    board.board.map((b, i) => (b === "⛳️" ? true : false))
  );
  const [boxesToFlash, setBoxesToFlash] = useState(
    board.board.map((_) => false)
  );
  const [{ gameOver, mine: gameOverMine }, setClickResult] =
    useState<ClickResult>(
      prevClickResult ? prevClickResult : { clickedBoxes: [] }
    );
  const [gridSize, setGridSize] = useState(50);

  useEffect(() => {
    if (gameOver === "lost") {
      revealPlayerBoard(playerBoard, playerBoard.mines);
      setPlayerBoard({ ...playerBoard });
    }
  }, [gameOver]);

  const { mutate, variables, isPending } = useMutation({
    mutationKey: ["board"],
    mutationFn: (boxesToClick: number[]) =>
      playerBoard.board.find((b) => typeof b === "number") === undefined
        ? generateBoardAction({
            width: playerBoard.width,
            height: playerBoard.height,
            mines: playerBoard.mines.mineCount,
            firstClick: boxesToClick[0],
          })
        : clickAction(boxesToClick),
    onSuccess(data, variables, context) {
      setPlayerBoard((prev) => {
        return {
          ...data,
          board: data.board.map((box, i) => (flagIndecis[i] ? "⛳️" : box)),
          click(clickIndex) {
            return handleClick(clickIndex, prev, prev.mines);
          },
          mines: data.revealedMines
            ? data.revealedMines
            : {
                board: new Array<boolean>(data.board.length).fill(false),
                mineCount: prev.mines.mineCount,
                height: data.height,
                width: data.width,
              },
        };
      });
      setClickResult(data.clickResult);
    },
  });

  return (
    <div>
      <label>Grid size: </label>
      <input
        type="number"
        className="text-black"
        defaultValue={gridSize}
        onChange={(e) => {
          setGridSize(e.target.valueAsNumber);
        }}
      />
      {!gameOver && (
        <div className="p-2">{`☠️: ${
          playerBoard.mines.mineCount - flagIndecis.filter((v) => v).length
        }`}</div>
      )}
      {gameOver && (
        <div className="flex gap-x-5 p-2">
          <div className="text-5xl">
            {gameOver === "lost"
              ? "Game over, loser"
              : "Congratulations, you won!!🥳"}
          </div>
          <button
            className="btn btn-primary"
            onClick={() => {
              shouldPlay?.(false);
              playAgain();
            }}
          >
            Play again?
          </button>
        </div>
      )}
      <div
        style={{
          width: `${gridSize * playerBoard.width}px`,
          gridTemplateColumns: `repeat(${playerBoard.width}, minmax(0, 1fr))`,
        }}
        className={`grid`}
      >
        {playerBoard.board.map((b, i) => (
          <div
            key={i}
            style={{
              width: `${gridSize}px`,
              height: `${gridSize}px`,
              color: getColor(b.toString()),
            }}
            className={`p-2 border-2 border-gray-600 flex justify-center items-center select-none  ${
              gameOverMine === i
                ? "bg-red-500"
                : typeof b !== "number"
                ? "bg-amber-100"
                : "bg-amber-50"
            } ${isPending && variables.includes(i) && "bg-amber-50"} ${
              boxesToFlash[i] && "bg-gray-300"
            }`}
            // onMouseOver={() => {
            //   if (gameOver) {
            //     return;
            //   }
            //   if (keysPressed["1"]) {
            //     onClick(i, playerBoard, setPlayerBoard, setClickResult);
            //   }
            //   if (keysPressed["2"]) {
            //     if (typeof b === "number") {
            //       boxesToClickFromMiddleMouse(
            //         i,
            //         playerBoard,
            //         board.mines
            //       )?.forEach((box) =>
            //         onClick(box, playerBoard, setPlayerBoard, setClickResult)
            //       );
            //     } else {
            //       toggleFlag(i, playerBoard);
            //     }
            //     setPlayerBoard({ ...playerBoard });
            //   }
            // }}
            onClick={() => {
              if (!gameOver && b === "unknown") {
                //onClick(i, playerBoard, setPlayerBoard, setClickResult);
                mutate([i]);
              }
              console.log({ b, i });
            }}
            onContextMenu={(event) => {
              event.preventDefault();
              if (typeof b === "number") {
                const toClick = boxesToClickFromMiddleMouse(i, playerBoard);
                if (toClick?.nextAction === "click") {
                  mutate(toClick.indecis);
                } else if (toClick?.nextAction === "flash") {
                  toClick.indecis.forEach(
                    (index) => (boxesToFlash[index] = true)
                  );
                  setBoxesToFlash([...boxesToFlash]);
                  setTimeout(() => {
                    setBoxesToFlash([...boxesToFlash.fill(false)]);
                  }, 375 / 4);
                }
              } else {
                const res = toggleFlag(i, playerBoard);
                let stateUpdater: (prev: boolean[]) => boolean[] = (prev) =>
                  prev;
                switch (res) {
                  case "⛳️":
                    stateUpdater = (prev) => {
                      const arr = [...prev];
                      arr[i] = true;
                      return arr;
                    };
                    break;
                  case "?":
                    stateUpdater = (prev) => {
                      const arr = [...prev];
                      arr[i] = false;
                      return arr;
                    };
                    break;
                  case "unknown":
                  default:
                    break;
                }
                setPlayerBoard({ ...playerBoard });
                setFlagindeces(stateUpdater);
              }
            }}
          >
            {playerBoard.board[i] === "⁉️"
              ? "⁉️"
              : flagIndecis[i]
              ? "⛳️"
              : b === 0 || b === "unknown"
              ? " "
              : b}
          </div>
        ))}
      </div>
    </div>
  );
}
