type Mine = boolean;
type PlayerBox = number | "?" | "⛳️" | "☠️";

export type MineBoard = {
  readonly width: number;
  readonly height: number;
  readonly board: Mine[];
};
export type PlayerBoard = {
  readonly width: number;
  readonly height: number;
  readonly board: PlayerBox[];
  lost?: { readonly mine: number };
};

export const genBombs = (x: number, y: number, bombs: number) => {
  const size = x * y;
  const board = new Array<Mine>(size).fill(false);

  let bombsPlaced = 0;
  for (let i = 0; bombsPlaced < bombs; i = (i + 1) % size) {
    if (board[i]) {
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

export type ClickResult = "ok" | GameOver;
type GameOver = {
  readonly mine: number;
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
  const res: ClickResult =
    playerBoard.board[clickIndex] === "☠️" ? { mine: clickIndex } : "ok";
  return res;
};

export const placeFlag = (clickIndex: number, playerBoard: PlayerBoard) => {
  if (playerBoard.board[clickIndex] === "?") {
    playerBoard.board[clickIndex] = "⛳️";
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

const adjecentSquares = (box: number, { width, height, board }: MineBoard) => {
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
  if (box + height < board.length) {
    adjecentSquares.push(box + height);
  }

  //up
  if (box - height >= 0) {
    adjecentSquares.push(box - height);
  }

  //leftDown
  if (box + height < board.length && box % width !== 0) {
    adjecentSquares.push(box - 1 + height);
  }

  //rightDown
  if ((box + 1) % width !== 0 && box + height < board.length) {
    adjecentSquares.push(box + 1 + height);
  }

  //leftUp
  if (box % width !== 0 && box - height >= 0) {
    adjecentSquares.push(box - 1 - height);
  }

  //rightUp
  if ((box + 1) % width !== 0 && box - height >= 0) {
    adjecentSquares.push(box + 1 - height);
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
