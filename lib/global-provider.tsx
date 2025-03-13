import { ReactNode, createContext, useContext } from "react";
import React from "react";
import { useAuthQuery } from "@/hooks/query/useAuthQuery";

interface User {
  $id: string;
  name: string;
  email: string;
  avatar: string;
}

interface GlobalContextType {
  isLoggedIn: boolean;
  user: User | null;
  loading: boolean;
  refetch: (newParams?: Record<string, string | number>) => Promise<void>;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const { data: user, isLoading, refetch } = useAuthQuery();
  const isLoggedIn = !!user;

  return (
    <GlobalContext.Provider
      value={{ isLoggedIn, user, loading: isLoading, refetch }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};

export default GlobalProvider;
