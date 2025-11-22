import type z from "zod";

import type { insertPlayersSchema, selectPlayersSchema, updatePlayersSchema } from "@/infrastructure/database/schema";

export type InsertPlayerType = z.infer<typeof insertPlayersSchema>;
export type UpdatePlayerType = z.infer<typeof updatePlayersSchema>;
export type SelectPlayerType = z.infer<typeof selectPlayersSchema>;

export interface Player {
  id: string;
  userId: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  username: string;
  score: number;
  rank: number;
  avatarUrl: string | null;
  leaderboardId: string;
}
