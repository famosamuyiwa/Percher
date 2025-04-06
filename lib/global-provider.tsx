import { ReactNode, createContext, useContext, useRef } from "react";
import React from "react";
import { useAuthQuery } from "@/hooks/query/useAuthQuery";
import { INotification, ToastProps, User } from "@/interfaces";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { Toast } from "@/components/animation-toast/components";
import Loader from "@/components/Loader";
import { useNotifications } from "@/hooks/useNotification";
import MapBottomSheet from "@/components/MapBottomSheet";

interface GlobalContextType {
  isLoggedIn: boolean;
  user: User | undefined;
  loading: boolean;
  refetch: (
    options?: RefetchOptions | undefined
  ) => Promise<QueryObserverResult>;
  displayToast: (toast: ToastProps) => void;
  showLoader: () => void;
  hideLoader: () => void;
  alertComingSoon: () => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
  const { data, isLoading, refetch, isError, error } = useAuthQuery();
  const user = data?.data;
  let isLoggedIn = !!user;
  const toastRef = useRef<any>({});
  const loaderRef = useRef<any>({});
  const mapBottomSheetRef = useRef<any>({});
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

  const showLoader = () => {
    loaderRef.current.show();
  };

  const hideLoader = () => {
    loaderRef.current.hide();
  };

  const alertComingSoon = () => {
    alert("This feature is not yet available. Coming Soon 🚀");
  };

  return (
    <GlobalContext.Provider
      value={{
        isLoggedIn,
        user,
        loading: isLoading,
        refetch,
        displayToast,
        showLoader,
        hideLoader,
        alertComingSoon,
      }}
    >
      {children}
      <Loader ref={loaderRef} />
      <Toast ref={toastRef} />
      <MapBottomSheet ref={mapBottomSheetRef} />
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
