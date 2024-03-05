"use client";
import React from "react";
import { User } from "@prisma/client";
import Image from "next/image";
import { poke, unpoke } from "@/lib/actions";

type Props = Pick<User, "id" | "name" | "image">;

export default function PokePerson({ id, name, image }: Props) {
  return (
    <div className="flex flex-row p-1 gap-2">
      {image ? <Image src={image} alt="pp" width={100} height={100} /> : name}
      <button
        className="bg-green-500"
        onClick={() => {
          poke(id);
          unpoke();
        }}
      >
        Poke
      </button>
    </div>
  );
}
