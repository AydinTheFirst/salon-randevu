import React, { type PropsWithChildren } from "react";
import useSWR from "swr";

import type { User } from "~/types";

interface AuthContextType {
  isAuthenticated: boolean;
  user: null | User;
}

export const AuthContext = React.createContext<AuthContextType>({
  isAuthenticated: false,
  user: null
});

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const { data: user } = useSWR<User>("/auth/@me", {
    onError: undefined
  });

  const isAuthenticated = Boolean(user);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: isAuthenticated,
        user: user ?? null
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
