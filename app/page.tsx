import Image from "next/image";
import Pprtest from "@/components/pprtest";
import { Suspense } from "react";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <h1 className="text-5xl text-white p-2"> Hi, welcome to REKr casino!!</h1>
      <div className="flex flex-col gap-2 p-2">
        <Link href='/slots' className="w-full h-32 bg-red-700 flex justify-center items-center text-5xl text-yellow-400">Spin now!</Link>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-2">
          <Link href="/higherorlower" className="bg-stone-600  h-32 flex justify-center items-center text-4xl text-white">Play higher or lower!</Link>
          <Link href="/buycoins" className="bg-red-300    h-32 flex justify-center items-center text-4xl text-white">Buy coins!</Link>
          <Link href="/buycoins" className="bg-green-400  h-32 flex justify-center items-center text-4xl text-white">Buy coins!</Link>
          <Link href="/buycoins" className="bg-purple-300 h-32 flex justify-center items-center text-4xl text-white">Buy coins!</Link>
        </div>
      </div>
    </>
  );
}
