"use client";

import React, { createContext, useState } from "react";

export const AuthContext = createContext<{
  password: string | null;
  setPassword: React.Dispatch<React.SetStateAction<string | null>>;
} | null>(null);

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [password, setPassword] = useState<string | null>(null);

  return (
    <AuthContext.Provider value={{ password, setPassword }}>
      {children}
    </AuthContext.Provider>
  );
}
