"use client";

import useAuthContext from "@/lib/hooks/useAuthContext";
import { redirect } from "next/navigation";
import React from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  const { password } = useAuthContext();
  return password !== null ? children : redirect(window.location.host);
}
