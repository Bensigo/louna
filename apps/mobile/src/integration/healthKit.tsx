import React, { createContext, useEffect, useState } from "react";
import Healthkit, {
  HKAudiogramTypeIdentifier,
  HKCategoryTypeIdentifier,
  HKCategoryValueSleepAnalysis,
  HKQuantityTypeIdentifier,
  HKUnits,
  HKWorkoutActivityType,
  HKWorkoutTypeIdentifier,

} from "@kingstinct/react-native-healthkit";
import type { EnergyUnit, HKCategorySample, HKQuantitySample, HKWorkout, LengthUnit } from "@kingstinct/react-native-healthkit";


// Types and interfaces
export type HealthDataType = 'CALORIES' | 'STEPS' | 'HRV' | 'HEART_RATE' | 'RHR' | 'STAND';

export interface HealthSample {
  type: HealthDataType;
  value: number;
  id: string;
  startTime: Date;
  endTime: Date;
  unit: string;
}

interface HealthKitContextType {
  isAuthorized: boolean;
  getMostRecentValue: (type: HealthDataType) => Promise<number | null>;
  getIntervalData: (type: HealthDataType, startDate: Date, endDate: Date) => Promise<HealthSample[]>;
  getWorkout: ( startDate: Date, endDate: Date) => Promise<HKWorkout<EnergyUnit, LengthUnit>[]>;
  getSleepData: ( startDate: Date, endDate: Date) => Promise<readonly HKCategorySample<HKCategoryTypeIdentifier.sleepAnalysis>[]> 

}

const HealthKitContext = createContext<HealthKitContextType | null>(null);

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

// Helper function
const mapSamplesToSchema = (samples: HKQuantitySample[], type: HealthDataType): HealthSample[] => {
  return samples?.map((sample) => ({
    type,
    value: sample.quantity,
    id: sample.uuid,
    startTime: new Date(sample.startDate),
    endTime: new Date(sample.endDate),
    unit: sample.unit,
  }));
};

// HealthKitProvider component
export const HealthKitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);

  const requestPermissions = async () => {
    try {
      return await Healthkit.requestAuthorization(identifiers);
    } catch (error) {
      console.error("Error requesting HealthKit permissions:", error);
      return false;
    }
  };

  const getMostRecentValue = async (type: HealthDataType): Promise<number | null> => {
    if (!isAuthorized) return null;


    const { identifier, unit } = getIdentifierAndUnitFromType(type);
    
    try {
      let result: number | null = null;

      if (type === 'STEPS' || type === 'CALORIES' || type == 'STAND') {
        // For steps and active energy burned, get the sum for the day
        const now = new Date();
        const startOfDay = new Date(now.setHours(0, 0, 0, 0));
        const samples = await Healthkit.queryStatisticsForQuantity(identifier, unit, startOfDay);
        result =  Math.round(samples.sumQuantity?.quantity)
        // result = Math.round(samples.reduce((sum, sample) => sum + sample.quantity, 0));
      } else {
        // For other types, get the most recent value
        const sample = await Healthkit.getMostRecentQuantitySample(identifier, unit);
        result = sample ? Math.round(sample.quantity) : null;
      }

      return result;
    } catch (error) {
      console.error(`Error fetching ${type} data: `, error);
      return null;
    }
  };


  const getWorkout = async ( start: Date, end: Date) => {
    if (!isAuthorized) return []
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


  // const getWorkoutScore = async () => {
  //   if (!isAuthorized) return null
  //   const score = await Healthkit.queryQuantitySamples(HKQuantityTypeIdentifier.wor)
  // }

     const getSleepData = async (start: Date, end: Date): Promise<readonly HKCategorySample<HKCategoryTypeIdentifier.sleepAnalysis>[]> => {
       if (!isAuthorized) return [];
       try {
        //  const now = new Date();
        //  const startOfYesterday = new Date(now.setHours(0, 0, 0, 0));
        //  startOfYesterday.setDate(now.getDate() - 1);
        //  const endOfYesterday = new Date(startOfYesterday);
        //  endOfYesterday.setHours(23, 59, 59, 999);
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


 

  const getIntervalData = async (type: HealthDataType, startDate: Date, endDate: Date): Promise<HealthSample[]> => {
    if (!isAuthorized) return [];

    const identifier = getIdentifierAndUnitFromType(type);
    const samples = await Healthkit.queryQuantitySamples(identifier.identifier, {
      from: startDate,
      to: endDate,
      ascending: true
    });
    return mapSamplesToSchema(samples, type);
  };

  useEffect(() => {
    const setupHealthKit = async () => {
      const authorized = await requestPermissions();
      setIsAuthorized(authorized);
    
    };
   
    setupHealthKit();
  }, []);

  return (
    <HealthKitContext.Provider value={{ isAuthorized, getMostRecentValue, getIntervalData, getWorkout, getSleepData }}>
      {children}
    </HealthKitContext.Provider>
  );
};

// Helper functions for type conversions
export function getIdentifierFromType(type: HealthDataType): HKQuantityTypeIdentifier {
  switch (type) {
    case 'CALORIES': return HKQuantityTypeIdentifier.activeEnergyBurned;
    case 'STEPS': return HKQuantityTypeIdentifier.stepCount;
    case 'HRV': return HKQuantityTypeIdentifier.heartRateVariabilitySDNN;
    case 'HEART_RATE': return HKQuantityTypeIdentifier.heartRate;
    default: throw new Error(`Unsupported type: ${type}`);
  }
}

export function getIdentifierAndUnitFromType(type: HealthDataType): { identifier: HKQuantityTypeIdentifier, unit: HKUnits | string } {
  switch (type) {
    case 'CALORIES': return { identifier: HKQuantityTypeIdentifier.activeEnergyBurned, unit:  'cal' };
    case 'STEPS': return { identifier: HKQuantityTypeIdentifier.stepCount, unit: HKUnits.Count };
    case 'HRV': return { identifier: HKQuantityTypeIdentifier.heartRateVariabilitySDNN, unit: 'ms' };
    case 'HEART_RATE': return { identifier: HKQuantityTypeIdentifier.heartRate, unit: 'count/min'};
    case 'RHR': return { identifier: HKQuantityTypeIdentifier.restingHeartRate, unit: 'count/min'};
    case 'STAND': return { identifier: HKQuantityTypeIdentifier.appleStandTime, unit: 'count/min'};
    default: throw new Error(`Unsupported type: ${type}`);
  }
}

// Custom hook to use HealthKit context
export const useHealthKit = (): HealthKitContextType => {
 return React.useContext(HealthKitContext)
};
