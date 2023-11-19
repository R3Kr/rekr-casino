import React from "react";
import HighOrLower from "../../components/highorlower";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";

export default async function Page() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("api/auth/signin");
  }

  const highorlow = await prisma.highOrLow.findFirst({
    where: { userId: session.user.id as string },
  });

  let v_card;

  if (!highorlow) {
    const visible_card = Math.floor(Math.random() * (13 - 1 + 1)) + 1;
    const hidden_card = Math.floor(Math.random() * (13 - 1 + 1)) + 1;

    await prisma.highOrLow.create({
      data: {
        userId: session.user.id as string,
        hidden_card: hidden_card,
        visible_card: visible_card,
      },
    });

    v_card = visible_card;
  } else {
    v_card = highorlow.visible_card;
  }

  return (
    <HighOrLower
      visible_card={
        v_card as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13
      }
    />
  );
}
