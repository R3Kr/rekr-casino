"use client";
import React from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  return (
    <>
      <h1 className="text-7xl text-cyan-300 p-2">
        Welcome to the slotmachine! Time to spin away!
      </h1>
      <div className="flex justify-center pt-32">
        <button
          className="bg-pink-500 p-3 text-orange-300 rounded-full"
          onClick={() => {
            alert("Coming soon....");
            router.push("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
            //   setTimeout(
            //     () => router.push("https://www.youtube.com/watch?v=dQw4w9WgXcQ"),
            //     3000
            //   );
          }}
        >
          Click me!
        </button>
      </div>
    </>
  );
}
