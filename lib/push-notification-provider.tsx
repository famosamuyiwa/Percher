import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import * as Notifications from "expo-notifications";
import { registerForPushNotificationsAsync } from "@/utils/registerForPushNotificationsAsync";
import { Subscription } from "@/types/types";
import { updateUserPushToken } from "@/api/api.service";
import { useGlobalContext } from "./global-provider";

interface NotificationContextType {
  expoPushToken: string | null;
  notification: Notifications.Notification | null;
  error: Error | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const usePushNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};

interface PushNotificationProviderProps {
  children: ReactNode;
}

export const PushNotificationProvider: React.FC<
  PushNotificationProviderProps
> = ({ children }) => {
  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] =
    useState<Notifications.Notification | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useGlobalContext();
  const notificationListener = useRef<Subscription>();
  const responseListener = useRef<Subscription>();

  useEffect(() => {
    registerForPushNotificationsAsync().then(
      (token) => setExpoPushToken(token),
      (error) => setError(error)
    );

    notificationListener.current =
      Notifications.addNotificationReceivedListener(async (notification) => {
        // console.log("🔔 Notification Received: ", notification);
        setNotification(notification);

        // Wait a brief moment to ensure the notification is displayed
        // then dismiss it automatically
        setTimeout(async () => {
          try {
            // If you want to dismiss just this specific notification
            if (notification.request.identifier) {
              await Notifications.dismissNotificationAsync(
                notification.request.identifier
              );
            }
            // Or if you want to dismiss all notifications
            // await Notifications.dismissAllNotificationsAsync();
          } catch (error) {
            console.error("Error dismissing notification:", error);
          }
        }, 2000); // Adjust this delay as needed
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        // console.log(
        //   "🔔 Notification Response: ",
        //   JSON.stringify(response, null, 2),
        //   JSON.stringify(response.notification.request.content.data, null, 2)
        // );
        // Handle the notification response here
      });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!user || !expoPushToken) return;

    const tokenUpdate = async () => {
      try {
        await updateUserPushToken(expoPushToken);
      } catch (err) {
        console.log("error: ", err);
      }
    };

    if (!user.expoPushToken) {
      tokenUpdate();
    }
  }, [expoPushToken]);

  return (
    <NotificationContext.Provider
      value={{ expoPushToken, notification, error }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
