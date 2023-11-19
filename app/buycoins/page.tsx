"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    router.push("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  });

  return <div>:)</div>;
}
