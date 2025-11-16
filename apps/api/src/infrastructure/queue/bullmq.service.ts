import type { QueueService } from "@/domains/shared/interfaces";

import { enqueueScoreJob } from "@/infrastructure/redis/queue";

export class BullMQService implements QueueService {
  async enqueue(queueName: string, jobName: string, data: any): Promise<void> {
    switch (queueName) {
      case "scores":
        if (jobName === "updateScore") {
          await enqueueScoreJob(
            data.leaderboardId,
            data.playerId,
            data.score,
            data.rank,
          );
        }
        break;
      default:
        throw new Error(`Unknown queue: ${queueName}`);
    }
  }
}
