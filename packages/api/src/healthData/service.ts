
import { PrismaClient, HealthScoreType } from '@prisma/client';

 export class UtilService {
 
    
   calWellnessScore({
        avgHRV,
        avgRHR,
        avgSteps,
        avgEnergyBurned,
        avgHeartRate,
        sleepQuality, // Assume this is a normalized score out of 100
      }: {
        avgHRV: number;          // Average HRV over the period
        avgRHR: number;          // Average Resting Heart Rate over the period
        avgSteps: number;        // Average Steps taken over the period
        avgEnergyBurned: number; // Average Energy Burned over the period
        avgHeartRate: number;    // Average Heart Rate over the period
        sleepQuality: number;    // Normalized sleep quality score out of 100
      }): number {
      
        // Normalize each metric
        const HRVScore = (avgHRV / 100) * 100; // Assuming 100 is the best possible HRV score
        const RHRScore = ((100 - avgRHR) / 100) * 100; // Assuming lower is better
        const stepsScore = (avgSteps / 10000) * 100; // Assuming 10,000 steps as a good baseline
        const energyBurnedScore = (avgEnergyBurned / 1500) * 100; // Assuming 1500 cal as a good baseline
        const heartRateScore = ((100 - avgHeartRate) / 100) * 100; // Assuming lower is better
        
        // Combine the scores with weights
        const score = (HRVScore * 0.25) + (RHRScore * 0.2) + (stepsScore * 0.15) + 
                      (energyBurnedScore * 0.15) + (heartRateScore * 0.1) + 
                      (sleepQuality * 0.15) 
      
       return score 
    }


   calRecoveryScore(baselineHrv: number, baselineRhr: number, hrv: number, rhr: number, sleepScore = 60) {
    const hrvScore = (hrv / baselineHrv) * 100
    const rhrScore =  (baselineRhr / rhr) * 100;
        const weightedScore = (hrvScore * 0.4) + (rhrScore * 0.3) + (sleepScore * 0.3);
        return weightedScore;  // Cap at 100 and floor at 0
    }
    
    calculatePercentage(score: number): number {
        // Adjust display percentage: 100 (baseline) now corresponds to 80%
        // 130 (much better than baseline) still corresponds to 100%
        // 70 (much worse than baseline) now corresponds to 30%
        // This provides a wider range for lower scores, reducing the likelihood of many 40% scores
        return Math.min(Math.max((score - 70) / (130 - 70) * 70 + 30, 20), 100);
    }

    calStressScore({
        baseLineHRV,
        todayHRV,
        baseLineRHR,
        todayRHR,
        baselineStep,
        todaySteps,
        baseLineEnergyBurned,
        todayEnergyBurned,
      }: {
        baseLineHRV: number;
        todayHRV: number;
        baseLineRHR: number;
        todayRHR: number;
        baselineStep: number;
        todaySteps: number;
        baseLineEnergyBurned: number;
        todayEnergyBurned: number;
      }): number {
         
        const HRVScore = (todayHRV / baseLineHRV) * 100
        const RHRScore = (baseLineRHR / todayRHR) * 100
        const stepsScore = (todaySteps / baselineStep) * 100
        const energyBurnedScore = (todayEnergyBurned / baseLineEnergyBurned) * 100
      
        const score = (HRVScore * 0.4) + (RHRScore * 0.25) + (stepsScore * 0.15) + (energyBurnedScore * 0.2)
      
       
      
        return score
      }
      
}



export class HealthDataLogService {
  private prisma: PrismaClient;
  private util: UtilService;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.util = new UtilService();
  }

  async createHealthDataLog(userId: string, data: {
    hrv: number;
    rhr: number;
    steps: number;
    energy: number;
    heartRate: number;
    sleepMins: number;
    baselineHrv: number;
    baselineRhr: number;
    baselineSteps: number;
    baselineEnergy: number;
    baselineHeartRate: number;
    baselineSleepMins: number;
    workouts: Array<{
      name: string;
      duration: number;
      distance?: number;
      energyBurned: number;
    }>;
  }) {
    try {
        console.log({ data })
      await this.prisma.$transaction(async (tx) => {
        // Create the health data log without workouts
        const healthDataLog = await tx.healthDataLog.create({
          data: {
            userId,
            timestamp: new Date(),
            hrv: data.hrv,
            rhr: data.rhr,
            steps: data.steps,
            energy: data.energy,
            heartRate: data.heartRate,
            sleepMins: data.sleepMins,
            baselineHrv: data.baselineHrv,
            baselineRhr: data.baselineRhr,
            baselineSteps: data.baselineSteps,
            baselineEnergy: data.baselineEnergy,
            baselineHeartRate: data.baselineHeartRate,
            workouts: {
                create: [
                    ...data.workouts
                ]
            }
          },
        });
       console.log({ healthDataLog })
        // Create workouts separately if there are any
        // if (data.workouts.length > 0 && healthDataLog?.id) {
        //   await tx.workout.createMany({
        //     data: data.workouts.map(workout => ({
        //       ...workout,
        //       healthDataLogId: healthDataLog.id,
        //     })),
        //   });
        // }

        await this.calculateAndCreateScores(userId, healthDataLog);

        return healthDataLog;
      });
    } catch (error) {
      console.error('Error creating health data log:', error);
      throw error;
    }
  }

  private async calculateAndCreateScores(userId: string, healthData: any) {
    console.log("called hhhhh")
    const stressScore = this.util.calStressScore({
      baseLineHRV: healthData.baselineHrv,
      todayHRV: healthData.hrv,
      baseLineRHR: healthData.baselineRhr,
      todayRHR: healthData.rhr,
      baselineStep: healthData.baselineSteps,
      todaySteps: healthData.steps,
      baseLineEnergyBurned: healthData.baselineEnergy,
      todayEnergyBurned: healthData.energy,
    });
    console.log({ stressScore })
    const recoveryScore = this.util.calRecoveryScore(
      healthData.baselineHrv,
      healthData.baselineRhr,
      healthData.hrv,
      healthData.rhr,
      healthData.sleepMins / 60 // Assuming sleepQuality is derived from sleep duration
    );

    
    const totalSleepHours = healthData.sleepMins / (1000 * 60 * 60);
    const totalSleepMins = healthData.sleepMins / (1000 * 60);
    const sleepScore =  (totalSleepHours / 7) * 100; // ( for now we are using 7 as good sleep hr)

    const wellnessScore = this.util.calWellnessScore({
      avgHRV: healthData.hrv,
      avgRHR: healthData.rhr,
      avgSteps: healthData.steps,
      avgEnergyBurned: healthData.energy,
      avgHeartRate: healthData.heartRate,
      sleepQuality: sleepScore // Assuming sleepQuality is derived from sleep duration
    });
   
    const scores = [
      { type: HealthScoreType.Stress, score: this.util.calculatePercentage(stressScore), rawScore: stressScore },
      { type: HealthScoreType.Recovery, score: this.util.calculatePercentage(recoveryScore), rawScore: recoveryScore },
      { type: HealthScoreType.Wellbeing, score: this.util.calculatePercentage(wellnessScore), rawScore: wellnessScore },
    ];


    await this.prisma.healthScore.createMany({
      data: scores.map(score => ({
        userId,
        timestamp: new Date(),
        type: score.type,
        score: score.score,
        rawScore: score.rawScore,
      })),
    });
  }
}
