import type { Server, Socket } from "socket.io";

import type {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from "./socket.types";

type TypedSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

type TypedServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

export class SocketService {
  private io: TypedServer | null = null;

  initialize(io: TypedServer) {
    this.io = io;
  }

  getIO(): TypedServer | null {
    return this.io;
  }

  /**
   * Broadcast leaderboard update to all clients subscribed to that leaderboard
   */
  broadcastLeaderboardUpdate(leaderboardId: string) {
    if (!this.io) {
      console.error("Socket.IO not initialized");
      return;
    }

    // Emit to all clients in the leaderboard room
    this.io.to(`leaderboard:${leaderboardId}`).emit("leaderboard:updated", {
      leaderboardId,
    });

    console.log(`Broadcasting leaderboard update for: ${leaderboardId}`);
  }

  /**
   * Broadcast score update to all clients subscribed to that leaderboard
   */
  broadcastScoreUpdate(
    leaderboardId: string,
    playerId: string,
    newScore: number,
  ) {
    if (!this.io) {
      console.error("Socket.IO not initialized");
      return;
    }

    this.io.to(`leaderboard:${leaderboardId}`).emit("score:updated", {
      leaderboardId,
      playerId,
      newScore,
    });

    console.log(
      `Broadcasting score update for leaderboard: ${leaderboardId}, player: ${playerId}, score: ${newScore}`,
    );
  }

  /**
   * Notify about player joining
   */
  broadcastPlayerJoined(leaderboardId: string, playerId: string) {
    if (!this.io) {
      console.error("Socket.IO not initialized");
      return;
    }

    this.io.to(`leaderboard:${leaderboardId}`).emit("player:joined", {
      leaderboardId,
      playerId,
    });
  }

  /**
   * Notify about player removal
   */
  broadcastPlayerRemoved(leaderboardId: string, playerId: string) {
    if (!this.io) {
      console.error("Socket.IO not initialized");
      return;
    }

    this.io.to(`leaderboard:${leaderboardId}`).emit("player:removed", {
      leaderboardId,
      playerId,
    });
  }

  /**
   * Get statistics about connected clients
   */
  async getStats() {
    if (!this.io) {
      return {
        totalClients: 0,
        rooms: 0,
      };
    }

    const sockets = await this.io.fetchSockets();
    const rooms = this.io.sockets.adapter.rooms;

    // Count only leaderboard rooms (exclude socket ID rooms)
    const leaderboardRooms = Array.from(rooms.keys()).filter(room =>
      room.startsWith("leaderboard:"),
    );

    return {
      totalClients: sockets.length,
      rooms: leaderboardRooms.length,
      leaderboardRooms,
    };
  }

  /**
   * Handle client joining a leaderboard room
   */
  joinLeaderboard(socket: TypedSocket, leaderboardId: string) {
    const roomName = `leaderboard:${leaderboardId}`;
    socket.join(roomName);

    // Add to socket data
    if (!socket.data.leaderboardIds) {
      socket.data.leaderboardIds = new Set();
    }
    socket.data.leaderboardIds.add(leaderboardId);

    console.log(`Socket ${socket.id} joined leaderboard: ${leaderboardId}`);
  }

  /**
   * Handle client leaving a leaderboard room
   */
  leaveLeaderboard(socket: TypedSocket, leaderboardId: string) {
    const roomName = `leaderboard:${leaderboardId}`;
    socket.leave(roomName);

    // Remove from socket data
    if (socket.data.leaderboardIds) {
      socket.data.leaderboardIds.delete(leaderboardId);
    }

    console.log(`Socket ${socket.id} left leaderboard: ${leaderboardId}`);
  }

  /**
   * Handle client disconnect - cleanup
   */
  handleDisconnect(socket: TypedSocket) {
    if (socket.data.leaderboardIds) {
      socket.data.leaderboardIds.forEach((leaderboardId) => {
        this.leaveLeaderboard(socket, leaderboardId);
      });
    }

    console.log(`Socket ${socket.id} disconnected`);
  }
}
