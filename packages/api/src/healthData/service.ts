import { PrismaClient } from "@prisma/client";
import { z } from "zod";

import { CreateHealthDataSchema } from "./schema";

export class HealthDataService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = new PrismaClient();
  }

  async createMany(
    data: z.infer<typeof CreateHealthDataSchema>[],
    userId: string,
  ) {
    const batchSize = 20; // Adjust this value based on your needs
    const results = [];

    for (let i = 0; i < data.length; i += batchSize) {
      const batch = data.slice(i, i + batchSize);
      const result = await this.prisma.healthData.createMany({
        data: batch.map((item) => ({
          type: item.type,
          value: item.value,
          startDateTime: item.startTime,
          endDateTime: item.endTime,
          ...(item.unit ? { unit: item.unit }: {}),
          profileId: userId
        })),
      });
      results.push(result);
    }

    return results;
  }
}
