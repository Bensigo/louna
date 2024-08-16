import { PrismaClient, HealthDataType } from "@prisma/client";
import { z } from "zod";
import { startOfDay, startOfWeek, startOfMonth, startOfYear, endOfDay, endOfWeek, endOfMonth, endOfYear, subDays, subWeeks, subMonths, subYears } from 'date-fns';

import { CreateHealthDataSchema } from "./schema";

type Interval = 'day' | 'week' | 'month' | 'year';

interface HealthDataPoint {
  timestamp: Date;
  value: number;
}

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
          dataId: item.id,
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

  calculateStressLevel(hrv: number): 'low' | 'medium' | 'high' {
    if (hrv >= 70) return 'low';
    if (hrv >= 50) return 'medium';
    return 'high';
  }

  async getStats(userId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const healthData = await this.prisma.healthData.groupBy({
      by: ['type'],
      where: {
        profileId: userId,
        startDateTime: {
          gte: today,
          lt: tomorrow,
        },
        type: {
          in: ['STEPS', 'CALORIES']
        }
      },
      _sum: {
        value: true,
      },
    });

    const latestHeartData = await this.prisma.healthData.findMany({
      where: {
        profileId: userId,
        type: { in: ['HEART_RATE', 'HRV'] },
        startDateTime: {
          gte: today,
          lt: tomorrow,
        }
      },
      orderBy: {
        startDateTime: 'desc',
      },
      distinct: ['type'],
      take: 10,
      select: {
        type: true,
        value: true,
      },
    });

    const latestHeartDataMap = Object.fromEntries(
      latestHeartData.map(item => [item.type, item.value])
    );

    const result = {
      steps: 0,
      enegryBurned: 0,
      hrv: 0,
      heartRate: 0,
      stressLevel: null,
    };

    healthData.forEach(item => {
      if (item.type === 'STEPS') {
        result.steps = item._sum.value ?? 0;
      } else if (item.type === 'CALORIES') {
        result.enegryBurned = item._sum.value ?? 0;
      }
    });

    latestHeartData.forEach(item => {
      if (item.type === 'HEART_RATE') {
        result.heartRate = Math.round(item.value);
      } else if (item.type === 'HRV') {
        result.hrv = Math.round(item.value);
        result.stressLevel = this.calculateStressLevel(result.hrv);
      }
    });

    return result;
  }

  async getHealthData(
    profileId: string,
    type: HealthDataType,
    interval: Interval
  ): Promise<HealthDataPoint[]> {
    const now = new Date();
    const { start, end } = this.getDateRange(now, interval);

    const healthData = await this.prisma.healthData.findMany({
      where: {
        profileId,
        type,
        startDateTime: {
          gte: start,
          lte: end,
        },
      },
      select: {
        startDateTime: true,
        value: true,
      },
      orderBy: {
        startDateTime: 'asc',
      },
    });

    return healthData.map(data => ({
      timestamp: data.startDateTime,
      value: data.value,
    }));
  }

  private getDateRange(now: Date, interval: Interval): { start: Date, end: Date } {
    let start: Date;
    let end: Date = now;

    switch (interval) {
      case 'day':
        start = startOfDay(now);
        end = endOfDay(now);
        break;
      case 'week':
        start = startOfWeek(subWeeks(now, 1));
        end = endOfWeek(now);
        break;
      case 'month':
        start = startOfMonth(subMonths(now, 1));
        end = endOfMonth(now);
        break;
      case 'year':
        start = startOfYear(subYears(now, 1));
        end = endOfYear(now);
        break;
    }

    return { start, end };
  }
}