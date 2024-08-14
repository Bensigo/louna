import { View } from "tamagui";
import { AppState } from 'react-native';
import type {  AppStateStatus } from 'react-native';
import { useEffect, useState } from "react";
import { useAppUser } from "~/provider/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppleHealthKit from 'react-native-health';
import { healthKitPermission } from "~/integration/healthKit";
import { api } from "~/utils/api";
import type {   RouterInputs } from "~/utils/api"; 

type HealthDataApiInput = RouterInputs['healthDataLog']['createMany']

const HomeScreen = () => {
  const [appState, setAppState] = useState(AppState.currentState);

  // AsyncStorage.clear()

  const [hasPermissions, setHasPermissions] = useState(false);
  const user = useAppUser()
  const { mutate: addHealthData  } = api.healthDataLog.createMany.useMutation()

  useEffect(() => {

    AppleHealthKit.initHealthKit(healthKitPermission, (error, result) => {
      if (error){
          console.error('Error initializing HealthKit:', error);
          return 
      }
       setHasPermissions(true)
  });
  }, [])



  const syncData = async (startDate: string) => {
    const healthData = {
      STEPS: [],
      HRV: [],
      HEART_RATE: [],
      CALORIES: []
    };

    const fetchHealthData = async (method: Function, key: string) => {
      const now = new Date();
      return new Promise((resolve) => {
        method({
          startDate,
          endDate: now.toISOString()
        }, (err, result) => {
          if (err) {
            console.error(err);
          } else {
            healthData[key] = result; // Store data in the healthData object
          }
          resolve(void 0); // {{ edit_1 }}
        });
      });
    };
    
    
    
    
    await Promise.all([
      fetchHealthData(AppleHealthKit.getDailyStepCountSamples, 'STEPS'),
      fetchHealthData(AppleHealthKit.getHeartRateVariabilitySamples, 'HRV'),
      fetchHealthData(AppleHealthKit.getHeartRateSamples, 'HEART_RATE'),
      fetchHealthData(AppleHealthKit.getActiveEnergyBurned, 'CALORIES'),
    ]);

    // Send data to your API
    await sendHealthDataToAPI(healthData);
  };

  // Function to send health data to the API
  const sendHealthDataToAPI = async (healthData: Record<string, any[]>) => {
    const reqData: HealthDataApiInput[] = [];
    
    // Iterate over each entry in the healthData object
    for (const [key, samples] of Object.entries(healthData)) {
      if (Array.isArray(samples)) {
        // Process each sample in the array
        for (const sample of samples) {
          let value = 0;
          let unit = '';
  
          // Process value and unit based on the key
          if (typeof sample?.value === 'number') {
            value = Math.round(sample.value);
            if (key === 'HRV') {
              value = Math.round(value * 1000); // Convert HRV to milliseconds
              unit = 'ms';
            } else if (key === 'STEPS') {
              unit = 'count';
            } else if (key === 'HEART_RATE') {
              unit = 'bpm';
            } else if (key === 'CALORIES') {
              unit = 'kcal';
            }
          }
  
          // Ensure startDate and endDate are present and convert them to Date objects
          if (sample?.startDate && sample?.endDate) {
            reqData.push({
              type: key as "STEPS" | "HEART_RATE" | "HRV" | "CALORIES",
              value,
              unit,
              startTime: new Date(sample.startDate),
              endTime: new Date(sample.endDate)
            });
          }
        }
      }
    }
  
    console.log(`Prepared ${reqData.length} health data samples for API submission`);
  
    // Call the API with the prepared data

    addHealthData(reqData, {
      async onSuccess() {
        await AsyncStorage.setItem('lastSyncTime', new Date().toISOString());
      }
    });
  };
  

  const syncHealthData = async () => {
    if (!user?.hasHealthKitAuthorize) {
      return;
    }

    const lastSyncedString = await AsyncStorage.getItem('lastSyncTime');
    const now = new Date();
  
    if (lastSyncedString) {
      const lastSynced = new Date(lastSyncedString);
      const timeDifference = now.getTime() - lastSynced.getTime();
      const fifteenMinutesInMs = 15 * 60 * 1000;

      if (timeDifference > fifteenMinutesInMs) {
        console.log('Syncing health data...');
        await syncData(lastSyncedString);
      } else {
        console.log('Less than 15 minutes since last sync. Skipping...');
      }
    } else {
      const startDate = new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString();
      console.log('Initial sync...');
      await syncData(startDate);
    }
  };

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (appState.match(/inactive|background/) && nextAppState === 'active' && hasPermissions) {
        console.log("====== hey am here =========");
        void syncHealthData();
      }
      setAppState(nextAppState);
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      subscription.remove();
    };
  }, [appState, hasPermissions]);

  return <View flex={1}></View>;
};

export default HomeScreen;