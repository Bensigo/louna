import React, { createContext, useEffect, useState } from "react";
import Healthkit, {
  HKQuantityTypeIdentifier,
  HKUnits,

} from "@kingstinct/react-native-healthkit";
import type { HKQuantitySample } from "@kingstinct/react-native-healthkit";


// Types and interfaces
export type HealthDataType = 'CALORIES' | 'STEPS' | 'HRV' | 'HEART_RATE';

interface HealthSample {
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

}

const HealthKitContext = createContext<HealthKitContextType | null>(null);

const identifiers = [
  HKQuantityTypeIdentifier.activeEnergyBurned,
  HKQuantityTypeIdentifier.stepCount,
  HKQuantityTypeIdentifier.heartRate,
  HKQuantityTypeIdentifier.heartRateVariabilitySDNN,
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

      if (type === 'STEPS' || type === 'CALORIES') {
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


 

  const getIntervalData = async (type: HealthDataType, startDate: Date, endDate: Date): Promise<HealthSample[]> => {
    if (!isAuthorized) return [];

    const identifier = getIdentifierAndUnitFromType(type);
    const samples = await Healthkit.queryQuantitySamples(identifier.identifier, {
      from: startDate,
      to: endDate,
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
    <HealthKitContext.Provider value={{ isAuthorized, getMostRecentValue, getIntervalData }}>
      {children}
    </HealthKitContext.Provider>
  );
};

// Helper functions for type conversions
function getIdentifierFromType(type: HealthDataType): HKQuantityTypeIdentifier {
  switch (type) {
    case 'CALORIES': return HKQuantityTypeIdentifier.activeEnergyBurned;
    case 'STEPS': return HKQuantityTypeIdentifier.stepCount;
    case 'HRV': return HKQuantityTypeIdentifier.heartRateVariabilitySDNN;
    case 'HEART_RATE': return HKQuantityTypeIdentifier.heartRate;
    default: throw new Error(`Unsupported type: ${type}`);
  }
}

function getIdentifierAndUnitFromType(type: HealthDataType): { identifier: HKQuantityTypeIdentifier, unit: HKUnits | string } {
  switch (type) {
    case 'CALORIES': return { identifier: HKQuantityTypeIdentifier.activeEnergyBurned, unit: HKUnits.Kilocalorie };
    case 'STEPS': return { identifier: HKQuantityTypeIdentifier.stepCount, unit: HKUnits.Count };
    case 'HRV': return { identifier: HKQuantityTypeIdentifier.heartRateVariabilitySDNN, unit: 'ms' };
    case 'HEART_RATE': return { identifier: HKQuantityTypeIdentifier.heartRate, unit: 'count/min'};
    default: throw new Error(`Unsupported type: ${type}`);
  }
}

// Custom hook to use HealthKit context
export const useHealthKit = (): HealthKitContextType => {
 return React.useContext(HealthKitContext)
};
