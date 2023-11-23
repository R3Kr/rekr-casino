import Link from "next/link";
import React, { Suspense } from "react";
import Signin from "./Signin";
import Balance from "./Balance";

function mockDbCall() {
  return new Promise<number>((resolve, reject) => {
    // Simulating a database call with a timeout
    setTimeout(() => {
      // Mock data that might be returned from a database
      const data = 1337;

      // Simulating a successful database call
      resolve(data);

      // If there was an error, you would use reject(error) instead
      // reject(new Error("Failed to fetch data from the database."));
    }, 3000); // 1 second delay to simulate the database call
  });
}

export default async function Navbar() {
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
      <Suspense fallback={<div className="text-white p-2">Loading...</div>}>
        <Balance/>
      </Suspense>
      <Suspense fallback={<Signin suspense />}>
        <Signin />
      </Suspense>
    </nav>
  );
}
