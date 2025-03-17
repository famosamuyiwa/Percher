import { ReactNode, createContext, useContext, useRef } from "react";
import React from "react";
import { useAuthQuery } from "@/hooks/query/useAuthQuery";
import { ToastProps, User } from "@/interfaces";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { Toast } from "@/components/animation-toast/components";
import { View } from "react-native";

interface GlobalContextType {
  isLoggedIn: boolean;
  user: User | undefined;
  loading: boolean;
  refetch: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult>;
  displayToast: (toast: ToastProps) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const { data, isLoading, refetch, isError, error } = useAuthQuery();
  const user = data?.data;
  let isLoggedIn = !!user;
  const toastRef = useRef<any>({});

  if (isError) {
    console.log("GlobalContextException: ", error);
    if (
      error.message.includes("JWT") ||
      error.message.includes("refresh token")
    ) {
      isLoggedIn = false;
    }
  }

  const displayToast = (toast: ToastProps) => {
    toastRef.current.show({
      type: toast.type,
      description: toast.description,
    });
  };

  return (
    <GlobalContext.Provider
      value={{ isLoggedIn, user, loading: isLoading, refetch, displayToast }}
    >
      {children}
      <Toast ref={toastRef} />
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
