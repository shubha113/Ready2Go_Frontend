import io from "socket.io-client";
import { toast } from "react-toastify";

let socket = null;
let isSocketInitializing = false;

export const initializeSocket = () => {
  console.log("Socket initialization attempt");
  console.log("Existing socket:", !!socket);
  console.log("Socket connected:", socket?.connected);
  // If socket already exists and is connected, return it
  if (socket && socket.connected) {
    console.log("Returning existing connected socket");
    return socket;
  }

  // Prevent multiple simultaneous initialization attempts
  if (isSocketInitializing) {
    console.log("Socket already initializing");
    return socket;
  }

  // Set initialization flag
  isSocketInitializing = true;

  console.log("Initializing socket connection...");

  // Create socket if it doesn't exist
  if (!socket) {
    socket = io("https://ready2go.onrender.com", {
      path: "/socket.io",
      transports: ["websocket", "polling"],
      withCredentials: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      autoConnect: true,
      secure: true,
      rejectUnauthorized: false,
    });
  }

  try {
    socket.connect();
    // Remove any existing listeners to prevent duplicates
    socket.removeAllListeners("connect");
    socket.removeAllListeners("connect_error");
    socket.removeAllListeners("disconnect");

    // Log all possible socket events
    socket.onAny((event, ...args) => {
      console.log(`[Socket Event]: ${event}`, args);
    });

    const handleConnect = () => { 
      console.log("🟢 Socket Connected Successfully");
      console.log("Socket ID:", socket.id);
      console.log("Socket Connected:", socket.connected);
      toast.success("Connected to real-time updates");
      isSocketInitializing = false;
    };

    const handleConnectError = (error) => {
      console.error("🔴 Socket Connection Error:", error);
      console.error("Error Details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
      toast.error(`Connection error: ${error.message}`);
      isSocketInitializing = false;
    };

    const handleDisconnect = (reason) => {
      console.log("🟠 Socket Disconnected:", reason);
      toast.warning("Disconnected from real-time updates");
      isSocketInitializing = false;
    };

    socket.on("connect", handleConnect);
    socket.on("connect_error", handleConnectError);
    socket.on("disconnect", handleDisconnect);

    socket.io.on("reconnect_attempt", (attemptNumber) => {
      console.log(`🔄 Reconnection Attempt: ${attemptNumber}`);
    });

    socket.on("connect_timeout", () => {
      console.error("⏰ Connection Timeout");
      toast.error("Connection timeout occurred");
      isSocketInitializing = false;
    });
  } catch (error) {
    console.error("🛑 Fatal Socket Initialization Error:", error);
    toast.error("Failed to initialize socket connection");
    isSocketInitializing = false;
  }

  return socket;
};

// Modify the locationSocket to check socket connection
export const locationSocket = {
  joinJobRoom: (jobId) => {
    if (!socket || !socket.connected) {
      console.warn("Socket not connected. Cannot join job room.");
      return;
    }
    console.log("Joining job room:", jobId);
    socket.emit("joinJobRoom", jobId);
  },

  leaveJobRoom: (jobId) => {
    if (!socket || !socket.connected) {
      console.warn("Socket not connected. Cannot leave job room.");
      return;
    }
    console.log("Leaving job room:", jobId);
    socket.emit("leaveJobRoom", jobId);
  },

  emitDriverLocation: (coordinates, jobId, driverId) => {
    console.log("Socket Location Emission Details:", {
      coordinates,
      jobId,
      driverId,
      socketExists: !!socket,
      socketConnected: socket?.connected,
    });

    // Ensure you're logging the exact payload being sent
    socket.emit(
      "driverLocationUpdate",
      {
        coordinates,
        jobId,
        driverId,
        timestamp: Date.now(),
      },
      (acknowledgement) => {
        // Add a callback to get server-side acknowledgement
        console.log("Server Acknowledgement:", acknowledgement);
      }
    );
  },

  joinJobRoom: (jobId) => {
    console.log("Joining job room:", jobId);
    socket.emit("joinJobRoom", jobId);
  },

  leaveJobRoom: (jobId) => {
    console.log("Leaving job room:", jobId);
    socket.emit("leaveJobRoom", jobId);
  },

  subscribeToLocationUpdates: (callback) => {
    console.log("Subscribing to location updates");
    socket.on("locationUpdate", (updateData) => {
      console.log("Location Update Received:", updateData);
      callback(updateData);
    });
  },

  unsubscribeFromLocationUpdates: () => {
    console.log("Unsubscribing from location updates");
    socket.off("locationUpdate");
  },
};

export default socket;
