import type { AppStateStatus } from "react-native";
import { useEffect, useState } from "react";
import { AppState } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScrollView } from "tamagui";
import HealthKit, {  HKQuantityTypeIdentifier, useHealthkitAuthorization, useMostRecentQuantitySample, useSubscribeToChanges } from '@kingstinct/react-native-healthkit';


import type { RouterInputs } from "~/utils/api";
import HealthCardList from "~/features/home/listHealthCards";

import { useAppUser } from "~/provider/user";
import { api } from "~/utils/api";

type HealthDataApiInput = RouterInputs["healthDataLog"]["createMany"];

const HomeScreen =   () => {
  const [appState, setAppState] = useState(AppState.currentState);
    

  // const isAuth  = await HealthKit.requestAuthorization([
  //   HKQuantityTypeIdentifier.stepCount,
  //    HKQuantityTypeIdentifier.heartRate,
  //     HKQuantityTypeIdentifier.heartRateVariabilitySDNN, HKQuantityTypeIdentifier.activeEnergyBurned])

  // const [hasPermissions, setHasPermissions] = useState(false);
  const user = useAppUser();





  return (
    <ScrollView flex={1}>
    
      <HealthCardList />
    </ScrollView>
  );
};

export default HomeScreen;