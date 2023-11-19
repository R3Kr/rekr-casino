import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import Link from "next/link";
import React from "react";

interface Props {
  suspense?: boolean;
}
export default async function Signin({ suspense }: Props) {
  const session = suspense ? null : await getServerSession(authOptions);
  return (
    <Link
      href={session ? "/api/auth/signout" : "/api/auth/signin"}
      className={`${session ? "bg-red-500" : "bg-green-500"} p-2`}
    >
      {session ? "Logout" : "Login"}
    </Link>
  );
}
