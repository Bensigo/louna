import type { HealthSample } from "~/integration/healthKit";
import { format, formatDistance, formatDuration, intervalToDuration, startOfDay } from 'date-fns';
import { HKCategorySample, HKCategoryTypeIdentifier, HKCategoryValueSleepAnalysis } from "@kingstinct/react-native-healthkit";

// using moving average to calculate baseline 
export function getBaseLineValue(data: number[], days=14){
    console.log({ len: data.length })
    if (data.length < days) {
        return null; // Not enough data
    }
    
    const recentData = data.slice(-days);
    const sum = recentData.reduce((a, b) => a + b, 0);
    return sum / days;
}





export function accToDaily(data: HealthSample[]): number[] {
    const dailyData = data.reduce((acc, current) => {
        const dateKey = format(startOfDay(current.startTime), 'yyyy-MM-dd');
    
        if (!acc[dateKey]) {
            acc[dateKey] = { date: startOfDay(current.startTime), total: 0, count: 0 };
        }
        acc[dateKey].total += current.value;
        acc[dateKey].count++;
        return acc;
    }, {} as Record<string, { date: Date; total: number; count: number }>);
    return Object.values(dailyData).map(({ total, count }) => {
        if (count === 0) return 0; // Avoid division by zero
        return Math.round((total / count));
    });
}


export function accDaily(data: HealthSample[]): number[] {
    const dailyData = data.reduce((acc, current) => {
        
        const dateKey = format(startOfDay(current.startTime), 'yyyy-MM-dd');
   
        if (!acc[dateKey]) {
            acc[dateKey] = { date: startOfDay(current.startTime), total: 0, count: 0 };
        }
        acc[dateKey].total += current.value;
        acc[dateKey].count++;
        return acc;
    }, {} as Record<string, { date: Date; total: number; count: number }>);

    return Object.values(dailyData).map(({ total, count }) => {
        if (count === 0) return 0; // Avoid division by zero
        return Math.round((total));
    });
}





export function calHRVScore(baseLineScore: number, todayScore: number) {
    const score = (todayScore / baseLineScore) * 100;
    return Math.max(0, Math.min(score, 100));  // Cap at 100 and floor at 0
}

export function calRHRScore(baseLineScore: number, todayScore: number) {
    const score = (baseLineScore / todayScore) * 100;
    return Math.max(0, Math.min(score, 100));  // Cap at 100 and floor at 0
}



export function calRecoveryScore(hrvScore: number, rhrScore: number, sleepScore = 60) {
    const weightedScore = (hrvScore * 0.4) + (rhrScore * 0.3) + (sleepScore * 0.3);
    return weightedScore;  // Cap at 100 and floor at 0
}



export function calculateSleepScore(
    sleepData: readonly HKCategorySample< HKCategoryTypeIdentifier.sleepAnalysis>[],
    sleepGoalHours: number
  ) : { score: number, totalSleepMins: number  }{
    if (sleepData.length === 0)return;
    const totalSleepMs = sleepData.reduce((total, sample) => {
        console.log({ sleep: HKCategoryValueSleepAnalysis[sample.value]})
      if (sample.value >= HKCategoryValueSleepAnalysis.asleepUnspecified) {
        return total + (sample.endDate.getTime() - sample.startDate.getTime());
      }
      return total;
    }, 0);
    
  
    const totalSleepHours = totalSleepMs / (1000 * 60 * 60);
    const totalSleepMins = totalSleepMs / (1000 * 60);
    const sleepScore =  (totalSleepHours / sleepGoalHours) * 100;
  
    return { score: Math.round(sleepScore),   totalSleepMins}
  }

  export function calculateSleepTime(
    sleepData: readonly HKCategorySample< HKCategoryTypeIdentifier.sleepAnalysis>[]
  ) : number {
    if (sleepData.length === 0)return;
    const totalSleepMs = sleepData.reduce((total, sample) => {
        console.log({ sleep: HKCategoryValueSleepAnalysis[sample.value]})
      if (sample.value >= HKCategoryValueSleepAnalysis.asleepUnspecified) {
        return total + (sample.endDate.getTime() - sample.startDate.getTime());
      }
      return total;
    }, 0);
    
  
    // const totalSleepHours = totalSleepMs / (1000 * 60 * 60);
    const totalSleepMins = totalSleepMs / (1000 * 60);

  
    return  totalSleepMins
  }

  export function calculatePercentage(score: number): number {
      // Adjust display percentage: 100 (baseline) now corresponds to 80%
  // 130 (much better than baseline) still corresponds to 100%
  // 70 (much worse than baseline) now corresponds to 40%
    return   Math.min(Math.max((score - 70) / (130 - 70) * 60 + 40, 40), 100); 
  }
  
  function presentStressScore(score: number): { rating: string; description: string; percentage: number } {
    const percentage = calculatePercentage(score);
  
    if (score >= 130) {
      return {
        rating: "Excellent",
        description: "Your stress levels are very low. Keep up the great work!",
        percentage
      };
    } else if (score >= 115) {
      return {
        rating: "Very Good",
        description: "Your stress levels are lower than usual. You're doing well!",
        percentage
      };
    } else if (score >= 100) {
      return {
        rating: "Good",
        description: "Your stress levels are normal. This is your baseline.",
        percentage
      };
    } else if (score >= 85) {
      return {
        rating: "Fair",
        description: "Your stress levels are slightly elevated. Consider some relaxation techniques.",
        percentage
      };
    } else if (score >= 70) {
      return {
        rating: "Poor",
        description: "Your stress levels are high. It's important to focus on stress management.",
        percentage
      };
    } else {
      return {
        rating: "Very Poor",
        description: "Your stress levels are very high. Please prioritize stress reduction and consider consulting a healthcare professional.",
        percentage
      };
    }
  }
  
  export function calStressScore({
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
  }): { score: number; rating: string; description: string; percentage: number } {
     
    const HRVScore = (todayHRV / baseLineHRV) * 100
    const RHRScore = (baseLineRHR / todayRHR) * 100
    const stepsScore = (todaySteps / baselineStep) * 100
    const energyBurnedScore = (todayEnergyBurned / baseLineEnergyBurned) * 100
  
    const score = (HRVScore * 0.4) + (RHRScore * 0.25) + (stepsScore * 0.15) + (energyBurnedScore * 0.2)
  
    const { rating, description, percentage } = presentStressScore(score)
  
    return { score, rating, description, percentage };
  }


//   export const durationToHours = (s: number) => formatDistance(0, s * 1000, { includeSeconds: true, includeHours: true })
  export function durationToHours(totalMinutes: number ) {
    const duration = intervalToDuration({ start: 0, end: totalMinutes * 60 * 1000 });
    return formatDuration(duration, { format: ['hours', 'minutes'], delimiter: ' ' });
  }


export function interpretStressScore(rawScore: number): {
    rawScore: number,
    percentageChange: number,
    interpretation: string
  } {
    const percentageChange = rawScore - 100;
    
    let interpretation: string;
    console.log({ percentageChange })
    if (percentageChange > 15) {
      interpretation = "Significantly better than your baseline. Great job!";
    } else if (percentageChange > 5) {
      interpretation = "Better than your baseline. You're doing well!";
    } else if (percentageChange > -5) {
      interpretation = "Around your baseline. This is your typical state.";
    } else if (percentageChange > -15) {
      interpretation = "Slightly worse than your baseline. Consider some extra rest.";
    } else {
      interpretation = "Significantly worse than your baseline. Focus on recovery.";
    }
  
    return {
      rawScore,
      percentageChange,
      interpretation
    };
  }


  export function calWellnessScore({
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
  }): { score: number; rating: string; description: string; percentage: number } {
  
    // Normalize each metric
    const HRVScore = (avgHRV / 100) * 100; // Assuming 100 is the best possible HRV score
    const RHRScore = ((100 - avgRHR) / 100) * 100; // Assuming lower is better
    const stepsScore = (avgSteps / 10000) * 100; // Assuming 10,000 steps as a good baseline
    const energyBurnedScore = (avgEnergyBurned / 1500) * 100; // Assuming 1500 cal as a good baseline
    const heartRateScore = ((100 - avgHeartRate) / 100) * 100; // Assuming lower is better
    
    // Combine the scores with weights
    const score = (HRVScore * 0.25) + (RHRScore * 0.2) + (stepsScore * 0.15) + 
                  (energyBurnedScore * 0.15) + (heartRateScore * 0.15) + 
                  (sleepQuality * 0.10) 
  
    // Calculate rating, description, and percentage
    const { rating, description, percentage } = presentWellnessScore(score);
  
    return { score, rating, description, percentage };
}

function presentWellnessScore(score: number): { rating: string; description: string; percentage: number } {
    let rating: string;
    let description: string;
    let percentage: number;

    if (score >= 90) {
        rating = 'Excellent';
        description = 'You are in outstanding health!';
        percentage = score;
    } else if (score >= 70) {
        rating = 'Good';
        description = 'Your health is generally good, keep it up!';
        percentage = score;
    } else if (score >= 50) {
        rating = 'Average';
        description = 'Your health is average, consider improving in some areas.';
        percentage = score;
    } else {
        rating = 'Poor';
        description = 'Your health could use improvement. Consider reviewing your habits.';
        percentage = score;
    }

    return { rating, description, percentage };
}