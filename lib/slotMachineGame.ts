export type SlotSymbol = ["💩", 0] | ["🍎", 1.1] | ["🌯", 2.2] | ["🤑", 20];

function getSlot(): SlotSymbol {
  const rand = Math.random();
  return rand < 0.3
    ? ["💩", 0]
    : rand < 0.7
    ? ["🍎", 1.1]
    : rand < 0.9
    ? ["🌯", 2.2]
    : ["🤑", 20];
}

function getBoard(): SlotSymbol[] {
  const board: Array<SlotSymbol> = [];
  board.push(getSlot());
  board.push(getSlot());
  board.push(getSlot());
  board.push(getSlot());
  board.push(getSlot());
  board.push(getSlot());
  board.push(getSlot());
  board.push(getSlot());
  board.push(getSlot());
  return board;
}

function calculateProfit(betAmount: number, board: SlotSymbol[]) {
  let profit = 0;

  //vertical rows
  if (board[0][0] === board[1][0] && board[0][0] === board[2][0]) {
    profit += betAmount * board[0][1];
  }
  if (board[3][0] === board[4][0] && board[3][0] === board[5][0]) {
    profit += betAmount * board[0][1];
  }
  if (board[6][0] === board[7][0] && board[6][0] === board[8][0]) {
    profit += betAmount * board[0][1];
  }

  //diagonal rows
  if (board[2][0] === board[4][0] && board[2][0] === board[6][0]) {
    profit += betAmount * board[0][1];
  }
  if (board[0][0] === board[4][0] && board[0][0] === board[8][0]) {
    profit += betAmount * board[0][1];
  }

  return profit;
}

export function slotMachineSpin(betAmount: number) {
  const board = getBoard();
  const profit = calculateProfit(betAmount, board);
  return {
    profit: profit,
    board: board,
  };
}
