import React, { Suspense } from "react";
import PokedMessage from "./PokedMessage";
import PokePeople from "./PokePeople";

export default function page() {
  return (
    <div className="text-5xl text-white p-2 gap-2">
      <Suspense>
        <PokedMessage />
      </Suspense>
      <Suspense>
        <PokePeople />
      </Suspense>
    </div>
  );
}
