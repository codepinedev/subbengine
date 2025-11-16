import { Worker } from "bullmq";

import { container } from "@/container/container";
import { redis } from "@/infrastructure/redis";

const scoreWorker = new Worker("scores", async (job) => {
  const { playerId, score, rank } = job.data;

  await container.leaderboardRepository.updatePlayerScore(playerId, score, rank);
}, { connection: redis });

export { scoreWorker };
