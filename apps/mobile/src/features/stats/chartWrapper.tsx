import React, { useCallback, useEffect, useState } from "react";
import { TouchableHighlight } from "react-native";
import { ScrollView, Text, View, XStack } from "tamagui";

import { HealthDataType, useHealthKit } from "~/integration/healthKit";
import {Chart} from "./components/chart";
import { getStartTimeFromInterval } from "../analysis/stress";
import { processDataForChart } from "../analysis/utils/processData";
import { colorScheme } from "~/constants/colors";
import { router } from "expo-router";
import { PanelLeftClose, X } from "@tamagui/lucide-icons";

interface ChartWrapperProps {
  healthDataType: HealthDataType; // "CALORIES (Engergy burned)" | "STEPS" | "HRV" | "HEART_RATE" | "RHR" | "STAND"
}

const ChartWrapper: React.FC<ChartWrapperProps> = ({ healthDataType }) => {
  const { isAuthorized, getMostRecentValue, getIntervalData } = useHealthKit();
  const [chartData, setChartData] = useState([]);
  const [activeFilter, setFilter] = useState<"D" | "W" | "M" | "Y">("D");

  const [avg, setAvg] = useState(0);

 const isBar = healthDataType === "STEPS" || healthDataType === "CALORIES";

  const fetchChartData = useCallback(
    async (filter: "D" | "W" | "M" | "Y", type: HealthDataType) => {
      if (!isAuthorized) {
        return [];
      }
      const now = new Date();
      const start = getStartTimeFromInterval(filter);
      const data = await getIntervalData(type, start, now);

      ;

      const preprocessData = (samples) => samples.map((sample) => ({
          timestamp: new Date(sample?.startTime),
          value: Math.round(sample.value),
        }));


      const { processedData } = processDataForChart(
        preprocessData(data),
        filter,
        type,
      );
      return processedData;
    },
    [isAuthorized, getIntervalData],
  );

  useEffect(() => {
    void (async () => {
      const data = await fetchChartData(activeFilter, healthDataType);
 
      if (data.length > 0) {
        setChartData(data);
        let total = 0;
        let count = 0;
        if (healthDataType === 'STEPS' || healthDataType === 'CALORIES') {
          total = data.reduce((sum, item) => sum + item.value, 0);
          count = data.length;
        } else if (healthDataType === 'HEART_RATE' || healthDataType === 'RHR') {
          total = data.reduce((sum, item) => sum + item.value, 0);
          count = data.length;
        } else {
          // Handle other healthDataTypes as needed
        }
        const avg = total / count;
        setAvg(Math.round(avg));
      }
    })();
  }, [activeFilter, fetchChartData, healthDataType]);

  const getSubtitle = (filter: "D" | "W" | "M" | "Y") => {
    switch (filter) {
      case "D":
        return "Today";
      case "W":
        return "Past 7 days";
      case "M":
        return "This month";
      case "Y":
        return "This year";
    }
  };

  return (
    <ScrollView >
      <XStack my={'$3'} alignItems="center" justifyContent="flex-start">
      <TouchableHighlight
       
        onPress={() => router.dismiss()}
      >
        <X />
      </TouchableHighlight>
      </XStack>
      <XStack borderRadius="$4" padding="$1" marginBottom="$3">
        {["D", "W", "M", "Y"].map((filter) => (
          <TouchableHighlight
            key={filter}
            onPress={() => setFilter(filter as "D" | "W" | "M" | "Y")}
            style={{ flex: 1, backgroundColor: "transparent", padding: 10 }}
            pressStyle={{
              backgroundColor: "transparent",
              borderWidth: 0,
              border: 0,
            }}
          >
            <Text
              color={
                activeFilter === filter
                  ? colorScheme.primary.lightGreen
                  : colorScheme.secondary.darkGray
              }
              fontWeight={activeFilter === filter ? "bold" : "normal"}
            >
              {filter}
            </Text>
          </TouchableHighlight>
        ))}
      </XStack>
     {chartData?.length > 0  && <Chart
        data={chartData}
        isBar={isBar} 
        title={healthDataType?.replaceAll('_', ' ').toLowerCase()}
        subtitle={getSubtitle(activeFilter)}
        avg={avg}
      />}
      <View 
      my={'$2'}
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
        <HealthDataTypeDetails  healthDataType={healthDataType} />
      </View>
    </ScrollView>
  );
};

export default ChartWrapper;


interface HealthDataTypeDetailsProps {
  healthDataType: HealthDataType;
}

const healthDataTypeInfo: Record<HealthDataType, { what: string; why: string }> = {
  "CALORIES": {
    what: "Calories, in this context, refer to the amount of energy your body burns throughout the day. This includes energy used for basic bodily functions (basal metabolic rate) and additional energy expended through physical activity.",
    why: "Tracking calories burned is crucial for maintaining a healthy weight and understanding your energy balance. It helps you make informed decisions about your diet and exercise routine. By comparing calories burned to calories consumed, you can effectively manage weight loss, gain, or maintenance goals."
  },
  "STEPS": {
    what: "Steps are a measure of physical activity, counting the number of steps you take throughout the day. Most devices use accelerometers to detect motion and estimate step count.",
    why: "Tracking steps encourages regular movement and provides an easy-to-understand metric for daily activity. Aiming for a target (e.g., 10,000 steps) can motivate you to be more active, which has numerous health benefits including improved cardiovascular health, weight management, and mental well-being. It's a simple way to combat sedentary lifestyles and reduce the risk of chronic diseases associated with inactivity."
  },
  "HRV": {
    what: "Heart Rate Variability (HRV) measures the variation in time between successive heartbeats. It's not the same as heart rate; instead, it looks at the small fluctuations in the intervals between heartbeats.",
    why: "HRV is a powerful indicator of your body's ability to adapt to stress and recover. Higher HRV generally indicates better cardiovascular fitness and a more resilient nervous system. It can help you understand your body's readiness for exercise, need for recovery, and overall stress levels. Monitoring HRV over time can provide insights into your overall health, sleep quality, and how well you're balancing stress and recovery in your daily life."
  },
  "HEART_RATE": {
    what: "Heart rate is the number of times your heart beats per minute. It can vary depending on factors like physical activity, emotional state, and overall health.",
    why: "Monitoring your heart rate provides valuable insights into your cardiovascular health and fitness level. During exercise, it helps you gauge the intensity of your workout and ensure you're training in the right zones for your goals. Resting heart rate can indicate improvements in cardiovascular fitness over time. Unusual changes in heart rate patterns can also alert you to potential health issues or high stress levels, prompting you to seek medical advice if needed."
  },
  "RHR": {
    what: "Resting Heart Rate (RHR) is your heart rate when you're completely at rest, typically measured first thing in the morning before getting out of bed. It's a baseline measure of how hard your heart is working to pump blood when you're not active.",
    why: "RHR is an important indicator of your cardiovascular health and fitness. A lower RHR generally indicates a stronger, more efficient heart. Tracking your RHR over time can show improvements in your cardiovascular fitness as you become more active or lose weight. It can also alert you to potential health issues - a sustained increase in RHR could indicate stress, illness, or other health concerns that might need medical attention."
  },
  "STAND": {
    what: "Stand tracking typically measures the number of hours in a day where you stand up and move around for at least a minute. It's designed to combat the negative effects of prolonged sitting.",
    why: "Regular standing and movement throughout the day is crucial for overall health. Prolonged sitting has been linked to various health issues, including increased risk of heart disease, diabetes, and musculoskeletal problems. By tracking and encouraging regular standing breaks, this metric helps reduce the harmful effects of a sedentary lifestyle. It promotes better posture, increased calorie burn, improved circulation, and can even boost productivity and mental alertness."
  }
};

const HealthDataTypeDetails: React.FC<HealthDataTypeDetailsProps> = ({ healthDataType }) => {
  const info = healthDataTypeInfo[healthDataType];

  if (!info) {
    return null;
  }

  return (
    <View marginTop="$4"   borderRadius="$2">
      <Text fontSize="$5" fontWeight="bold" marginBottom="$2">
        {healthDataType.replaceAll('_', ' ')}
      </Text>
      <Text fontSize="$4" fontWeight="bold" marginBottom="$1">
        What it is:
      </Text>
      <Text fontSize="$4" marginBottom="$2">
        {info.what}
      </Text>
      <Text fontSize="$4" fontWeight="bold" marginBottom="$1">
        Why it's important:
      </Text>
      <Text fontSize="$4">
        {info.why}
      </Text>
    </View>
  );
};


