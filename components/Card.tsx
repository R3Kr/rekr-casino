"use client";
import React from "react";
import { motion } from "framer-motion";

interface Props {
  value?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;
}

export default function Card({ value }: Props) {
  const spinTransition = {
    loop: Infinity,
    ease: "linear",
    duration: 2,
  };

  const cards = [
    "",
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
  ];

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={spinTransition}
      className="outline-dashed outline-black w-min p-2"
    >
      {!value ? "?" :  cards[value]}
    </motion.div>
  );
}
