// src/hooks/useNotifications.ts
import { notificationService } from "@/api/notification.service";
import { useState, useEffect, useCallback } from "react";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isConnected, setIsConnected] = useState(false);

  const handleNewNotification = useCallback((notification: any) => {
    setNotifications((prev) => [notification, ...prev]);
  }, []);

  const handleUnreadCount = useCallback((count: number) => {
    setUnreadCount(count);
  }, []);

  const handleRecentNotifications = useCallback(
    (recentNotifications: any[]) => {
      setNotifications(recentNotifications);
    },
    []
  );

  useEffect(() => {
    let mounted = true;

    const setupNotifications = async () => {
      try {
        // Connect to notification service
        await notificationService.connect();

        // Set up listeners
        notificationService.onNewNotification(handleNewNotification);
        notificationService.onUnreadCount(handleUnreadCount);
        notificationService.onRecentNotifications(handleRecentNotifications);

        if (mounted) {
          setIsConnected(true);
        }
      } catch (error) {
        console.error("Failed to setup notifications:", error);
      }
    };

    setupNotifications();

    // Cleanup on unmount
    return () => {
      mounted = false;
      notificationService.removeListener(
        "newNotification",
        handleNewNotification
      );
      notificationService.removeListener("unreadCount", handleUnreadCount);
      notificationService.removeListener(
        "recentNotifications",
        handleRecentNotifications
      );
      notificationService.disconnect();
    };
  }, [handleNewNotification, handleUnreadCount, handleRecentNotifications]);

  const markAsRead = useCallback(
    (notificationId: number) => {
      if (isConnected) {
        notificationService.markAsRead(notificationId);
      }
    },
    [isConnected]
  );

  const markAllAsRead = useCallback(() => {
    if (isConnected) {
      notificationService.markAllAsRead();
    }
  }, [isConnected]);

  return {
    notifications,
    unreadCount,
    isConnected,
    markAsRead,
    markAllAsRead,
  };
};
