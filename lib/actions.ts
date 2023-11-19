"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "./authOptions";
import prisma from "./db";
import { redirect } from "next/navigation";
import { Bet } from "./higherOrLowerGame";
import { play } from "./higherOrLowerGame";
//import {z} from ZodAny;
import { z } from "zod";
import { revalidatePath } from "next/cache";

export async function playHigherOrLowerAction(
  user_amount: number,
  user_bet: Bet
) {
  const amount = z.number().parse(user_amount); //z.ZodNumber() user_amount;
  const bet = z
    .union([z.literal("higher"), z.literal("equal"), z.literal("lower")])
    .parse(user_bet);

  const session = await getServerSession(authOptions);
  if (!session) {
    return redirect("api/auth/signin");
  }

  const highorlow_operation = prisma.highOrLow.findUnique({
    where: { userId: session?.user.id as string },
  });

  const user_operation = prisma.user.findUnique({
    select: { rekr_coins: true },
    where: { id: session?.user.id as string },
  });

  const [highorlow, userBalance] = await Promise.all([
    highorlow_operation,
    user_operation,
  ]);

  const newBalance = userBalance && userBalance?.rekr_coins - BigInt(amount);
  if (newBalance && newBalance < 0) {
    throw Error("too little currency");
  }

  if (!highorlow) {
    throw Error("suspect");
  }

  const result = play(
    amount,
    bet,
    highorlow.visible_card,
    highorlow.hidden_card
  );

  const db_ops = [];

  db_ops.push(
    prisma.highOrLow.update({
      where: { userId: session.user.id as string },
      data: {
        visible_card: highorlow.hidden_card,
        hidden_card: result.newcard,
      },
    })
  );

  db_ops.push(
    prisma.user.update({
      where: { id: session.user.id as string },
      data: {
        rekr_coins: (newBalance as bigint) + BigInt(result.balanceAddition),
      },
    })
  );

  await Promise.all(db_ops);

  revalidatePath("/higherorlower");

  return {
    oldHiddenCard: highorlow.hidden_card as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13,
    won: result.won,
    correct_guess: result.correct_bet,
    balance_added: result.balanceAddition,
  };
}
