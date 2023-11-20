import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import React from "react";
import { redirect } from "next/navigation";
import prisma from "@/lib/db";
import { ReferralType } from "@prisma/client";
import Link from "next/link";

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }

  const referral = await prisma.referral.findFirst({
    where: {
      userId: session.user.id as string,
      referralType: ReferralType.GITHUB_FOLLOW,
    },
  });

  return (
    <>
      <Link
        className="text-white text-2xl"
        href={referral ? "/" : "https://github.com/R3Kr"}
      >
        {referral
          ? "It seems you already have claimed this referral reward clieck here to go back"
          : "Click here to follow the R3Kr githubpage"}
      </Link>
    </>
  );
}
