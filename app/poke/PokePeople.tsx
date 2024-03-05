import prisma from "@/lib/db";
import React from "react";
import PokePerson from "./PokePerson";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export default async function PokePeople() {
  const session = await getServerSession(authOptions);
  const peopleToBePoked = await prisma.user.findMany({
    where: { isPoked: false, NOT: { id: session?.user?.id || "" } },
    select: {
      id: true,
      name: true,
      image: true,
      poked_for_poke: {
        where: { pokerId: session?.user?.id as string | undefined },
      },
    },
  });

  return (
    <>
      {peopleToBePoked.map((p, i) => (
        <PokePerson
          key={i}
          id={p.id}
          name={p.name}
          image={p.image}
          timesPoked={p.poked_for_poke.length}
        ></PokePerson>
      ))}
    </>
  );
}
