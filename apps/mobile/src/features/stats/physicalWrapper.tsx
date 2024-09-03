import React, { useCallback, useEffect, useState } from "react";
import { router } from "expo-router";
import type {
  EnergyUnit,
  HKWorkout,
  LengthUnit,
} from "@kingstinct/react-native-healthkit";
import { HKWorkoutActivityType } from "@kingstinct/react-native-healthkit";
import {

  ChevronRight,
  Clock1,
  Flame,
  Footprints,
  Heart,
  Moon,
} from "@tamagui/lucide-icons";
import {
  endOfDay,
  formatDistance,
  setHours,
  setMinutes,
  setSeconds,
  subDays,

} from "date-fns";
import {  Card, ScrollView, Text, View, XStack, YStack } from "tamagui";

import { colorScheme } from "~/constants/colors";
import {  useHealthKit } from "~/integration/healthKit";
import type { HealthDataType } from "~/integration/healthKit";


import { calculateSleepTime, durationToHours, presentWellnessScore } from "./utils";
import ScoreDisplay from "./components/scoreV2";
import { api } from "~/utils/api";
import { getStartTimeFromInterval } from "../analysis/stress";
import TrendDisplay from "./components/trend";
import { TouchableHighlight } from "react-native";
import PercentageChart from "./components/scoreChart";

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
  value: number | string;
  unit: string;
  onPress: () => void;
}> = ({ icon: Icon, color, title, value, unit, onPress }) => (
  <Card
    backgroundColor="$background"
    onPress={onPress}
    pressStyle={{ opacity: 0.8 }}
    animation="bouncy"
    elevate={false}
    style={{
      padding: 12,
      height: 60,
      width: "100%",
      marginHorizontal: 8,
      borderRadius: 8,
      borderWidth: 1,
    }}
  >
    <XStack justifyContent="space-between" alignItems="center">
      <XStack alignItems="center" space={12}>
        <Icon color={color ?? colors.high} fontSize={24} />
        <Text color={colors.lightText} fontSize="$3" fontWeight="bold">
          {title}
        </Text>
      </XStack>
      <XStack alignItems="center" space={8}>
        <Text color={colors.lightText} fontSize="$5" fontWeight="bold">
          {value}{" "}
          <Text fontSize="$2" fontWeight="normal" color={colors.lightText}>
            {unit}
          </Text>
        </Text>
        <ChevronRight color={colors.lightText} size={16} />
      </XStack>
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
const now = new Date() 


const PhysicalWrapper = () => {

  const [activeInterval, setInterval ] = useState<"D" | "W" | "M" | "Y">("D");

  const { isAuthorized, getMostRecentValue, getIntervalData, getWorkout, getSleepData } =
    useHealthKit();
  const [breakDown, setBreakDown] = useState<Breakdown | null>(null);
 
  const [wellnessLevel, setWellnessLevel] = useState<WellnessLevel | null>(null);

  const [sleepTime, setSleepTime] = useState<number | null>(null);

  const [physicalActivities, setPhysicalActivities] = useState<
    HKWorkout<EnergyUnit, LengthUnit>[]
  >([]);


  const [ startDate, setStartDate ] = useState<Date>(new Date())


  const [get, trend, list ] = api.useQueries((t) => [
     t.log.get({ type: 'Wellbeing'}),
     t.log.trend({ type: 'Wellbeing', days: 7  }),
     t.log.list({ type: 'Wellbeing', startDate, endDate: now})
  ])

  useEffect(() => {
    const start = getStartTimeFromInterval(activeInterval);
    setStartDate(start)
  }, [activeInterval])
 

  const fetchPhysicalActivities = useCallback(async () => {
    if (isAuthorized) {
      const start = new Date();
      start.setHours(0, 0, 0, 0); // Start of the day
      const end = new Date();
      const workouts = await getWorkout(start, end);
      setPhysicalActivities(workouts);
    }
  }, [isAuthorized, getWorkout]);

 


  const fetchCurrentData = useCallback(async () => {
    if (!isAuthorized) return;
    const yesterday = subDays(new Date(), 1);
    const startOfDaySleep = setHours(setMinutes(setSeconds(yesterday, 0), 0), 20);
    const endOfDaySleep = endOfDay(new Date());

    const [currentHrv, currentRHR, currentEnergyBurned, currentSteps, heartRate, sleepData] =
      await Promise.all([
        getMostRecentValue("HRV"),
        getMostRecentValue("RHR"),
        getMostRecentValue("CALORIES"),
        getMostRecentValue("STEPS"),
        getMostRecentValue("HEART_RATE"),
        getSleepData(startOfDaySleep, endOfDaySleep)
      ]);

    setBreakDown({
      steps: currentSteps ?? 0,
      energyBurned: currentEnergyBurned ?? 0,
      rhr: currentRHR ?? 0,
      hrv: currentHrv ?? 0,
      heartRate: heartRate ?? 0
    });
   const minsSlept =  calculateSleepTime(sleepData)
   setSleepTime(minsSlept ?? 0)
    
  }, [isAuthorized, getMostRecentValue]);


  useEffect(() => {
    if (get.isFetched){

      const wellnessLvl = presentWellnessScore(get.data?.rawScore as number)
       setWellnessLevel(wellnessLvl)
    }
  }, [get.data, get.isLoading])


  useEffect(() => {
   
    void fetchPhysicalActivities();
    void fetchCurrentData()
  }, [ fetchCurrentData, fetchPhysicalActivities]);
 

  

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
      <YStack gap="$3" my={"$3"}>
        <Text fontSize="$6" fontWeight="bold">
          Trend
        </Text>
        <TrendDisplay data={trend.data ?? {}} />
       {list.data &&  <YStack    backgroundColor="$gray1" padding={10}>
        <XStack borderRadius="$4" padding="$1" marginBottom="$3">
        {["D", "W", "M", "Y"].map((filter) => (
          <TouchableHighlight
            key={filter}
            onPress={() => setInterval(filter as "D" | "W" | "M" | "Y")}
            style={{ flex: 1, backgroundColor: "transparent", padding: 10 }}
            pressStyle={{
              backgroundColor: "transparent",
              borderWidth: 0,
              border: 0,
            }}
          >
            <Text
              color={
                 activeInterval === filter
                  ? colorScheme.primary.lightGreen
                  : colorScheme.secondary.darkGray
              }
              fontWeight={activeInterval === filter ? "bold" : "normal"}
            >
              {filter}
            </Text>
          </TouchableHighlight>
        ))}
      </XStack>
            <PercentageChart data={list.data }  interval={activeInterval} title="" />
        </YStack>}
        </YStack>
     
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
