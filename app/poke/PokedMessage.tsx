import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import Image from "next/image";
import { unpoke } from "@/lib/actions";
import Unpoke from "./Unpoke";
export default async function PokedMessage() {
  const user = await getServerSession(authOptions);

  if (!user) {
    return redirect("/api/auth/signin");
  }

  const prismaUser = await prisma.user.findFirst({
    where: { id: user.user.id as string },
  });

  if (!prismaUser?.isPoked) {
    return <>You are not poked, for now...</>;
  }

  const poker = await prisma.poke.findFirst({
    where: { pokedUserId: user?.user?.id as string },
    orderBy: { date: "desc" },
    include: { poker: true },
  });

  

  return (
    <>
      You have been poked! <br />
      {poker && (
        <>
          Your poker is {poker.poker.name}{" "}
          {poker.poker.image && (
            <Image
              src={poker.poker.image}
              alt="poker image"
              width={200}
              height={200}
            />
          )}
        </>
      )}
      <Unpoke/>
    </>
  );
}
