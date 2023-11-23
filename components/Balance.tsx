import React from "react";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import ClientBalance from "./ClientBalance";



export default async function Balance() {
  const session = await getServerSession(authOptions);
  const data =
    session &&
    await prisma.user.findUnique({
      select: { rekr_coins: true },
      where: { id: session.user.id as string },
    });

  return (
    <div className="text-white p-2">
      {session ? <ClientBalance server_balance={data?.rekr_coins as bigint}></ClientBalance> : "Login to see balance"}
    </div>
  );
}
