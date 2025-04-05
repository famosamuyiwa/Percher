import { ReactNode, createContext, useContext } from "react";
import React from "react";
import { INotification } from "@/interfaces";
import { useNotifications } from "@/hooks/useNotification";

interface AuthenticatedScreensContextType {
  notifications: INotification<any>[];
  unreadCount: number;
  markAllAsRead: () => void;
}

const AuthenticatedScreensContextTypeContext = createContext<
  AuthenticatedScreensContextType | undefined
>(undefined);

export const AuthenticatedScreensProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const { notifications, unreadCount, markAllAsRead } = useNotifications();
  return (
    <AuthenticatedScreensContextTypeContext.Provider
      value={{
        notifications,
        unreadCount,
        markAllAsRead,
      }}
    >
      {children}
    </AuthenticatedScreensContextTypeContext.Provider>
  );
};

export const useAuthenticatedScreensContext =
  (): AuthenticatedScreensContextType => {
    const context = useContext(AuthenticatedScreensContextTypeContext);
    if (!context) {
      throw new Error(
        "useAuthenticatedScreensContext must be used within a AuthenticatedScreensProvider"
      );
    }
    return context;
  };

export default AuthenticatedScreensProvider;
