import Link from "next/link";
import React, { Suspense } from "react";
import Signin from "./Signin";
import Balance from "./Balance";

export default function Navbar() {
  return (
    <nav className="flex flex-col md:flex-row gap-2 p-2 pr-4">
      <Link className="p-2 bg-purple-500" href="/">
        REKr Casino
      </Link>
      <Link className="p-2 bg-red-500 text-cyan-300" href="/leaderboard">
        Leaderboard
      </Link>
      <Link className="p-2 bg-red-500 text-cyan-300" href="/slots">
        Slots
      </Link>
      <div className="p-2 flex-grow"></div>
      <Suspense
        fallback={<div className="text-white p-2">Loading...</div>}
      >
        <Balance />
      </Suspense>
      <Suspense fallback={<Signin suspense />}>
        <Signin />
      </Suspense>
    </nav>
  );
}
