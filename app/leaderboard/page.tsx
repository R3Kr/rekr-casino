import React from "react";
import prisma from "@/lib/db";
import { cache } from "react";

interface Score {
  name: string;
  score: number;
}

export default async function Page() {
  const top10: Array<Score> = [
    { name: "hejsan", score: 32 },
    { name: "hejsn", score: 322 },
    { name: "hean", score: 232 },
    { name: "he22jsan", score: 321 },
    { name: "hejs213123an", score: 532 },
    { name: "he1123123123123123jsan", score: 32123123 },
  ];

  const users = await cache(() =>
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

  return (
    <div className="p-2">
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
    </div>
  );
}
