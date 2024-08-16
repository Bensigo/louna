import React, { createContext, useContext } from "react";
import Healthkit, {
  HKQuantityTypeIdentifier,
  HKUpdateFrequency,
} from "@kingstinct/react-native-healthkit";
import { api } from "~/utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const HealthKitContext = createContext<null>(null);

let isBackgroundObserversSetup = false;

const identifiers = [
  HKQuantityTypeIdentifier.activeEnergyBurned,
  HKQuantityTypeIdentifier.stepCount,
  HKQuantityTypeIdentifier.heartRate,
  HKQuantityTypeIdentifier.heartRateVariabilitySDNN,
];

// Function to save the anchor to AsyncStorage
const saveAnchor = async (type: string, anchor: string) => {
  await AsyncStorage.setItem(`healthkit_anchor_${type}`, anchor);
};

// Function to retrieve the anchor from AsyncStorage
const getAnchor = async (type: string) => {
  return await AsyncStorage.getItem(`healthkit_anchor_${type}`);
};

// Function to map health samples to the schema using a default time value
const mapSamplesToSchema = (samples: any[], type: string) => {
  return samples.map((sample) => ({
    type,
    value: sample.quantity,
    id: sample.uuid,
    startTime: sample.startDate ? new Date(sample.startDate) : new Date(), // Use current time if missing
    endTime: sample.endDate ? new Date(sample.endDate) : new Date(), // Use current time if missing
    unit: sample.unit,
  }));
};

// Function to set up background observers for health data
const setupBackgroundObservers = () => {
  if (isBackgroundObserversSetup) return;
  isBackgroundObserversSetup = true;

  identifiers.forEach((identifier) => {
    Healthkit.enableBackgroundDelivery(identifier, HKUpdateFrequency.immediate);

    Healthkit.subscribeToChanges(identifier, async () => {
      const previousAnchor = await getAnchor(identifier);
      const { newAnchor, samples, deletedSamples } =
        await Healthkit.queryQuantitySamples(identifier, {
          anchor: previousAnchor || undefined,
          limit: 10,
          
        });
        console.log({ samples })
      const newHealthData = mapSamplesToSchema(samples, identifier);
      const deletedHealthData = mapSamplesToSchema(deletedSamples, identifier);
      
      // Save to database
      saveToDb({
        new: newHealthData.length ? newHealthData : [],
        deleted: deletedHealthData.length ? deletedHealthData : [],
      });

      // Save the new anchor
      if (newAnchor) {
        await saveAnchor(identifier, newAnchor);
      }
    });
  });
};

// Provider component to set up the HealthKit context
export const HealthKitProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Ensure background observers are set up on initialization
  setupBackgroundObservers();

  const { mutate: saveToDb, isLoading } = api.healthDataLog.createMany.useMutation();

  return <HealthKitContext.Provider value={null}>{children}</HealthKitContext.Provider>;
};

// Hook to use the HealthKit context
export const useHealthKit = () => {
  return useContext(HealthKitContext);
};
