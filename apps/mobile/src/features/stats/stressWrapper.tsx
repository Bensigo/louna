import React, { useCallback, useEffect, useState } from "react";
import Markdown from "react-native-markdown-display";
import { ChevronRight, Flame, Footprints, Heart } from "@tamagui/lucide-icons";
import { subDays } from "date-fns";
import {
  Circle,
  Progress,
  ScrollView,
  Text,
  View,
  XStack,
  YStack,
} from "tamagui";

import { useHealthKit } from "~/integration/healthKit";
import Score from "./components/score";
import {
  accDaily,
  accToDaily,
  calStressScore,
  getBaseLineValue,
} from "./utils";
import ScoreDisplay from "./components/scoreV2";
import { BreakDownCard } from "./physicalWrapper";



const StressDisplay = ({
  score,
}: {
  score: {
    score: number;
    rating: string;
    description: string;
    percentage: number;
  } | null;
}) => {
  if (!score) return null;

  return (
    <YStack gap="$4" backgroundColor="$red100" padding="$4" borderRadius="$4">
      <XStack alignItems="center" space="$4">
        <Score
          score={score.percentage.toFixed(1)}
          title={score.rating}
          infoText={`you stress score is ${score.score.toFixed(2)}`}
        />
      </XStack>
      <Text fontSize={16} color="$color">
        {score.description}
      </Text>
      {/* <XStack alignItems="center" justifyContent="space-between">
          <Text fontSize={14} color="$color">View Details</Text>
          <ChevronRight size={20} color="$color" />
        </XStack> */}
    </YStack>
  );
};

interface Breakdown {
    steps: number;
    energyBurned: number;
    hrv: number;
    rhr: number;
  }

const StressWrapper = () => {
  const { getIntervalData, getMostRecentValue, isAuthorized, getSleepData } =
    useHealthKit();
  const [stressLevel, setStressLevel] = useState<{
    score: number;
    rating: string;
    description: string;
    percentage: number;
  } | null>(null);
  const [breakDown, setBreakDown] = useState<Breakdown | null>(null);

  const calCulateScore = useCallback(async () => {
    if (!isAuthorized) return;
    const now = new Date();
    const startDate = subDays(now, 15);

    const [hrv, restingHeartRate, energyBurned, steps] = await Promise.all([
      getIntervalData("HRV", startDate, now),
      getIntervalData("RHR", startDate, now),
      getIntervalData("CALORIES", startDate, now),
      getIntervalData("STEPS", startDate, now),
    ]);

    const [currentHrv, currentRHR, currentEnegyBurned, currentSteps] =
      await Promise.all([
        getMostRecentValue("HRV"),
        getMostRecentValue("RHR"),
        getMostRecentValue("CALORIES"),
        getMostRecentValue("STEPS"),
      ]);

    if (hrv.length && restingHeartRate.length) {
      const accHrv = accToDaily(hrv);
      const accRestingHeartRate = accToDaily(restingHeartRate);
      const accEnergyBurned = accDaily(energyBurned);
      const accSteps = accDaily(steps);
      const baseLineHrv = getBaseLineValue(accHrv, 14);
      const baseLineRHR = getBaseLineValue(accRestingHeartRate, 14);
      const baseLineEnergyBurned = getBaseLineValue(accEnergyBurned, 14);
      const baseLineSteps = getBaseLineValue(accSteps, 14);
      console.log({
        baseLineHrv,
        baseLineRHR,
        baseLineEnergyBurned,
        baseLineSteps,
      });
      if (baseLineHrv && baseLineRHR && currentHrv && currentRHR) {
        const stressLevel = calStressScore({
          todayEnergyBurned: currentEnegyBurned,
          baseLineEnergyBurned: baseLineEnergyBurned,
          todaySteps: currentSteps,
          baselineStep: baseLineSteps,
          todayHRV: currentHrv,
          baseLineHRV: baseLineHrv,
          todayRHR: currentRHR,
          baseLineRHR: baseLineRHR,
        });

        setStressLevel(stressLevel);
      }
    }
  }, [getIntervalData, isAuthorized]);

  const fetchBreakdownData = useCallback(async () => {
    try {
      if (isAuthorized) {
        const [steps, energyBurned, restingHeartRate, hrv] =
          await Promise.all([
            getMostRecentValue("STEPS"),
            getMostRecentValue("CALORIES"),
            getMostRecentValue("RHR"),
            getMostRecentValue("HRV"),
           
          ]).then((values) => values.map((value) => value ?? 0));

        setBreakDown({
          steps,
          energyBurned,
          rhr: restingHeartRate,
          hrv,
        });
      

       
      }
    } catch (error) {
      console.error("Error fetching health data:", error);
    }
  }, [isAuthorized, getMostRecentValue]);

  useEffect(() => {
    void calCulateScore();
    void fetchBreakdownData()
  }, []);

  const goTo = (name: string) => {}

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
