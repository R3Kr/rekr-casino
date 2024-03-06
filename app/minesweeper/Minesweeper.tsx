"use client";
import {
  ClickResult,
  genBombs,
  genPlayerBoard,
  handleClick,
  MineBoard,
  PlayerBoard,
  placeFlag,
} from "@/lib/minesweeper";
import React, { useMemo, useState } from "react";
import { number } from "zod";

interface Props {
  mines: MineBoard;
}

function partitionBoard<T>(width: number, array: T[]) {
  return array.reduce<T[][]>(
    (acc, item, index) => {
      acc[Math.floor(index / width)].push(item);
      return acc;
    },
    [...new Array(width)].map<T[]>((_) => [])
  );
}

const onClick = (
  box: number,
  board: PlayerBoard,
  setBoard: (b: PlayerBoard) => void,
  mines: MineBoard,
  setClickResult: (gg: ClickResult) => void
) => {
  setClickResult(handleClick(box, board, mines));
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
    default:
      return "#000000"; // Default color if no match
  }
};

// const placeFlag = (box: number, playerBoard: PlayerBoard) => {};
export default function Minesweeper({ mines }: Props) {
  const [playerBoard, setPlayerBoard] = useState(genPlayerBoard(mines));
  const [clickResult, setClickResult] = useState<ClickResult>("ok");
  const [gridSize, setGridSize] = useState(50);

  const gameOver = useMemo<boolean>(() => {
    return clickResult !== "ok";
  }, [clickResult]);

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
      ></input>
      {gameOver && <div className="text-5xl">Game over loser</div>}
      {partitionBoard(
        playerBoard.width,
        playerBoard.board.map((b, i) => {
          return { b, i };
        })
      ).map((row, i) => (
        <div key={i} className="flex">
          {row.map((b) => (
            <div
              key={b.i}
              style={{
                width: gridSize,
                height: gridSize,
                color: getColor(b.b.toString()),
              }}
              className={`p-2 border-2 border-gray-600 flex justify-center items-center select-none`}
              onClick={() =>
                !gameOver &&
                onClick(b.i, playerBoard, setPlayerBoard, mines, setClickResult)
              }
              onContextMenu={(event) => {
                event.preventDefault();
                placeFlag(b.i, playerBoard);
                setPlayerBoard({ ...playerBoard });
              }}
            >
              {b.b === 0 ? " " : b.b}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
