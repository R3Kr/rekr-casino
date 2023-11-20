export type Bet = "higher" | "lower" | "equal";

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

interface PlayResult {
  won: boolean;
  balanceAddition: number;
  newcard: number;
  correct_bet: Bet;
}

export function play(
  amount: number,
  bet: Bet,
  visible_card: number,
  hidden_card: number
): PlayResult {
  const diff = hidden_card - visible_card;

  const correct_bet: Bet = diff === 0 ? "equal" : diff < 0 ? "lower" : "higher";

  const won = bet === correct_bet;

  const balanceAddition = !won ? 0 : bet === "equal" ? amount * 10 : amount * 1.3;

  const newcard = getRandomNumber(1, 13);

  return {
    won: won,
    balanceAddition: balanceAddition,
    newcard: newcard,
    correct_bet: correct_bet,
  };
}
