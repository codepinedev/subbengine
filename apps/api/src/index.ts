import type { Server } from "node:http";

import { serve } from "@hono/node-server";
import { Server as SocketIOServer } from "socket.io";

import type {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "./infrastructure/websocket/socket.types";

import app from "./app";
import { container } from "./container/container";
import env from "./env";
import "./infrastructure/workers";

const server = serve(
  {
    fetch: app.fetch,
    port: env.PORT,
  },
  (info) => {
    // eslint-disable-next-line no-console
    console.log(`Server is running on http://localhost:${info.port}`);
  },
);

const io = new SocketIOServer<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(server as Server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
  transports: ["websocket", "polling"],
});

const socketService = container.socketService;
socketService.initialize(io);

io.on("connection", (socket) => {
  socket.data.leaderboardIds = new Set();

  socket.on("join:leaderboard", (leaderboardId) => {
    socketService.joinLeaderboard(socket, leaderboardId);
  });

  socket.on("leave:leaderboard", (leaderboardId) => {
    socketService.leaveLeaderboard(socket, leaderboardId);
  });

  socket.on("disconnect", () => {
    socketService.handleDisconnect(socket);
  });

  socket.on("error", (error) => {
    console.error(`🔴 Socket error for ${socket.id}:`, error);
  });
});
