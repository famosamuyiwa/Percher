// src/services/notificationService.ts
import { API_BASE_URL } from "@/environment";
import { io, Socket } from "socket.io-client";
import * as SecureStore from "expo-secure-store";

class NotificationService {
  private socket: Socket | null = null;
  private token: string | null = null;
  private listeners: {
    newNotification: Array<(notification: any) => void>;
    unreadCount: Array<(count: number) => void>;
    recentNotifications: Array<(notifications: any[]) => void>;
  } = {
    newNotification: [],
    unreadCount: [],
    recentNotifications: [],
  };
  private isConnecting = true;

  async connect() {
    try {
      const accessToken = await SecureStore.getItemAsync("accessToken");
      if (!accessToken) {
        console.error("No access token found");
        return;
      }

      this.token = accessToken;

      // Initialize socket connection
      this.socket = io(API_BASE_URL, {
        auth: {
          token: `Bearer ${accessToken}`,
        },
        transports: ["websocket"],
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: Infinity, // Try indefinitely
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000, // Max delay between attempts
        timeout: 20000, // Connection timeout
        forceNew: true, // Force a new connection
        path: "/socket.io/", // Socket.io path
      });

      // Handle connection events
      this.socket.once("connect", () => {
        console.log("Connected to notification server");
        this.isConnecting = false;
        // Set up all listeners after successful connection
        this.setupListeners();
      });

      this.socket.on("connect_error", (error) => {
        console.error("Connection error:", error);
        this.isConnecting = false;
      });

      this.socket.on("disconnect", (reason) => {
        console.log("Disconnected from notification server. Reason:", reason);
        this.isConnecting = false;
      });

      this.socket.on("reconnect_attempt", (attemptNumber) => {
        console.log(`Attempting to reconnect (attempt ${attemptNumber})`);
      });

      this.socket.on("reconnect_failed", () => {
        console.log("Reconnection failed, will keep trying...");
      });

      this.socket.on("error", (error) => {
        console.error("Socket error:", error);
        this.isConnecting = false;
      });
    } catch (error) {
      console.error("Failed to connect to notification server:", error);
    }
  }

  private setupListeners() {
    if (!this.socket) return;

    // Remove existing listeners first
    this.socket.off("newNotification");
    this.socket.off("unreadCount");
    this.socket.off("recentNotifications");

    // Set up new notification listener
    this.socket.on("newNotification", (notification) => {
      this.listeners.newNotification.forEach((callback) =>
        callback(notification)
      );
    });

    // Set up unread count listener
    this.socket.on("unreadCount", (count) => {
      this.listeners.unreadCount.forEach((callback) => callback(count));
    });

    // Set up recent notifications listener
    this.socket.on("recentNotifications", (notifications) => {
      this.listeners.recentNotifications.forEach((callback) =>
        callback(notifications)
      );
    });
  }

  // Listen for new notifications
  onNewNotification(callback: (notification: any) => void) {
    console.log("Setting up new notification listener");
    this.listeners.newNotification.push(callback);
  }

  // Listen for unread count updates
  onUnreadCount(callback: (count: number) => void) {
    console.log("Setting up unread count listener");
    this.listeners.unreadCount.push(callback);
  }

  // Listen for recent notifications
  onRecentNotifications(callback: (notifications: any[]) => void) {
    console.log("Setting up recent notifications listener");
    this.listeners.recentNotifications.push(callback);
  }

  // Remove listeners
  removeListener(
    event: "newNotification" | "unreadCount" | "recentNotifications",
    callback: any
  ) {
    if (this.socket) {
      this.socket.off(event, callback);
      const filtered = this.listeners[event].filter((cb) => cb !== callback);
      this.listeners[event] = filtered as any;
    }
  }

  // Mark a notification as read
  markAsRead(notificationId: number) {
    if (this.socket?.connected) {
      console.log("Marking notification as read:", notificationId);
      this.socket.emit("markAsRead", notificationId);
    } else {
      console.warn("Socket not connected, cannot mark notification as read");
    }
  }

  // Mark all notifications as read
  markAllAsRead() {
    if (this.socket?.connected) {
      console.log("Marking all notifications as read");
      this.socket.emit("markAllAsRead");
    } else {
      console.warn(
        "Socket not connected, cannot mark all notifications as read"
      );
    }
  }

  // Clean up socket connection
  disconnect() {
    if (this.socket) {
      console.log("Disconnecting from notification server");
      this.socket.disconnect();
      this.socket = null;
      // Clear all listeners
      this.listeners = {
        newNotification: [],
        unreadCount: [],
        recentNotifications: [],
      };
    }
  }
}

export const notificationService = new NotificationService();
