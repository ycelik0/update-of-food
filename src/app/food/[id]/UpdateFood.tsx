"use client";

import useAuthContext from "@/lib/hooks/useAuthContext";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";

export default function UpdateFood({ food }: { food: Food }) {
  const id = useParams().id as string;
  const router = useRouter();
  const { password } = useAuthContext();

  const [englishName, setEnglishName] = useState(food.name);
  const [dutchName, setDutchName] = useState(food.nlName);
  const [skipValue, setSkipValue] = useState(id);

  const onChangeEnglish: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setEnglishName(e.target.value);
  };

  const onChangeDutch: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setDutchName(e.target.value);
  };

  const onPrevious = () => {
    const url = `${window.location.origin}/food/${(Number(id) - 1).toString()}`;
    router.push(url);
  };

  const onNext = async () => {
    try {
      if (food.name !== englishName || food.nlName !== dutchName)
        await axios.post(`${window.location.origin}/api/food/${id}`, {
          name: englishName,
          nlName: dutchName,
          password,
        });
      const url = `${window.location.origin}/food/${(
        Number(id) + 1
      ).toString()}`;
      router.push(url);
    } catch (error) {
      console.error(error);
    }
  };

  const onSkip = () => {
    const url = `${window.location.origin}/food/${skipValue}`;
    router.push(url);
  };

  return (
    <>
      <div className="flex flex-col gap-2">
        <h3 className="text-2xl">New English name:</h3>
        <input
          type="text"
          value={englishName}
          onChange={onChangeEnglish}
          className="p-2 rounded-md"
        />
        <h3 className="text-2xl">New Dutch name:</h3>
        <input
          type="text"
          value={dutchName}
          onChange={onChangeDutch}
          className="p-2 rounded-md"
        />
      </div>
      <div className="flex justify-between">
        <button
          className="bg-blue-400 p-2 rounded-lg min-w-24"
          onClick={onPrevious}
        >
          Previous
        </button>
        <button
          className="bg-blue-400 p-2 rounded-lg min-w-24"
          onClick={onNext}
        >
          Next
        </button>
      </div>
      <input
        type="number"
        value={skipValue}
        onChange={(e) => setSkipValue(e.target.value)}
      />
      <button className="bg-blue-400 p-2 rounded-lg min-w-24" onClick={onSkip}>
        Skip
      </button>
    </>
  );
}
