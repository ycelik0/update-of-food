import Image from "next/image";
import React from "react";
import UpdateFood from "./UpdateFood";

export default function FoodItem({ food }: { food: Food }) {
  return (
    <div className="flex justify-center items-start mt-20 w-screen h-screen">
      <div className="flex flex-col justify-center gap-4 bg-slate-200 p-4 min-w-[25rem] max-w-[30rem]">
        <Image
          src={food.image}
          alt={food.name}
          width={150}
          height={150}
          className="rounded-full self-center"
        />
        <div className="text-center">
          <h3 className="text-2xl">English name:</h3>
          <p className="text-xl">{food.name}</p>
        </div>
        <div className="text-center">
          <h3 className="text-2xl">Dutch name:</h3>
          <p className="text-xl">{food.nlName}</p>
        </div>
        <UpdateFood food={food} />
        <div>
          <p>Alleen als je op next klikt update hij de namen.</p>
          <p>Niet de inputs aanraken als je het niet wilt updaten.</p>
          <p>
            Als je op previous klikt laat hij de auto resultaat zien. refresh om
            de nieuwe te zien.
          </p>
        </div>
      </div>
    </div>
  );
}
