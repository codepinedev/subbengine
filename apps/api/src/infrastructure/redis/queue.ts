import { Queue } from "bullmq";

import { redis } from "./index";

const scoreQueue = new Queue("scores", { connection: redis });

export async function enqueueScoreJob(leaderboardId: string, playerId: string, score: number, rank: number) {
  await scoreQueue.add("persist", { leaderboardId, playerId, score, rank });
}
