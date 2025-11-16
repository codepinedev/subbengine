// Server to Client events - what the server emits to clients
export interface ServerToClientEvents {
  "leaderboard:updated": (data: { leaderboardId: string }) => void;
  "score:updated": (data: {
    leaderboardId: string;
    playerId: string;
    newScore: number;
  }) => void;
  "player:joined": (data: { leaderboardId: string; playerId: string }) => void;
  "player:removed": (data: { leaderboardId: string; playerId: string }) => void;
}

// Client to Server events - what clients can emit to the server
export interface ClientToServerEvents {
  "join:leaderboard": (leaderboardId: string) => void;
  "leave:leaderboard": (leaderboardId: string) => void;
}

// Inter-server events (for scaling with multiple servers)
export interface InterServerEvents {
  ping: () => void;
}

// Socket data (custom data attached to each socket)
export interface SocketData {
  userId?: string;
  sessionId?: string;
  leaderboardIds: Set<string>;
}
