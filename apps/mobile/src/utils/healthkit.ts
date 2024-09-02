import Healthkit, { EnergyUnit, HKCategorySample, HKCategoryTypeIdentifier, HKQuantitySample, HKQuantityTypeIdentifier, HKUnits, HKUpdateFrequency, HKWorkout, HKWorkoutActivityType, HKWorkoutTypeIdentifier, LengthUnit } from "@kingstinct/react-native-healthkit";
import { endOfDay, format, setHours, setMinutes, setSeconds, startOfDay, subDays } from "date-fns";
import {  calculateSleepScore, calculateSleepTime, getBaseLineValue } from "~/features/stats/utils";
import { api, appApi } from "./api";



export function accToDaily(data: HKQuantitySample[]): number[] {
  const dailyData = data.reduce((acc, current) => {
      const dateKey = format(startOfDay(current.startDate), 'yyyy-MM-dd');
  
      if (!acc[dateKey]) {
          acc[dateKey] = { date: startOfDay(current.startDate), total: 0, count: 0 };
      }
      acc[dateKey].total += current.quantity;
      acc[dateKey].count++;
      return acc;
  }, {} as Record<string, { date: Date; total: number; count: number }>);
  return Object.values(dailyData).map(({ total, count }) => {
      if (count === 0) return 0; // Avoid division by zero
      return Math.round((total / count));
  });
}


export function accDaily(data: HKQuantitySample[]): number[] {
  const dailyData = data.reduce((acc, current) => {
      const dateKey = format(startOfDay(current.startDate), 'yyyy-MM-dd');
 
      if (!acc[dateKey]) {
          acc[dateKey] = { date: startOfDay(current.startDate), total: 0, count: 0 };
      }
      acc[dateKey].total += current.quantity;
      acc[dateKey].count++;
      return acc;
  }, {} as Record<string, { date: Date; total: number; count: number }>);

  return Object.values(dailyData).map(({ total, count }) => {
      if (count === 0) return 0; // Avoid division by zero
      return Math.round((total));
  });
}

const identifiers = [
    HKQuantityTypeIdentifier.activeEnergyBurned,
    HKQuantityTypeIdentifier.stepCount,
    HKQuantityTypeIdentifier.heartRate,
    HKQuantityTypeIdentifier.heartRateVariabilitySDNN,
    HKQuantityTypeIdentifier.appleStandTime,
    HKQuantityTypeIdentifier.restingHeartRate,
    HKCategoryTypeIdentifier.sleepAnalysis,
    HKCategoryTypeIdentifier.sleepChanges,
    HKWorkoutTypeIdentifier,
  ];
  

export async function getData() {
    try {
        // for (const permission of identifiers) {
        //      await Healthkit.enableBackgroundDelivery(permission, HKUpdateFrequency.immediate);
        // }

      const isAuthorized =  await Healthkit.requestAuthorization(identifiers);
      console.log({ isAuthorized })
      if (!isAuthorized) return;

      const currentData = await fetchCurrentData()
      const now = new Date();
      const startDate = subDays(now, 15);
      const intervalData = await getIntervalDatas(startDate, now);
    
      const accActiveEnergyBurned = accDaily(intervalData?.activeEnergyBurned);
      const accStepCount = accDaily(intervalData?.stepCounts);
      const accHeartRate = accToDaily(intervalData?.hr);
      const accHrv = accToDaily(intervalData?.hrv);
      const accStandTime = accToDaily(intervalData?.standTime);
      const accRhr = accToDaily(intervalData.rhr);
    
      // console.log({ accActiveEnergyBurned, accHeartRate, accHrv, accRhr, accStepCount, accStandTime})

      const baseLineData = {
        activeEnergyBurned: getBaseLineValue(accActiveEnergyBurned, 14),
        stepCount: getBaseLineValue(accStepCount, 14),
        heartRate: getBaseLineValue(accHeartRate, 14),
        hrv: getBaseLineValue(accHrv, 14),
        standTime: getBaseLineValue(accStandTime, 14),
        rhr: getBaseLineValue(accRhr, 14),
      };

      const yesterday = subDays(new Date(), 1);
      const startOfDaySleep = setHours(setMinutes(setSeconds(yesterday, 0), 0), 20);
      const endOfDaySleep = endOfDay(new Date());
  
      const sleepData = await getSleepData(startOfDaySleep, endOfDaySleep);
      const  totalSleepMins  = calculateSleepTime(sleepData);
      const workouStart = startOfDay(now)
      const todayWorkout =await  getWorkout(workouStart, now)

 
      await appApi.log.syncHealthData.mutate({
        baselineData: baseLineData, 
        currentData,
        sleepData: {
          totalSleepMins: totalSleepMins
        },
        workouts: todayWorkout?.map((workout) => ({ 
          name: HKWorkoutActivityType[workout.workoutActivityType],
          duration: workout?.duration,
          distance: workout.totalDistance?.quantity,
          energyBurned: workout.totalEnergyBurned?.quantity,

        })) ?? []
      })

   
    } catch (error) {
        console.error(error);

      }   
}


function getUnit(identifier: HKQuantityTypeIdentifier | HKCategoryTypeIdentifier ): string {
  switch (identifier) {
    case HKQuantityTypeIdentifier.activeEnergyBurned:
      return 'cal';
    case HKQuantityTypeIdentifier.stepCount:
      return HKUnits.Count;
    case HKQuantityTypeIdentifier.heartRateVariabilitySDNN:
      return 'ms';
    case HKQuantityTypeIdentifier.heartRate:
      return 'count/min';
    case HKQuantityTypeIdentifier.restingHeartRate:
      return 'count/min';
    case HKQuantityTypeIdentifier.appleStandTime:
      return 'count/min';
    default:
      return '';
  }
}


async function fetchCurrentData() {
  const identifiers = [
    HKQuantityTypeIdentifier.activeEnergyBurned,
    HKQuantityTypeIdentifier.stepCount,
    HKQuantityTypeIdentifier.heartRate,
    HKQuantityTypeIdentifier.heartRateVariabilitySDNN,
    HKQuantityTypeIdentifier.appleStandTime,
    HKQuantityTypeIdentifier.restingHeartRate,
  ];

  const [activeEnergyBurned, stepCount, heartRate, hrv, standTime ,rhr] = await Promise.all(identifiers.map(async (identifier) => {
    let result: number | null = null;
    const unit = getUnit(identifier);
    if (identifier === HKQuantityTypeIdentifier.stepCount || identifier === HKQuantityTypeIdentifier.activeEnergyBurned || identifier === HKQuantityTypeIdentifier.appleStandTime) {
      // For steps and active energy burned, get the sum for the day
      const now = new Date();
      const startOfDay = new Date(now.setHours(0, 0, 0, 0));
      const samples = await Healthkit.queryStatisticsForQuantity(identifier, unit, startOfDay);
      result = Math.round(samples.sumQuantity?.quantity ?? 0);

    } else {
      // For other types, get the most recent value
      const sample = await Healthkit.getMostRecentQuantitySample(identifier, unit);
      result = sample ? Math.round(sample.quantity) : null;
    }
    return result;
  }));

  return { activeEnergyBurned, standTime, stepCount, heartRate, hrv, rhr };
}

const getSleepData = async (start: Date, end: Date): Promise<readonly HKCategorySample<HKCategoryTypeIdentifier.sleepAnalysis>[]> => {
 
    try {
 
      const data = await Healthkit.queryCategorySamples(HKCategoryTypeIdentifier.sleepAnalysis, {
        from: start,
        to: end,
         
      });
      return data;
    } catch (error) {
      console.error("Error fetching sleep data:", error);
      return [];
    }
  }


  const getIntervalDatas = async (startDate: Date, endDate: Date) => {

    const identifiers = [
        HKQuantityTypeIdentifier.activeEnergyBurned,
        HKQuantityTypeIdentifier.stepCount,
        HKQuantityTypeIdentifier.heartRate,
        HKQuantityTypeIdentifier.heartRateVariabilitySDNN,
        HKQuantityTypeIdentifier.appleStandTime,
        HKQuantityTypeIdentifier.restingHeartRate,
      ];
    const dataPromises = identifiers.map(identifier => 
      Healthkit.queryQuantitySamples(identifier, {
        from: startDate,
        to: endDate,
        ascending: true
      })
    );
    const [activeEnergyBurned, stepCounts, hr, hrv,standTime,  rhr   ] = await Promise.all(dataPromises);
  
    // const data = identifiers.reduce((acc, identifier, index) => {
    //   acc[identifier] = results[index];
    //   return acc;
    // }, {} as IntervalData);
  
    return { activeEnergyBurned, stepCounts, hr, hrv, standTime, rhr  };
  };


  export const getWorkout = async ( start: Date, end: Date) => {

    // const samples = await Healthkit.queryQuantitySamples(HKQuantityTypeIdentifier.workoutEffortScore, { from: start, to: end })

    let samples: HKWorkout<EnergyUnit, LengthUnit>[];
    try {
      samples = await Healthkit.queryWorkoutSamples({ from: start, to: end })
    } catch (error) {
      console.error("Error fetching workout samples:", error);
      return [];
    }
    // for (const sample of samples){
    //   console.log({ activity:  HKWorkoutActivityType[ sample.workoutActivityType], energy: sample.totalEnergyBurned, distance: sample.totalDistance})
    // }
    return samples
  }