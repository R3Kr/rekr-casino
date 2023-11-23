// @ts-ignore
import { expect, test } from "bun:test";

import {
  SlotSymbol,
  calculateProfit,
  slotMachineSpin,
} from "../lib/slotMachineGame";

const apple = ["🍎", 1, 1];

test("2 + 2", () => {
  expect(2 + 2).toBe(4);
});

test("rightScore", () => {
  const board: Array<SlotSymbol> = [];
  board.push(["🍎", 2]);
  board.push(["🍎", 2]);
  board.push(["🍎", 2]);
  board.push(["💩", 0]);
  board.push(["💩", 0]);
  board.push(["💩", 0]);
  board.push(["💩", 0]);
  board.push(["💩", 0]);
  board.push(["💩", 0]);

  expect(calculateProfit(10, board)).toBe(20);
});

test("rightProbability", () => {
  let profit = 0;

  for (let i = 0; i < 1000000; i++) {
    profit += slotMachineSpin(10).profit;
  }

  console.log(profit)
  expect(profit > 9500000 && profit < 10000000).toBe(true)
});
