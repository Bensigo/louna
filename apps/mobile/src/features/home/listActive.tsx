import React, { useCallback, useEffect, useState } from "react";
import { FlatList } from "react-native";
import {
  Button,
  Card,
  H2,
  Progress,
  Text,
  View,
  XStack,
  YStack,
} from "tamagui";

import { colorScheme } from "~/constants/colors";
import { api, type RouterOutputs } from "~/utils/api";
import { format } from 'date-fns';
import Healthkit, { HKQuantityTypeIdentifier, HKUnits } from "@kingstinct/react-native-healthkit";

type Goal = RouterOutputs["challenges"]["activeGoals"][0];


type GoalType = RouterOutputs["challenges"]["activeGoals"][0]['goalType']

const GOAL_UNITS = {
    STRESS_RELIEF: "%(Decrease)",
    DURATION: "minutes",
    STEPS: "Steps",
    CALORIES_BURN: "Cal",
    DISTANCE: 'KM'
};


function getIdentifierAndUnitFromType(type: GoalType): { identifier: HKQuantityTypeIdentifier, unit: HKUnits | string } {
    switch (type) {
      case 'CALORIES_BURN': return { identifier: HKQuantityTypeIdentifier.activeEnergyBurned, unit:  'cal' };
      case 'STEPS': return { identifier: HKQuantityTypeIdentifier.stepCount, unit: HKUnits.Count };
      case 'STRESS_RELIEF': return { identifier: HKQuantityTypeIdentifier.heartRateVariabilitySDNN, unit: 'ms' };
      case 'DISTANCE': return { identifier: HKQuantityTypeIdentifier.distanceWalkingRunning, unit: 'km'};
      default: throw new Error(`Unsupported type: ${type}`);
    }
  }

const identifiers = [
    HKQuantityTypeIdentifier.activeEnergyBurned,
    HKQuantityTypeIdentifier.stepCount,
    HKQuantityTypeIdentifier.distanceCycling,
    HKQuantityTypeIdentifier.distanceWalkingRunning,
    HKQuantityTypeIdentifier.heartRate,
    HKQuantityTypeIdentifier.heartRateVariabilitySDNN,
  ];

const ChallengeItem = ({ goal, isAuthorized  }: { goal: Goal, isAuthorized: boolean }) => {
    const [progress, setProgress] = useState(0);
    const [currentValue, setCurrentValue] = useState(0);

    const getData = async (type: GoalType, goal: Goal) => {
        console.log("======= called ==========", isAuthorized)
        if (!isAuthorized) return;
        const now = new Date();
        let progress = 0;
        let currentValue = 0;
        console.log({ type })
        switch (type) {
            case 'CALORIES_BURN': 
                const calories = await Healthkit.queryQuantitySamples(HKQuantityTypeIdentifier.activeEnergyBurned, {
                    from: goal.start,
                    to: now,
                });
                console.log({ calories })
                currentValue = Math.round(calories.reduce((sum, sample) => sum + sample.quantity, 0));
                progress = (currentValue / goal.value) * 100;
                break;
            case 'DURATION':
                const durationDiff = now.getTime() - new Date(goal.start).getTime();
                progress = (durationDiff / (goal.value * 60000)) * 100; // Convert goal value from minutes to milliseconds
                break;
            case 'STRESS_RELIEF':
                const { identifier } = getIdentifierAndUnitFromType(type);
                const preActivityData = await Healthkit.queryQuantitySamples(identifier, {
                    from: new Date(new Date(goal.start).setDate(new Date(goal.start).getDate() - 7)),
                    to: new Date(goal.start),
                });
                const postActivityData = await Healthkit.queryQuantitySamples(identifier, {
                    from: goal.start,
                    to: now,
                });
                const preAvg = preActivityData.reduce((sum, sample) => sum + sample.quantity, 0) / preActivityData.length;
                const postAvg = postActivityData.reduce((sum, sample) => sum + sample.quantity, 0) / postActivityData.length;
                currentValue = postAvg - preAvg;
                progress = (currentValue / preAvg) * 100;
                break;
            case 'STEPS':
                const stepsData = await Healthkit.queryQuantitySamples(HKQuantityTypeIdentifier.stepCount, {
                    from: goal.start,
                    to: now,
                });
                currentValue = stepsData.reduce((sum, sample) => sum + sample.quantity, 0);
                progress = (currentValue / goal?.value) * 100;
                break;
            case 'DISTANCE':
                const distanceData = await Healthkit.queryQuantitySamples(HKQuantityTypeIdentifier.distanceWalkingRunning, {
                    from: goal.start,
                    to: now,
                });
                currentValue = distanceData.reduce((sum, sample) => sum + sample.quantity, 0);
                progress = (currentValue / goal.value) * 100;
                break;
        }

        setProgress(progress);
        setCurrentValue(currentValue);
    }

  useEffect(() => {
    void getData(goal.goalType, goal)
  })
  return (
    <Card
      size="$4"
      animation="bouncy"
      scale={0.9}
      hoverStyle={{ scale: 0.925 }}
      pressStyle={{ scale: 0.875 }}
      borderRadius="$4"
      margin="$2"
      padding="$3"
      backgroundColor={"white"}
    >
      <YStack space="$2">
        <Text
          fontSize="$5"
          fontWeight="bold"
          color={colorScheme.secondary.darkGray}
        >
          {goal?.title}
        </Text>
        <Text fontSize="$2" color="$gray11">
          {goal?.goalType?.replaceAll('_', ' ')} - {goal?.value} {GOAL_UNITS[goal?.goalType]}
        </Text>
        <Text fontSize="$2" color="$gray11">
          {format(new Date(goal?.start), 'MMM d, h:mm a')} - {format(new Date(goal?.end), 'MMM d, h:mm a')}
        </Text>
        <XStack alignItems="center" space="$2">
          <Progress
            width={"80%"}
            value={progress}
            backgroundColor="$gray5"
          >
            <Progress.Indicator animation="bouncy" backgroundColor="$red10" />
          </Progress>
          <Text fontSize="$2" color="$gray10">
            {currentValue} /{goal?.value} {GOAL_UNITS[goal?.goalType]}
          </Text>
        </XStack>
      </YStack>
    </Card>
  );
};

const ListActiveChallenges: React.FC<{ goals: Goal[] }> = ({ goals }) => {
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
      void (async () => {
        const isAuthorized = await requestPermissions()
        setIsAuthorized(isAuthorized)
      })()
  }, [requestPermissions, isAuthorized])
  return (
    <YStack gap="$4" flex={1}>
      <XStack justifyContent="space-between" alignItems="center">
        <H2 fontSize={25} color={colorScheme.primary.lightGreen}>
          Active Challenges
        </H2>
        <Button
          size="$3"
          pressStyle={{ backgroundColor: "transperent", borderWidth: 0 }}
          backgroundColor={"transperent"}
          borderWidth={0}
          color={colorScheme.primary.green}
          borderColor={colorScheme.primary.green}
        >
          View All
        </Button>
      </XStack>
      <FlatList
        data={goals}
        renderItem={({ item }) => <ChallengeItem goal={item} isAuthorized={isAuthorized} />}
        keyExtractor={(item) => item?.id}
        showsVerticalScrollIndicator={false}
      />
    </YStack>
  );
};

const ListActive = () => {
  const { data: goals, isLoading } = api.challenges.activeGoals.useQuery();

  return (
    <View flex={1} padding="$2">
      {!isLoading && goals?.length > 0 && <ListActiveChallenges goals={goals} />}
    </View>
  );
};

export default ListActive;
