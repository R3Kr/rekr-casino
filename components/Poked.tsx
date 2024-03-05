import React from "react";
import { getServerSession } from "next-auth";
import prisma from "@/lib/db";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

export default async function Poked() {
  const session = await getServerSession(authOptions);
  const data =
    session &&
    (await prisma.user.findUnique({
      where: { id: session.user.id as string },
    }));

  if (data?.isPoked) {
    return redirect("/poke");
  }
  return <></>;
}
