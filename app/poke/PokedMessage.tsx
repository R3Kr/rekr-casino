import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import Image from "next/image";


export default async function PokedMessage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return redirect("/api/auth/signin");
  }

  const prismaUser = await prisma.user.findFirst({
    where: { id: session.user.id as string },
  });

  if (!prismaUser?.isPoked) {
    return <>You are not poked, for now...</>;
  }

  const pokerPromse =  prisma.poke.findFirst({
    where: { pokedUserId: session?.user?.id as string },
    orderBy: { date: "desc" },
    include: { poker: true },
  });

  const updatePromise =  prisma.user.update({
    where: { id: session.user.id as string },
    data: { isPoked: false },
  });
  
  const [poker] = await Promise.all([pokerPromse, updatePromise])

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
      {/* <Unpoke/> */}
    </>
  );
}
