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
    return this.prisma.healthData.createMany({
      data: data.map((item) => ({
        type: item.type,
        value: item.value,
        startDateTime: item.startTime,
        endDateTime: item.endTime,
        uinit: item.unit || "",
        profileId: userId
      })),
    });
  }
}
