import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { View, Text, ScrollView, YStack } from 'tamagui';
import HealthDataChart from '~/features/home/chart';
import { colorScheme } from '~/constants/colors';
import StatskCard from '~/features/home/statsCard';

const HealthSummaryDetail = () => {
  const { name } = useLocalSearchParams();
 const getName = (() => {
    if (name === 'STEPS') {
        return 'Steps';
    } else if (name === 'HEART_RATE') {
        return 'Heart Rate';
    } else if (name === 'CALORIES') {
        return 'Energy Burned';
    } else if (name === 'HRV') {
        return 'HRV';
    } 
 })()
  return (
    <ScrollView flex={1} paddingTop="$6" px={'$3'}>
         <Text fontSize={24} fontWeight="bold" color={colorScheme.primary.lightGreen}>
           {getName} Health Details
        </Text>
      <YStack mt={'$3'} gap="$4">
      <HealthDataChart name={name} />
      </YStack>
    </ScrollView>
  );
};

export default HealthSummaryDetail;
