import SlotGame from "@/components/SlotGame";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function page() {
  const user = await getServerSession(authOptions);
  if (!user) {
    redirect("/api/auth/signin")
  }

  return <SlotGame />;
}
