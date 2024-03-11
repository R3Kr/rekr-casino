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
} from "@/lib/minesweeper-actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { ElementRef, useEffect, useRef, useState } from "react";


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
                  board: new Array<boolean>(p.board.length).fill(false),
                  mineCount: 0,  //this isnt used after forst click
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
      />
    );
  }

  return (
    <div className="flex flex-col">
      <label>Width: </label>
      <input
        defaultValue={10}
        className="text-black"
        type="number"
        ref={widthInput}
      ></input>
      <label>Height: </label>
      <input
        defaultValue={10}
        className="text-black"
        type="number"
        ref={heightInput}
      ></input>
      <label>Mines: </label>
      <input
        defaultValue={10}
        className="text-black"
        type="number"
        ref={minesInput}
      ></input>
      <div>
        <button className="p-2 bg-blue-200" onClick={() => setShouldPlay(true)}>
          Play
        </button>
      </div>
    </div>
  );
}

interface Props {
  board: PlayerBoard;
  prevClickResult?: ClickResult
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
    case "?":
      return "#FFFFFF";
    default:
      return "#000000"; // Default color if no match
  }
};

// const placeFlag = (box: number, playerBoard: PlayerBoard) => {};
function MinesweeperGame({ board, prevClickResult}: Props) {
  const [playerBoard, setPlayerBoard] = useState(board);
  const [flagIndecis, setFlagindeces] = useState(
    board.board.filter((b) => b === "⛳️").map((b, i) => i)
  );
  const [{ gameOver, mine: gameOverMine }, setClickResult] =
    useState<ClickResult>(prevClickResult ? prevClickResult : {clickedBoxes: []});
  const [gridSize, setGridSize] = useState(50);

  useEffect(() => {
    if (gameOver === "lost") {
      revealPlayerBoard(playerBoard, board.mines);
      setPlayerBoard({ ...playerBoard });
    }
    console.log(board);
  }, [gameOver]);

  useEffect(() => {
    console.log(flagIndecis);
  }, [flagIndecis]);

  const { mutate, isPending } = useMutation({
    mutationKey: ["board"],
    mutationFn: (boxesToClick: number[]) => playerBoard.board.find(b => typeof b === "number") === undefined ?  generateBoardAction({width: playerBoard.width, height: playerBoard.height, mines: playerBoard.mines.mineCount, firstClick: boxesToClick[0]}) : clickAction(boxesToClick),
    onSuccess(data, variables, context) {
      setClickResult(data.clickResult)
      setPlayerBoard((prev) => {
        return {
          ...data,
          board: data.board.map((box, i) => flagIndecis.includes(i) ? "⛳️" : box ),
          click(clickIndex) {
            return handleClick(clickIndex, prev, prev.mines);
          },
          mines: {
            board: new Array<boolean>(data.board.length).fill(false),
            mineCount: prev.mines.mineCount,
            height: data.height,
            width: data.width,
          },
        };
      });
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
      {gameOver && (
        <div className="text-5xl">
          {gameOver === "lost"
            ? "Game over, loser"
            : "Congratulations, you won!!🥳"}
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
              b === "?"
                ? "bg-amber-100"
                : gameOverMine === i
                ? "bg-red-500"
                : "bg-amber-50"
            } `}
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
              if (!gameOver && b === "?") {
                //onClick(i, playerBoard, setPlayerBoard, setClickResult);
                mutate([i]);
              }
            }}
            onContextMenu={(event) => {
              event.preventDefault();
              if (typeof b === "number") {
                const toClick = boxesToClickFromMiddleMouse(
                  i,
                  playerBoard,
                  board.mines
                );
                toClick && mutate(toClick);
              } else {
                toggleFlag(i, playerBoard);
                setFlagindeces((prev) => [...prev, i]);
              }
            }}
          >
            {flagIndecis.includes(i) ? "⛳️" : b === 0 || b === "?" ? " " :  b}
          </div>
        ))}
      </div>
    </div>
  );
}
