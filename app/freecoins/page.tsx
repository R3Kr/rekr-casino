import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }

  const daily_claims = await prisma.dailyClaim.findMany({
    where: {
      userId: session.user.id as string,
    },
  });

  const today = new Date();
  const claims_today = daily_claims.filter(
    (claim) =>
      claim.date.getUTCDate() === today.getUTCDate() &&
      claim.date.getUTCMonth() === today.getUTCMonth() &&
      claim.date.getUTCFullYear() === today.getUTCFullYear()
  );

  if (claims_today.length === 0) {
    const [a, b] = await Promise.all([
      prisma.dailyClaim.create({ data: { userId: session.user.id as string } }),
      prisma.user.update({
        where: { id: session.user.id as string },
        data: {
          rekr_coins: { increment: 200 },
        },
      }),
    ]);

    revalidatePath("/", "layout")
  }

  return (
    <div className="text-white text-2xl">
      {claims_today.length !== 0
        ? `Sorry ${session.user.name}, you have already claimed your REKr Coins today`
        : `Here is your 200 daily coins ${session.user.name}`}
    </div>
  );
}
