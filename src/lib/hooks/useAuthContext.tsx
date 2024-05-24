import React from "react";
import { AuthContext } from "../context/authContext";

export default function useAuthContext() {
  const authContext = React.useContext(AuthContext);
  if (authContext === null) {
    throw new Error("Cant use AuthContext outside the AuthContext.Provider");
  }

  return authContext;
}
