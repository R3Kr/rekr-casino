"use client";
import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { animate } from "framer-motion";
import { motion } from "framer-motion";
import { useMotionValue } from "framer-motion";
import { useTransform } from "framer-motion";
import { useEffect } from "react";
import Slot from "@/components/Slot";
import { SlotSymbol } from "@/lib/slotMachineGame";
import { useMutation } from "@tanstack/react-query";
import { playSlotMachineAction } from "@/lib/actions";

const arr: SlotSymbol[0][] = ["💩", "🍎", "🌯", "🤑"];

export default function Page() {
  let [board, setBoard] = useState<Array<SlotSymbol[0]>>([
    "💩",
    "💩",
    "💩",
    "💩",
    "💩",
    "💩",
    "💩",
    "💩",
    "💩",
  ]);
  let [profit, setProfit] = useState(0);
  const { isPending, mutate } = useMutation({
    mutationFn: () => playSlotMachineAction(10),
    onError(error, variables, context) {
      alert(error);
    },
    onSuccess(data, variables, context) {
      setBoard(data.board.map((s) => s[0]));
      setProfit(data.profit);
    },
  });

  return (
    <div className="flex flex-col justify-center">
      <motion.div
        animate={{ x: [0, 100, 0] }}
        transition={{ ease: "easeOut", duration: 2 }}
        className="text-7xl text-cyan-300 p-2"
      >
        Welcome to the slotmachine! Time to spin away!
      </motion.div>
      <div className="flex p-2 text-white justify-center">Profit: {profit}</div>
      <div className="flex justify-center p-2">
        <div className="grid grid-cols-3 gap-2">
          <Slot symbol={board[0]} pending={isPending}></Slot>
          <Slot symbol={board[1]} pending={isPending}></Slot>
          <Slot symbol={board[2]} pending={isPending}></Slot>
          <Slot symbol={board[3]} pending={isPending}></Slot>
          <Slot symbol={board[4]} pending={isPending}></Slot>
          <Slot symbol={board[5]} pending={isPending}></Slot>
          <Slot symbol={board[6]} pending={isPending}></Slot>
          <Slot symbol={board[7]} pending={isPending}></Slot>
          <Slot symbol={board[8]} pending={isPending}></Slot>
        </div>
      </div>

      <button className="p-2 bg-red-400 align-middle" onClick={() => mutate()}>
        Play
      </button>
    </div>
  );
}
