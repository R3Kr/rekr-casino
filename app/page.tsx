import Image from "next/image";

export default function Home() {
  return (
    <>
      <h1 className="text-5xl"> Hi, welcome to REKr casino!!</h1>
      <div className="flex flex-col gap-2 p-2">
        <div className="w-full h-32 bg-red-700">awdawdaw</div>
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-2">
          <div className="bg-stone-600  h-32">qwe</div>
          <div className="bg-red-300    h-32">qwe</div>
          <div className="bg-green-400  h-32">qqwe</div>
          <div className="bg-purple-300 h-32">qwe</div>
        </div>
      </div>
    </>
  );
}
