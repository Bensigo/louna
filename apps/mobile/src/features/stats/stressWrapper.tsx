import React, { useCallback, useEffect, useState } from "react";
import {  Flame, Footprints, Heart } from "@tamagui/lucide-icons";
import {
  ScrollView,
  Text,
  View,
  XStack,
  YStack,
} from "tamagui";

import { HealthDataType, useHealthKit } from "~/integration/healthKit";
import Score from "./components/score";
import {
  presentStressScore,
} from "./utils";
import ScoreDisplay from "./components/scoreV2";
import { BreakDownCard } from "./physicalWrapper";
import { api } from "~/utils/api";
import { getStartTimeFromInterval } from "../analysis/stress";
import { router } from "expo-router";
import TrendDisplay from "./components/trend";
import { TouchableHighlight } from "react-native";
import { colorScheme } from "~/constants/colors";
import PercentageChart from "./components/scoreChart";





interface Breakdown {
    steps: number;
    energyBurned: number;
    hrv: number;
    rhr: number;
  }

  const now = new Date() 
const StressWrapper = () => {
  const {  getMostRecentValue, isAuthorized } =
    useHealthKit();
  const [stressLevel, setStressLevel] = useState<{
    score: number;
    rating: string;
    description: string;
    percentage: number;
  } | null>(null);
  const [breakDown, setBreakDown] = useState<Breakdown | null>(null);
  const [ startDate, setStartDate ] = useState<Date>(new Date())
  const [activeInterval, setInterval ] = useState<"D" | "W" | "M" | "Y">("D");

  const [get, trend, list ] = api.useQueries((t) => [
    t.log.get({ type: 'Stress'}),
    t.log.trend({ type: 'Stress', days: 7  }),
    t.log.list({ type: 'Stress', startDate, endDate: now})
  ])

 useEffect(() => {
   const start = getStartTimeFromInterval(activeInterval);
   setStartDate(start)
 }, [activeInterval])


 const fetchCurrentData = useCallback(async () => {
  if (!isAuthorized) return;

  const [currentHrv, currentRHR, currentEnegyBurned, currentSteps] =
      await Promise.all([
        getMostRecentValue("HRV"),
        getMostRecentValue("RHR"),
        getMostRecentValue("CALORIES"),
        getMostRecentValue("STEPS"),
      ]);
      
  setBreakDown({
    steps: currentSteps ?? 0,
    energyBurned: currentEnegyBurned ?? 0,
    rhr: currentRHR ?? 0,
    hrv: currentHrv ?? 0,

  });

  
}, [isAuthorized, getMostRecentValue]);


  useEffect(() => {
    void fetchCurrentData();
  }, []);


  useEffect(() => {
    if (get.isFetched){

      const stressInfo = presentStressScore(get.data!.rawScore)
      setStressLevel(stressInfo)  
    }
  }, [get.data, get.isLoading])


  const goTo = (type: HealthDataType) => {
    router.push({
      pathname: "/(tabs)/home/(stats)/physical/[chart]",
      params: {
        type,
      },
    });
  }

  return (
    <ScrollView flex={1} px={10} py={10}>
      {stressLevel !== null ? (
        <>
          <ScoreDisplay score={stressLevel} />
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
          onPress={() => goTo("RHR")}
          icon={Heart}
          color="#008000"
          title="RHR"
          value={breakDown?.rhr}
          unit="BPM"
        />
        <BreakDownCard
          onPress={() => goTo("HRV")}
          icon={Heart}
          color="#008000"
          title="HRV"
          value={breakDown?.hrv}
          unit="ms"
        />
        </YStack>

        <YStack gap="$3" my={"$3"}>
        <Text fontSize="$6" fontWeight="bold">
          Trends
        </Text>
       {trend.isFetched && <TrendDisplay data={trend.data ?? {}} />}
       {list.isFetched   &&  <YStack    backgroundColor="$gray1" padding={10}>
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
            <PercentageChart data={list.data ?? []}  interval={activeInterval} title="" />
        </YStack>}
        </YStack>
          <StressNote />
        </>
      ) : (
        <Text>No stress data</Text>
      )}
    </ScrollView>
  );
};

export default StressWrapper;

const StressScoreExplanation = () => {
  return (
    <YStack gap={'$2'}>
      <Text fontSize="$6" fontWeight="bold" lineHeight={21}>Understanding Your Stress Score</Text>
  
      <Text fontSize="$3.5" lineHeight={17}>
      Your Stress Score is a comprehensive measure of your overall stress levels and physical well-being.
        It combines physiological data with activity metrics to give you a holistic view of your health. What Goes Into Your Stress Score? Heart Rate Variability (HRV), Resting Heart Rate (RHR), Step Count, Energy Burned</Text>
      <Text>These factors are combined to create your daily Stress Score. The score is calculated relative to your personal baseline, established over a 14-day period.</Text>
    </YStack>
  );
};

const StressNote = () => {
  return (
    <YStack padding="$4">
      <View
        backgroundColor="$gray1" // A light gray tint for the background
        borderRadius="$4"
        shadowColor="$gray8"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.1}
        shadowRadius={4}
        overflow="hidden"
        width="100%" 
        p="$4" 
        gap={'$2'}
      >
         <StressScoreExplanation />
        <View
          
          borderLeftWidth={4}
          
          padding="$3"
        >
          <Text fontWeight="bold" >
            Interpreting Your Score:
          </Text>
          <Text >
            A score of 100 means you&apos;re at your baseline level. Scores above 100
            suggest better-than-baseline performance (potentially lower stress),
            while scores below 100 suggest higher stress levels.
          </Text>
        </View>
        
      </View>
    </YStack>
  );
};
