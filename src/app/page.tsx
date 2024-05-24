"use client";

import React, { useState } from "react";
import useAuthContext from "@/lib/hooks/useAuthContext";
import { redirect } from "next/navigation";
import axios from "axios";

export default function Home() {
  const { password, setPassword } = useAuthContext();
  const [password_, setPassword_] = useState("");

  const onCheck = async () => {
    try {
      const res = await axios.post("http://localhost:3000/api/password", {
        password: password_,
      });
      setPassword(password_);
    } catch (error) {
      console.error(error);
      setPassword(null);
    }
  };

  return password !== null ? (
    redirect("http://localhost:3000/1")
  ) : (
    <div className="flex justify-center items-start mt-20 w-screen h-screen">
      <div className="flex flex-col justify-center gap-4 bg-slate-200 p-4 min-w-[25rem] max-w-[30rem]">
        <p>Password</p>
        <input
          type="password"
          value={password_}
          onChange={(e) => setPassword_(e.target.value)}
          className="p-2 rounded-md"
        />
        <button
          className="bg-blue-400 p-2 rounded-lg min-w-24"
          onClick={onCheck}
        >
          Check
        </button>
      </div>
    </div>
  );
}
