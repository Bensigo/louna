import React, { useCallback, useEffect, useState } from "react";
import { TouchableHighlight } from "react-native";
import { router } from "expo-router";
import { HKCategoryValueSleepAnalysis } from "@kingstinct/react-native-healthkit";
import { AlertCircle, ChevronRight, Heart, Moon } from "@tamagui/lucide-icons";
import {
  endOfDay,
  format,
  setHours,
  setMinutes,
  setSeconds,
  startOfDay,
  subDays,
} from "date-fns";
import { ScrollView, Text, View, XStack, YStack } from "tamagui";

import { colorScheme } from "~/constants/colors";
import { HealthDataType, useHealthKit } from "~/integration/healthKit";
import { api } from "~/utils/api";
import { getStartTimeFromInterval } from "../analysis/stress";
import Score from "./components/score";
import PercentageChart from "./components/scoreChart";
import ScoreDisplay from "./components/scoreV2";
import TrendDisplay from "./components/trend";
import { BreakDownCard } from "./physicalWrapper";
import {
  accToDaily,
  calculatePercentage,
  calculateSleepScore,
  calculateSleepTime,
  calHRVScore,
  calRecoveryScore,
  calRHRScore,
  durationToHours,
  getBaseLineValue,
} from "./utils";

function mapRecoveryScore(score: number) {
  if (!score) return;
  const percentage = calculatePercentage(score);

  if (percentage >= 90) {
    return {
      score,
      percentage,
      rating: "Excellent Recovery",
      description:
        "Your body is fully recovered and ready for intense physical activity. Keep up the good work!",
    };
  } else if (score >= 75) {
    return {
      score,
      percentage,
      rating: "Good Recovery",
      description:
        "Your recovery is solid. You can handle moderate to high activity, but consider a lighter workout if needed.",
    };
  } else if (score >= 60) {
    return {
      score,
      percentage,
      rating: "Moderate Recovery",
      description:
        "You're recovering, but not fully. A light to moderate activity is recommended. Prioritize rest.",
    };
  } else if (score >= 40) {
    return {
      score,
      percentage,
      rating: "Low Recovery",
      description:
        "Your recovery is below average. Focus on rest and recovery, and consider skipping intense activities.",
    };
  } else {
    return {
      score,
      percentage,
      rating: "Poor Recovery",
      description:
        "Your body needs more rest. Avoid strenuous activity and prioritize sleep and stress management.",
    };
  }
}
const now = new Date();
const RecoveryWrapper = () => {
  const { getIntervalData, getMostRecentValue, isAuthorized, getSleepData } =
    useHealthKit();
  const [score, setScore] = useState<number | null>(null);
  const [breakDown, setBreakDown] = useState<{
    restingHeartRate: number;
    hrv: number;
  }>();

  const [startDate, setStartDate] = useState<Date>(new Date());
  const [activeInterval, setInterval] = useState<"D" | "W" | "M" | "Y">("D");

  const [get, trend, list] = api.useQueries((t) => [
    t.log.get({ type: "Recovery" }),
    t.log.trend({ type: "Recovery", days: 7 }),
    t.log.list({ type: "Recovery", startDate, endDate: now }),
  ]);

  useEffect(() => {
    const start = getStartTimeFromInterval(activeInterval);
    setStartDate(start);
  }, [activeInterval]);

  const [sleepTime, setSleepTime] = useState<number | null>(null);
  const [actionableInsight, setActionableInsight] = useState<string>("");

  const fetchTodayData = useCallback(async () => {
    try {
      if (isAuthorized) {
        const yesterday = subDays(new Date(), 1);
        const startOfDaySleep = setHours(
          setMinutes(setSeconds(yesterday, 0), 0),
          20,
        );
        const endOfDaySleep = endOfDay(new Date());

        const [restingHeartRate, hrv, sleepData] = await Promise.all([
          getMostRecentValue("RHR"),
          getMostRecentValue("HRV"),
          getSleepData(startOfDaySleep, endOfDaySleep),
        ]);

        setBreakDown({
          restingHeartRate,
          hrv,
        });
        const minsSlept = calculateSleepTime(sleepData);
        setSleepTime(minsSlept ?? 0);
      }
    } catch (error) {
      console.error("Error fetching health data:", error);
    }
  }, [isAuthorized, getMostRecentValue]);

  const getActionableInsight = (score: number): string => {
    if (score >= 85) {
      return "Your recovery is excellent! This is a great day for high-intensity training or pushing your limits.";
    } else if (score >= 70) {
      return "Good recovery. You're ready for moderate to high-intensity activities. Listen to your body during workouts.";
    } else if (score >= 50) {
      return "Moderate recovery. Consider lower-intensity activities or focus on technique and skill work today.";
    } else {
      return "Your body needs more recovery. Prioritize rest, gentle stretching, or very light activity today.";
    }
  };

  useEffect(() => {
    void fetchTodayData();
  }, []);

  useEffect(() => {
    if (get.isFetched) {
      setScore(get.data!.rawScore);
    }
  }, [get.data, get.isLoading]);

  const goTo = (type: HealthDataType) => {
    router.push({
      pathname: "/(tabs)/home/(stats)/recovery/[chart]",
      params: {
        type,
      },
    });
  };

  //    const { status, description } = mapRecoveryScoreToText(score)

  return (
    <ScrollView flex={1} px={10} py={10}>
      <ScoreDisplay score={mapRecoveryScore(score!)} />

      <YStack gap="$2" my={"$3"}>
        <Text fontSize="$6" fontWeight="bold">
          Breakdown
        </Text>

        <BreakDownCard
          onPress={() => goTo("HRV")}
          icon={Heart}
          color="#FF2D55"
          title="HRV"
          value={breakDown?.hrv ?? 0}
          unit="ms"
        />
        <BreakDownCard
          onPress={() => goTo("RHR")}
          icon={Heart}
          color="#6495ED"
          title="Resting Heart Rate"
          value={breakDown?.restingHeartRate ?? 0}
          unit="BPM"
        />
      </YStack>
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

      <YStack gap="$3" my={"$3"}>
        <Text fontSize="$6" fontWeight="bold">
          Trends
        </Text>
       {trend.isFetched && <TrendDisplay data={trend.data ?? {}} />}
        {list.isFetched && (
          <YStack backgroundColor="$gray1" padding={10}>
            <XStack borderRadius="$4" padding="$1" marginBottom="$3">
              {["D", "W", "M", "Y"].map((filter) => (
                <TouchableHighlight
                  key={filter}
                  onPress={() => setInterval(filter as "D" | "W" | "M" | "Y")}
                  style={{
                    flex: 1,
                    backgroundColor: "transparent",
                    padding: 10,
                  }}
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
            <PercentageChart
              data={list.data}
              interval={activeInterval}
              title=""
            />
          </YStack>
        )}
      </YStack>
      <View
        my={"$3"}
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
            What is Recovery Score?
          </Text>
          <Text fontSize="$4">
            Recovery is the process your body goes through to repair and
            strengthen itself after physical activity. It’s essential because,
            during exercise, your muscles, energy systems, and overall body
            undergo stress. Recovery allows your body to heal, adapt, and get
            stronger. We calculate Your recovery score by analyzing key metrics
            such as your Heart Rate Variability (HRV), Resting Heart Rate (RHR)
            and sleep quality over the past 14 days.
          </Text>
        </YStack>
      </View>

      {/* <YStack my={"$3"}>
        <Text fontSize="$6" fontWeight="bold">
          Actionable Insight
        </Text>
        {actionableInsight && (
          <YStack
            gap={"$2"}
            my={"$2"}
            backgroundColor="$blue2"
            p={10}
            borderRadius={10}
          >
            <Text fontSize="$5" fontWeight="bold" color="$blue11">
              <AlertCircle size={20} color="$blue11" /> Insight
            </Text>
            <Text fontSize="$4" color="$blue11">
              {actionableInsight}
            </Text>
          </YStack>
        )}
      </YStack> */}
    </ScrollView>
  );
};

export default RecoveryWrapper;
