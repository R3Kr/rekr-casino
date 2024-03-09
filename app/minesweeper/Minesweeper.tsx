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
import React, { ElementRef, useEffect, useRef, useState } from "react";

export default function Minesweeper() {
  const [shouldPlay, setShouldPlay] = useState(false);
  const widthInput = useRef<ElementRef<"input">>(null);
  const heightInput = useRef<ElementRef<"input">>(null);
  const minesInput = useRef<ElementRef<"input">>(null);

  if (true) {
    return (
      <MinesweeperGame
        board={new DefaultPlayerBoard(
          30, //widthInput?.current?.valueAsNumber!,
          16, //heightInput?.current?.valueAsNumber!,
          99 //minesInput?.current?.valueAsNumber!
        )}
      />
    );
  }

  return (
    <div className="flex flex-col">
      <label>Width: </label>
      <input
        defaultValue={5}
        className="text-black"
        type="number"
        ref={widthInput}
      ></input>
      <label>Height: </label>
      <input
        defaultValue={5}
        className="text-black"
        type="number"
        ref={heightInput}
      ></input>
      <label>Mines: </label>
      <input
        defaultValue={5}
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
function MinesweeperGame({ board }: Props) {
  const [playerBoard, setPlayerBoard] = useState(board);
  const [{ gameOver, mine: gameOverMine }, setClickResult] =
    useState<ClickResult>({});
  const [gridSize, setGridSize] = useState(50);

  useEffect(() => {
    if (gameOver === "lost") {
      revealPlayerBoard(playerBoard, board.mines);
      setPlayerBoard({ ...playerBoard });
    }
  }, [gameOver]);

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
      <div style={{width: `${gridSize * playerBoard.width}px`, gridTemplateColumns: `repeat(${playerBoard.width}, minmax(0, 1fr))`}}className={`grid`}>
        {playerBoard.board.map((b, i) => (
          <div
            key={i}
            style={{
              width: `${gridSize}px`,
              height: `${gridSize}px`,
              color: getColor(b.toString()),
            }}
            className={`p-2 border-2 border-gray-600 flex justify-center items-center select-none ${b === "?" ? "bg-amber-100" : "bg-amber-50"} ${
              gameOverMine === i ? "bg-red-500" : ""
            }`}
            onClick={() => {
              if (!gameOver && b !== "⛳️") {
                onClick(i, playerBoard, setPlayerBoard, setClickResult);
              }
              console.log({ b, i });
            }}
            onContextMenu={(event) => {
              event.preventDefault();
              if (typeof b === "number") {
                boxesToClickFromMiddleMouse(i, playerBoard, board.mines)?.forEach(
                  (box) =>
                    onClick(
                      box,
                      playerBoard,
                      setPlayerBoard,
                      setClickResult
                    )
                );
              } else {
                toggleFlag(i, playerBoard);
              }
              setPlayerBoard({ ...playerBoard });
            }}
          >
            {b === 0 || b === "?" ? " " : b}
          </div>
        ))}
      </div>
    </div>
  );
}
