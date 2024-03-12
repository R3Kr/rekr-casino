import React, { useEffect } from "react";
import prisma from "@/lib/db";
import { cache } from "react";
import Marquee from "react-fast-marquee";
import { Test } from "@/components/pprtest";

interface Score {
  name: string;
  score: number;
}

export default async function Page() {
  const usersPromise = cache(() =>
    prisma.user.findMany({
      select: {
        name: true,
        rekr_coins: true,
        daily_claims: true,
        referrals: true,
      },
      orderBy: { rekr_coins: "desc" },
    })
  )();

  const minesweeperPromise = prisma.playerMineSweeperBoard.findMany({
    select: {
      _count: { select: { boxes: { where: { mine: { isMine: true } } } } },
      mineBoard: { select: { width: true, height: true } },
      player: { select: { name: true } },
    },
    where: { gameOver: "WON" },
  });

  const [users, minesweeper] = await Promise.all([
    usersPromise,
    minesweeperPromise,
  ]);

  return (
    <Marquee speed={Math.random() / Math.random()} className="p-2">
      <table className="shadow-2xl">
        <tr className="bg-green-700">
          <th className="p-2">Name</th>
          <th className="p-2">Score</th>
          <th className="p-2">Daily Claims</th>
          <th className="p-2">Referrals</th>
        </tr>
        {users.map((s) => (
          <tr key={s.name} className="bg-green-500">
            <td key={s.name + "1"} className="p-2">
              {s.name}
            </td>
            <td key={s.name + "11"} className="p-2">
              {s.rekr_coins.toString()}
            </td>
            <td key={s.name + "dail"} className="p-2">
              {s.daily_claims.length}
            </td>
            <td key={s.name + "referr"} className="p-2">
              {s.referrals.length}
            </td>
          </tr>
        ))}
      </table>
      <table className="shadow-2xl">
        <tr className="bg-green-700">
          <th className="p-2">Name</th>
          <th className="p-2">Width</th>
          <th className="p-2">Height</th>
          <th className="p-2">Mines</th>
          <th className="p-2">Mine ratio</th>
        </tr>
        {minesweeper
          .toSorted((a, b) => b._count.boxes / (b.mineBoard.height * b.mineBoard.width) - a._count.boxes / (a.mineBoard.height * a.mineBoard.width))
          .map((s) => (
            <tr key={s.player.name} className="bg-green-500">
              <td key={s.player.name + "1"} className="p-2">
                {s.player.name}
              </td>
              <td key={s.player.name + "11"} className="p-2">
                {s.mineBoard.width}
              </td>
              <td key={s.player.name + "dail"} className="p-2">
                {s.mineBoard.height}
              </td>
              <td key={s.player.name + "referr"} className="p-2">
                {s._count.boxes}
              </td>
              <td key={s.player.name + "refwwwerr"} className="p-2">
                {s._count.boxes / (s.mineBoard.height * s.mineBoard.width)}
              </td>
            </tr>
          ))}
      </table>
    </Marquee>
  );
}
