import React from "react";
import Minesweeper from "./Minesweeper";
import { genBombs } from "@/lib/minesweeper";

export default function page() {
  return <div className="text-xl text-white"><Minesweeper /></div>;
}
