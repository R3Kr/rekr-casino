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
} from "@/lib/minesweeper";
import React, { useEffect, useRef, useState } from "react";

export default function Minesweeper() {
  const [shouldPlay, setShouldPlay] = useState(false);
  const widthInput = useRef<HTMLInputElement>(null);
  const heightInput = useRef<HTMLInputElement>(null);
  const minesInput = useRef<HTMLInputElement>(null);

  if (shouldPlay) {
    return (
      <MinesweeperGame
        mines={genBombs(
          widthInput?.current?.valueAsNumber!,
          heightInput?.current?.valueAsNumber!,
          minesInput?.current?.valueAsNumber!
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

      <button className="p-2 bg-blue-200" onClick={() => setShouldPlay(true)}>Play</button>
      </div>
    </div>
  );
}

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
    case "?":
      return "#FFFFFF";
    default:
      return "#000000"; // Default color if no match
  }
};

// const placeFlag = (box: number, playerBoard: PlayerBoard) => {};
function MinesweeperGame({ mines }: Props) {
  const [playerBoard, setPlayerBoard] = useState(genPlayerBoard(mines));
  const [{ gameOver, mine: gameOverMine }, setClickResult] =
    useState<ClickResult>({});
  const [gridSize, setGridSize] = useState(50);

  useEffect(() => {
    if (gameOver === "lost") {
      revealPlayerBoard(playerBoard, mines);
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
      ></input>
      {gameOver && (
        <div className="text-5xl">
          {gameOver === "lost"
            ? "Game over loser"
            : "Congratulations you won!!🥳"}
        </div>
      )}
      {partitionBoard(
        playerBoard.width,
        playerBoard.board.map((b, i) => {
          return { box: b, i };
        })
      ).map((row, i) => (
        <div key={i} className="flex">
          {row.map((b) => (
            <div
              key={b.i}
              style={{
                width: gridSize,
                height: gridSize,
                color: getColor(b.box.toString()),
              }}
              className={`p-2 border-2 border-gray-600 flex justify-center items-center select-none ${
                gameOverMine === b.i && "bg-red-500"
              }`}
              onClick={() =>
                !gameOver &&
                b.box !== "⛳️" &&
                onClick(b.i, playerBoard, setPlayerBoard, mines, setClickResult)
              }
              onContextMenu={(event) => {
                event.preventDefault();
                if (typeof b.box === "number") {
                  boxesToClickFromMiddleMouse(b.i, playerBoard, mines)?.forEach(
                    (box) =>
                      onClick(
                        box,
                        playerBoard,
                        setPlayerBoard,
                        mines,
                        setClickResult
                      )
                  );
                  setPlayerBoard({ ...playerBoard });
                } else {
                  toggleFlag(b.i, playerBoard);
                  setPlayerBoard({ ...playerBoard });
                }
              }}
            >
              {b.box === 0 ? " " : b.box}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
