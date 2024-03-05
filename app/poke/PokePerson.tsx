import React from "react";
import { User } from "@prisma/client";
import Image from "next/image";
import { poke } from "@/lib/actions";
import { PokeButton } from "./PokeButton";

type Props = Pick<User, "id" | "name" | "image"> & { timesPoked: number };

export default function PokePerson({ id, name, image, timesPoked }: Props) {
  //const pokeFormAction = poke.bind(null, id)
  return (
    <div className="flex flex-row p-1 gap-2">
      {image ? <Image src={image} alt="pp" width={100} height={100} /> : name}
      <form className="flex bg-green-500" action={poke}>
        <input hidden={true} type="text" name="id" value={id} />
        <PokeButton />
      </form>
      <div className="text-xl p-2 border-red-600 border-2">
        You have poked {name} {timesPoked} times
      </div>
    </div>
  );
}
