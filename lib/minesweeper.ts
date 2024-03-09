import { boolean } from "zod";

type Mine = boolean;
type PlayerBox = number | "?" | "⛳️" | "☠️" | "⁉️";

export type MineBoard = {
  readonly width: number;
  readonly height: number;
  readonly board: Mine[];
};
export type PlayerBoard = {
  readonly width: number;
  readonly height: number;
  readonly board: PlayerBox[];
  readonly mines: MineBoard;
  readonly click: (clickIndex: number) => ClickResult;
};

export class DefaultPlayerBoard implements PlayerBoard {
  width: number;
  height: number;
  board: PlayerBox[];
  mineCount: number;
  mines: MineBoard;

  constructor(width: number, height: number, mineCount: number) {
    this.width = width;
    this.height = height;
    this.board = new Array(width * height).fill("?");
    this.mines = {
      width,
      height,
      board: new Array(width * height).fill(false),
    };
    this.mineCount = mineCount;
  }

  click(clickIndex: number): ClickResult {
    const safeZone = [...adjecentSquares(clickIndex, this), clickIndex]

    this.mines = genBombs(this.width, this.height, this.mineCount, safeZone);
    this.click = this.handleClickPostFirstClick;
    return this.click(clickIndex)
  }
  handleClickPostFirstClick(clickIndex: number) {
    return handleClick(clickIndex, this, this.mines);
  }
}

export const genBombs = (
  x: number,
  y: number,
  bombs: number,
  indicesToExclude?: number[]
) => {
  const size = x * y;
  const board = new Array<Mine>(size).fill(false);

  let bombsPlaced = 0;
  for (let i = 0; bombsPlaced < bombs; i = (i + 1) % size) {
    if (board[i]) {
      continue;
    }
    if (indicesToExclude?.includes(i)) {
      continue;
    }
    if (Math.random() < 0.001) {
      board[i] = true;
      bombsPlaced++;
    }
  }
  const res: MineBoard = { width: x, height: y, board: board };
  return res;
};

const genBoard = (mineboard: MineBoard) => {
  return mineboard.board.map((b, i) =>
    b ? "☠️" : adjecentBombs(i, mineboard)
  );
};

export const genPlayerBoard = ({ width, height }: MineBoard) => {
  return {
    width: width,
    height: height,
    board: new Array<PlayerBox>(width * height).fill("?"),
  };
};

export const boxesToClickFromMiddleMouse = (
  clickIndex: number,
  playerBoard: PlayerBoard,
  mineboard: MineBoard
) => {
  if (typeof playerBoard.board[clickIndex] !== "number") {
    return [];
  }
  const adjSquares = adjecentSquares(clickIndex, mineboard);

  const adjecentFlags = adjSquares.filter(
    (val) => playerBoard.board[val] === "⛳️"
  ).length;
  if ((playerBoard.board[clickIndex] as number) <= adjecentFlags) {
    return adjSquares.filter((val) => playerBoard.board[val] === "?");
  }
};

export type ClickResult = {
  readonly gameOver?: "won" | "lost";
  readonly mine?: number;
};

export const handleClick = (
  clickIndex: number,
  playerBoard: PlayerBoard,
  mineboard: MineBoard
) => {
  playerBoard.board[clickIndex] = mineboard.board[clickIndex]
    ? "☠️"
    : adjecentBombs(clickIndex, mineboard);
  if (playerBoard.board[clickIndex] === 0) {
    clickSurrounding(clickIndex, playerBoard, mineboard);
  }
  const hasWon =
    mineboard.board.filter((m) => m === false).length ===
    playerBoard.board.filter((b) => typeof b === "number").length;
  const res: ClickResult =
    playerBoard.board[clickIndex] === "☠️"
      ? { gameOver: "lost", mine: clickIndex }
      : hasWon
      ? { gameOver: "won" }
      : {};
  return res;
};

export const handleClicks = (
  clickIndices: Array<number>,
  playerBoard: PlayerBoard,
  mineboard: MineBoard
) => {
  let result: ClickResult = {};
  for (let i = 0; i < clickIndices.length; i++) {
    const index = clickIndices[i];
    result = handleClick(index, playerBoard, mineboard);
    if (result.gameOver === "lost") {
      return result;
    }
  }
  return result;
};

export const revealPlayerBoard = (
  playerBoard: PlayerBoard,
  mineboard: MineBoard
) => {
  for (let i = 0; i < playerBoard.board.length; i++) {
    if (mineboard.board[i]) {
      playerBoard.board[i] = "☠️";
    } else if (playerBoard.board[i] === "⛳️") {
      playerBoard.board[i] = "⁉️";
    }
  }
};

export const toggleFlag = (clickIndex: number, playerBoard: PlayerBoard) => {
  if (playerBoard.board[clickIndex] === "?") {
    playerBoard.board[clickIndex] = "⛳️";
  } else if (playerBoard.board[clickIndex] === "⛳️") {
    playerBoard.board[clickIndex] = "?";
  }
};

const clickSurrounding = (
  clickIndex: number,
  playerBoard: PlayerBoard,
  mineboard: MineBoard
) => {
  adjecentSquares(clickIndex, mineboard)
    .filter((num) => playerBoard.board[num] === "?")
    .forEach((num) => handleClick(num, playerBoard, mineboard));
};

const adjecentSquares = (box: number, { width, height, board }: MineBoard | PlayerBoard) => {
  const adjecentSquares: number[] = [];

  //left
  if (box % width !== 0) {
    adjecentSquares.push(box - 1);
  }
  //right
  if ((box + 1) % width !== 0) {
    adjecentSquares.push(box + 1);
  }

  //down
  if (box + width < board.length) {
    adjecentSquares.push(box + width);
  }

  //up
  if (box - width >= 0) {
    adjecentSquares.push(box - width);
  }

  //leftDown
  if (box + width < board.length && box % width !== 0) {
    adjecentSquares.push(box - 1 + width);
  }

  //rightDown
  if ((box + 1) % width !== 0 && box + width < board.length) {
    adjecentSquares.push(box + 1 + width);
  }

  //leftUp
  if (box % width !== 0 && box - width >= 0) {
    adjecentSquares.push(box - 1 - width);
  }

  //rightUp
  if ((box + 1) % width !== 0 && box - width >= 0) {
    adjecentSquares.push(box + 1 - width);
  }

  return adjecentSquares;
};

const adjecentBombs = (box: number, board: MineBoard) => {
  return adjecentSquares(box, board)
    .map((num) => board.board[num])
    .filter((b) => b).length;
};

// const adjecentBombs = (box: number, { width, height, board }: MineBoard) => {
//   let adjecentBombs = 0;

//   const leftIndex = box % width === 0 ? box : box - 1;
//   if (board[leftIndex]) {
//     adjecentBombs++;
//   }

//   const rightIndex = (box + 1) % width === 0 ? box : box + 1;
//   if (board[rightIndex]) {
//     adjecentBombs++;
//   }

//   const downIndex = box + height >= board.length ? box : box + height;
//   if (board[downIndex]) {
//     adjecentBombs++;
//   }

//   const upIndex = box - height < 0 ? box : box - height;
//   if (board[upIndex]) {
//     adjecentBombs++;
//   }

//   const leftDownIndex =
//     box % width === 0 || box + height >= board.length ? box : box - 1 + height;
//   if (board[leftDownIndex]) {
//     adjecentBombs++;
//   }

//   const rightDownIndex =
//     (box + 1) % width === 0 || box + height >= board.length
//       ? box
//       : box + 1 + height;
//   if (board[rightDownIndex]) {
//     adjecentBombs++;
//   }

//   const leftUpIndex =
//     box % width === 0 || box - height < 0 ? box : box - 1 - height;
//   if (board[leftUpIndex]) {
//     adjecentBombs++;
//   }

//   const rightUpIndex =
//     (box + 1) % width === 0 || box - height < 0 ? box : box + 1 - height;
//   if (board[rightUpIndex]) {
//     adjecentBombs++;
//   }
//   return adjecentBombs;
// };

// const toEmoji = (box: Box) => {
//     switch (box) {
//         case "💣": return "💣"
//         case 0: return"0️⃣"
//         case 1: return "1️⃣"
//         case 2: return "2️⃣"
//         case 3: return "3️⃣"
//         case 4: return "4️⃣"
//         case 5: return "5️⃣"
//         case 6: return "6️⃣"
//         case 7: return "7️⃣"
//         case 8: return "8️⃣"
//         case 9: return "9️⃣"
//         default: return "⁇"
//     }
// }

// const toX = (box: Box) => {
//     if (box === "💣") {
//         return "x"
//     }
//     return box
// }

// const width = 20;
// const height = 20;
// const mineboard = genBombs(width, height, 50);
// const playerBoard = genPlayerBoard(mineboard);

// let gameOver = false;

// const _ = handleClick(
//   Math.floor(Math.random() * width * height),
//   playerBoard,
//   mineboard
// );

// for (let i = 0; i < height; i++) {
//   const start = i * height;
//   const end = start + width;
//   console.log(playerBoard.board.slice(start, end).join("|"));
//   //console.log(genBoard(mineboard).slice(start, end).join("|"));
// }
