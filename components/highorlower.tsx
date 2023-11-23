"use client";
import React, { useState } from "react";
import Card from "@/components/Card";
import { useMutation } from "@tanstack/react-query";
import { playHigherOrLowerAction } from "@/lib/actions";
import { Bet } from "@/lib/higherOrLowerGame";
import { useBalance } from "@/app/providers";

interface Props {
  visible_card: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;
}

export default function HighOrLower({ visible_card }: Props) {
  let [amount, setAmount] = useState(10);
  let [v_card, setV_card] = useState(visible_card);
  let {balance, addBalance} = useBalance()

  let { data, isPending, mutate } = useMutation({
    mutationFn: (bet: Bet) => playHigherOrLowerAction(amount, bet),
    onMutate: () => {
      addBalance(BigInt(-amount))
    },
    onError(error, bet, context) {
      addBalance(BigInt(amount))
      alert(error)
    },
    onSettled: (r) =>
      alert(
        r?.won ? `Congratz you won ${r?.balance_added}!` : "Sucks to suck loser"
      ),
    onSuccess: (r) => {
      setV_card(r.oldHiddenCard)
      addBalance(BigInt(r.balance_added))
    },
  });

  return (
    <div className="p-2">
      <div className="flex gap-2 flex-col bg-slate-200 h-80 justify-center items-center divide-y">
        <h1>Will the ? be higher or lower? 🤔</h1>
        <Card value={v_card}></Card>
        <Card></Card>
        <div className="flex gap-2">
          <button
            disabled={isPending || v_card === 13}
            onClick={() => mutate("higher")}
            className="p-2 bg-green-500"
          >
            &#8593;
          </button>
          <button
            disabled={isPending}
            onClick={() => mutate("equal")}
            className="p-2 bg-slate-500"
          >
            =
          </button>
          <button
            disabled={isPending || v_card === 1}
            onClick={() => mutate("lower")}
            className="p-2 bg-red-500"
          >
            &#8595;
          </button>
        </div>
        What to bet??
        <div className="flex flex-row gap-2">
          <button
            className={`${
              amount === 10
                ? " outline  outline-green-500 outline-offset-1 "
                : ""
            } bg-slate-500  p-2`}
            onClick={() => setAmount(10)}
          >
            10
          </button>
          <button
            className={`${
              amount === 20 ? " outline outline-green-500  outline-offset-1" : ""
            } bg-slate-500  p-2`}
            onClick={() => setAmount(20)}
          >
            20
          </button>
          <button
            className={`${
              amount === 30 ? " outline outline-green-500  outline-offset-1" : ""
            } bg-slate-500  p-2 `}
            onClick={() => setAmount(30)}
          >
            30
          </button>
          <button
            className={`${
              amount === 40
                ? " outline outline-green-500 outline-offset-1 "
                : ""
            } bg-slate-500 p-2 `}
            onClick={() => setAmount(40)}
          >
            40
          </button>
          <button
            className={`${
              amount === 50
                ? " outline outline-green-500 outline-offset-1 "
                : ""
            } bg-slate-500 p-2 `}
            onClick={() => setAmount(50)}
          >
            50
          </button>
        </div>
      </div>
    </div>
  );
}
