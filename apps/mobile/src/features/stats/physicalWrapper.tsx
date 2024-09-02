import React, { useCallback, useEffect, useState } from "react";
import { router } from "expo-router";
import  {
  EnergyUnit,
  HKWorkout,
  HKWorkoutActivityType,
  LengthUnit,
} from "@kingstinct/react-native-healthkit";
import {

  Clock1,
  Flame,
  Footprints,
  Heart,
  Moon,
} from "@tamagui/lucide-icons";
import {
  addDays,

  endOfDay,

  formatDistance,

  getDaysInMonth,
  setHours,
  setMinutes,
  setSeconds,
  subDays,

} from "date-fns";
import { Button, Card, ScrollView, Text, View, XStack, YStack } from "tamagui";

import { colorScheme } from "~/constants/colors";
import { HealthDataType, useHealthKit } from "~/integration/healthKit";


import { accDaily, accToDaily, calculateSleepScore, calWellnessScore, durationToHours, getBaseLineValue } from "./utils";
import ScoreDisplay from "./components/scoreV2";

function capitalize(data: string): string {
  return data.charAt(0).toUpperCase() + data.slice(1);
}


interface Breakdown {
  steps: number;
  energyBurned: number;
  heartRate: number;
  standMins: number;
  rhr: number;
  hrv: number;
}

const colors = {
  background: "#F8FAFC",
  primary: "#64B5F6",
  secondary: "#81C784",
  high: "#FF8A65",
  text: "#334E68",
  lightText: "#94A3B8",
  accent: "#E2E8F0",
};


interface IconProps {
  color: string;
  fontSize: number;
}

export const BreakDownCard: React.FC<{
  icon: React.NamedExoticComponent<IconProps>;
  color: string;
  title: string;
  value: number | string ;
  unit: string;
  onPress: () => void;
}> = ({ icon: Icon, color, title, value, unit, onPress }) => (
  <Card
    backgroundColor="$background"
    onPress={onPress}
    style={{
      elevation: 0,
      padding: 8,
      height: 45,
      width: "100%",
      marginHorizontal: 8,
      borderRadius: 4,
    }}
  >
    <XStack justifyContent="space-between" alignItems="center">
      <XStack alignItems="center" space={8}>
        <Icon color={color} fontSize={30} />
        <Text color={color} fontSize="16px">
          {title}
        </Text>
      </XStack>
      <Text color={colors.text.secondary} fontSize="24px" fontWeight="bold">
        {value}{" "}
        <Text fontSize="16px" fontWeight="normal" color={colors.text.secondary}>
          {unit}
        </Text>
      </Text>
    </XStack>
  </Card>
);
export const durationToMins = (s: number) => formatDistance(0, s * 1000, { includeSeconds: true })


type WellnessLevel = {
  score: number;
  percentage: number;
  rating: string;
  description: string;
}

const PhysicalWrapper = () => {
  const { isAuthorized, getMostRecentValue, getIntervalData, getWorkout, getSleepData } =
    useHealthKit();
  const [breakDown, setBreakDown] = useState<Breakdown | null>(null);
 
  const [wellnessLevel, setWellnessLevel] = useState<WellnessLevel | null>(null);

  const [sleepTime, setSleepTime] = useState<number | null>(null);

  const [physicalActivities, setPhysicalActivities] = useState<
    HKWorkout<EnergyUnit, LengthUnit>[]
  >([]);

 

  const fetchPhysicalActivities = useCallback(async () => {
    if (isAuthorized) {
      const start = new Date();
      start.setHours(0, 0, 0, 0); // Start of the day
      const end = new Date();
      const workouts = await getWorkout(start, end);
      setPhysicalActivities(workouts);
    }
  }, [isAuthorized, getWorkout]);

  useEffect(() => {
   
    void fetchPhysicalActivities();
    void calScore()
  }, [ calScore, fetchPhysicalActivities]);



  const calScore = useCallback(async () => {
    if (!isAuthorized) return;
    const now = new Date();
    const startDate = subDays(now, 15);

    const [hrv, restingHeartRate, energyBurned, steps, heartRates] = await Promise.all([
      getIntervalData("HRV", startDate, now),
      getIntervalData("RHR", startDate, now),
      getIntervalData("CALORIES", startDate, now),
      getIntervalData("STEPS", startDate, now),
      getIntervalData("HEART_RATE", startDate, now),
    ]);

    const [currentHrv, currentRHR, currentEnegyBurned, currentSteps, heartRate] =
      await Promise.all([
        getMostRecentValue("HRV"),
        getMostRecentValue("RHR"),
        getMostRecentValue("CALORIES"),
        getMostRecentValue("STEPS"),
        getMostRecentValue("HEART_RATE"),
      ]);


      setBreakDown({
        steps: currentSteps,
        energyBurned: currentEnegyBurned,
        rhr: currentRHR,
        hrv: currentHrv,
        heartRate
      });
   
      const yesterday = subDays(new Date(), 1);
      const startOfDaySleep = setHours(setMinutes(setSeconds(yesterday, 0), 0), 20);
      const endOfDaySleep = endOfDay(new Date());
  
      const sleepData = await getSleepData(startOfDaySleep, endOfDaySleep);
      const defaultSleepGoal = 7; // let user set sleep goal for more accuray
      const { score: sleepScore, totalSleepMins } = calculateSleepScore(
        sleepData,
        defaultSleepGoal,
      );
       setSleepTime(totalSleepMins)
      if (hrv.length && restingHeartRate.length) {
      const accHrv = accToDaily(hrv);
      const accHR = accToDaily(heartRates);
      const accRestingHeartRate = accToDaily(restingHeartRate);
      const accEnergyBurned = accDaily(energyBurned);
      const accSteps = accDaily(steps);
      const baseLineHrv = getBaseLineValue(accHrv, 14);
      const baseLineHR = getBaseLineValue(accHR, 14);
      const baseLineRHR = getBaseLineValue(accRestingHeartRate, 14);
      const baseLineEnergyBurned = getBaseLineValue(accEnergyBurned, 14);
      const baseLineSteps = getBaseLineValue(accSteps, 14);
    
      if (baseLineHrv && baseLineRHR &&  baseLineEnergyBurned && baseLineSteps &&   baseLineHR && heartRate) {
       
         const wellnessLevel  = calWellnessScore({
          avgEnergyBurned: baseLineEnergyBurned,
          avgHeartRate: baseLineHR,
          avgHRV: baseLineHrv,
          avgRHR: baseLineRHR,
          avgSteps: baseLineSteps,
          sleepQuality: sleepScore ?? 0
         })
      
        setWellnessLevel(wellnessLevel)
      }
    }
  }, [getIntervalData, isAuthorized]);

  

  const goTo = (type: HealthDataType) => {
    router.push({
      pathname: "/(tabs)/stats/(stats)/physical/[chart]",
      params: {
        type,
      },
    });
  };

  return (
    <ScrollView flex={1} px={10} py={10}>
       <ScoreDisplay score={wellnessLevel} hideInterperted />
     
    
     <YStack gap="$2" my={"$3"}>
        <Text fontSize="$6" fontWeight="bold">
          Breakdown
        </Text>

        <BreakDownCard
          onPress={() => goTo("CALORIES")}
          icon={Flame}
          color="#FF2D55"
          title="Energy"
          value={breakDown?.energyBurned}
          unit=" cal"
        />
        <BreakDownCard
          onPress={() => goTo("STEPS")}
          icon={Footprints}
          color="#6495ED"
          title="Steps"
          value={breakDown?.steps}
          unit="steps"
        />
         <BreakDownCard
        onPress={() => {
          /* Add navigation to sleep details if needed */
        }}
        icon={Moon}
        color="#8E44AD"
        title="Sleep Time"
        value={sleepTime !== null ? durationToHours(sleepTime) : "No data"}
        unit={""}
      />
        <BreakDownCard
          onPress={() => goTo("HEART_RATE")}
          icon={Heart}
          color="#008000"
          title="Heart Rate"
          value={breakDown?.heartRate}
          unit="bpm"
        />
         <BreakDownCard
          onPress={() => goTo("HRV")}
          icon={Heart}
          color="#6495ED"
          title="HRV"
          value={breakDown?.hrv}
          unit="ms"
        />
        <BreakDownCard
          onPress={() => goTo("RHR")}
          icon={Heart}
          color="#007ACC"
          title="Resting Heart Rate"
          value={breakDown?.rhr}
          unit="bpm"
        />
      </YStack>
      <View 
        my={'$3'}
        backgroundColor="$gray1" // A light gray tint for the background
        borderRadius="$4"
        shadowColor="$gray8"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.1}
        shadowRadius={4}
        overflow="hidden"
        width="100%"
        p="$4"
        gap={"$2"}
      >
      <YStack gap={"$2"} my={"$2"}>
        <Text fontSize="$5" fontWeight="bold">
          What is Wellness Score?
        </Text>
        <Text fontSize="$4">
        The Wellness Score a comprehensive measure of your overall health and well-being. It’s calculated by analyzing key metrics such as your Heart Rate Variability (HRV), Resting Heart Rate (RHR), daily steps, energy burned, and sleep quality over the past 14 days.
         By using these metrics, the score provides a stable and accurate reflection of your physical and mental health, helping you understand how well your body is responding to your lifestyle and routines.
        </Text>
      </YStack>
      </View>
      <YStack my={"$3"} >
        <Text fontSize="$6" fontWeight="bold">
          Contributing Factors
        </Text>
        {physicalActivities.map((activity) => (
          <Card
            key={activity.uuid}
            elevation={0}
            padding="$5"
            margin="$2"
            backgroundColor="$background"
            borderRadius="$4"
          >
            <XStack justifyContent="space-between" alignItems="center">
              <YStack  space={8}>
               
                <Text  fontSize="16px">
                  {capitalize(HKWorkoutActivityType[ activity.workoutActivityType])}
                </Text>
                <Text>
                  
                 {durationToMins(activity.duration)}
                </Text>
              </YStack>
            
          
                <YStack>
                <Text
                  fontSize="12px"
                  fontWeight="normal"
                  color={colorScheme.primary.lightGreen}
                >
                  {Math.round(activity.totalEnergyBurned?.quantity)} {activity.totalEnergyBurned?.unit}
                </Text>
                {activity.totalDistance?.quantity > 0 && <Text
                  fontSize="12px"
                  fontWeight="normal"
                  color={'$gray10'}
                >
                  {Math.round(activity.totalDistance?.quantity)} {activity.totalDistance?.unit}
                </Text>}
                </YStack>
         
            </XStack>
          </Card>
        ))}
      </YStack>
    </ScrollView>
  );
};

export default PhysicalWrapper;
