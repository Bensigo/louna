import { View } from "tamagui";
import { AppState } from 'react-native';
import type {  AppStateStatus } from 'react-native';
import { useEffect, useState } from "react";
import { useAppUser } from "~/provider/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AppleHealthKit from 'react-native-health';
import { healthKitPermission } from "~/integration/healthKit";

const HomeScreen = () => {
  const [appState, setAppState] = useState(AppState.currentState);

  const [hasPermissions, setHasPermissions] = useState(false);

  const user = useAppUser()

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
      steps: [],
      heartRateVariability: [],
      heartRate: [],
      energyBurned: []
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
      fetchHealthData(AppleHealthKit.getDailyStepCountSamples, 'steps'),
      fetchHealthData(AppleHealthKit.getHeartRateVariabilitySamples, 'heartRateVariability'),
      fetchHealthData(AppleHealthKit.getHeartRateSamples, 'heartRate'),
      fetchHealthData(AppleHealthKit.getActiveEnergyBurned, 'energyBurned'),
    ]);

    // Send data to your API
    await sendHealthDataToAPI(healthData);
  };

  // Function to send health data to the API
  const sendHealthDataToAPI = async (healthData: any) => {
     console.log({ healthData })
     // send data to api in batch base on object key  and  save lastSyncTime
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
      const startDate = new Date(now.getTime() - 7 * 60 * 60 * 1000).toISOString();
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