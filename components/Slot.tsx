"use client";
import { SlotSymbol } from "@/lib/slotMachineGame";
import React from "react";
import { useRouter } from "next/navigation";
import { animate } from "framer-motion";
import { motion } from "framer-motion";
import { useMotionValue } from "framer-motion";
import { useTransform } from "framer-motion";
import { useEffect } from "react";

const arr = ["💩", "🍎", "🌯", "🤑"];

const getItem = (val: number) => {
  const rounded = Math.round(val);
  return arr[rounded % 4];
};

interface Props {
  symbol: SlotSymbol[0];
  pending: boolean;
}

export default function Slot({ symbol, pending }: Props) {
  const count = useMotionValue(0);
  const item = useTransform(count, getItem);

  useEffect(() => {
    const animation = animate(
      count,
      100 +
        (symbol === "💩" ? 0 : symbol === "🍎" ? 1 : symbol === "🌯" ? 2 : 3),
      { duration: 10 }
    );

    return animation.stop;
  }, []);
  return <motion.div className="outline outline-cyan-700 text-5xl select-none p-2">{pending ? "?" : symbol}</motion.div>;
}
