import Healthkit, { HKCategoryTypeIdentifier, HKQuantityTypeIdentifier, HKUpdateFrequency, HKWorkoutTypeIdentifier } from "@kingstinct/react-native-healthkit";
import { useEffect, useState } from "react";
import { getData } from "./healthkit";



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
]

let isBackgroundObserversSetup = false;

const setupBackgroundObservers = async () => {
    if (isBackgroundObserversSetup) {
      return;
    }
  
    isBackgroundObserversSetup = true;
  
    for (const permission of identifiers) {
      await Healthkit.enableBackgroundDelivery(permission, HKUpdateFrequency.immediate);
    }
  };

export const HealthKitProvider = ({ children }: { children: React.ReactNode }) => {
    setupBackgroundObservers();

    const [isAuthorized, setIsAuthorized] = useState(false);

  const requestPermissions = async () => {
    try {
      return await Healthkit.requestAuthorization(identifiers);
    } catch (error) {
      console.error("Error requesting HealthKit permissions:", error);
      return false;
    }
  };


  useEffect(() => {
    const setupHealthKit = async () => {
      const authorized = await requestPermissions();
      setIsAuthorized(authorized);
    
    };
   
    void setupHealthKit();
  }, []);


   useEffect(() => {
    console.log({ isAuthorized })
      if (isAuthorized){
        void Healthkit.subscribeToChanges(HKQuantityTypeIdentifier.stepCount,  () => {
          getData().catch(console.error)
   
       })
      }
   }, [isAuthorized])



    return (
        <>{children}</>
    )

  }



