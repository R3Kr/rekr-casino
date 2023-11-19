import React from "react";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

function mockDbCall() {
  return new Promise<number>((resolve, reject) => {
    // Simulating a database call with a timeout
    setTimeout(() => {
      // Mock data that might be returned from a database
      const data = 1337;

      // Simulating a successful database call
      resolve(data);

      // If there was an error, you would use reject(error) instead
      // reject(new Error("Failed to fetch data from the database."));
    }, 3000); // 1 second delay to simulate the database call
  });
}

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
      {session ? `Balance: ${data?.rekr_coins}` : "Login to see balance"}
    </div>
  );
}
