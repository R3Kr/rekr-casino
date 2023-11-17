import React from "react";

interface Score {
  name: string;
  score: number;
}

export default function Page() {
  const top10: Array<Score> = [
    { name: "hejsan", score: 32 },
    { name: "hejsn", score: 322 },
    { name: "hean", score: 232 },
    { name: "he22jsan", score: 321 },
    { name: "hejs213123an", score: 532 },
    { name: "he1123123123123123jsan", score: 32123123 },
  ];

  return (
    <div className="p-2">
      <table className="shadow-2xl">
        <tr className="bg-green-700">
          <th className="p-2">Name</th>
          <th className="p-2">Score</th>
        </tr>
        {top10.sort((a, b) => b.score - a.score).map((s) => (
          <tr key={s.name} className="bg-green-500">
            <td key={s.name + "1"} className="p-2">{s.name}</td>
            <td key={s.name + "11"} className="p-2">{s.score}</td>
          </tr>
        ))}
      </table>
    </div>
  );
}
