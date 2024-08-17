import React, { useEffect, useState } from 'react';
import { Card, YStack, Text, XStack, Spinner, View, Circle, Avatar } from 'tamagui';
import Healthkit from '@kingstinct/react-native-healthkit';
import { useHealthKit, getIdentifierAndUnitFromType } from '~/integration/healthKit';
import { getStartTimeFromInterval } from './chart';
import { colorScheme } from '~/constants/colors';
import { calculateStressLevel } from './listHealthCards';
import { getUnit } from './utils/util';

type Stats = {
  average: number | null;
  min: number | null;
  max: number | null;
  total:  number | null;
};

const getColorForValue = (value: number | null, type: HealthDataType): string => {
  if (value === null) return '$gray10';

  switch (type) {
    case 'HEART_RATE':
      if (value < 60) return '$blue10';
      if (value < 100) return '$green10';
      if (value < 140) return '$red10';
      return '$green10';
    
    case 'STEPS':
      if (value < 5000) return '$red10';
      if (value < 7500) return '$blue10';
      if (value < 10000) return '$green10';
      return '$green10';
    
    case 'CALORIES':
      if (value <  700) return '$blue10';
      if (value < 2000) return '$green10';
      if (value < 500) return '$red10';
      return '$green10';
    
    // Add more cases for other health data types as needed
    case 'HRV':
      if (value < 70) return '$blue10';
      if (value < 150) return '$green10';
      if (value < 40) return '$red10';
      return '$green10';
    default:
      return '$gray12';
  }
}




const StatsCard = ({ name, interval, stats,  insight, isLoading} : { name: HealthDataType; interval: string , stats: Stats, isLoading: boolean, insight: any}) => {
  const { isAuthorized } = useHealthKit();
  
 


 console.log({ insight, isLoading })

  const StatItem = ({ label, value, name }: { label: string; value: number | null, name: string }) => (
    <YStack alignItems="center" flex={1}>
      <Text fontSize="$2" color="$gray11" fontWeight="600">{label}</Text>
      <Text fontSize="$6" fontWeight="bold" color={getColorForValue(value, name)}>
        {value !== null ? Math.round(value) : '--'}
      </Text>
      <Text fontSize="$1" color="$gray10">{getUnit(name)}</Text>
    </YStack>
  );

  return (
    <Card
      size="$4"
      marginBottom={'$6'}
      backgroundColor="white"
      padding="$3"
      width="100%"
      marginTop="$5"
      borderRadius="$4"
    >
      <YStack space="$3">
      <XStack space="$3" alignItems="flex-start">
          <Card 
            backgroundColor={colorScheme.secondary.lightGray}
            borderRadius="$4"
            paddingHorizontal="$4"
            paddingVertical="$3"
            maxWidth="100%"
          >
            <YStack space="$3">
              <Text fontSize={'$6'} fontWeight={'bold'} color={colorScheme.secondary.darkGray}>Why is {name.replace('_', ' ')} important</Text>
              <XStack space="$2" alignItems="center">
                <Avatar circular size="$3">
                  <Avatar.Image src={require('../../../assets/lounaai.png')} />
                  <Avatar.Fallback backgroundColor="$blue5" />
                </Avatar>
                <Text color={colorScheme.secondary.darkGray} fontSize="$4" fontWeight="bold">
                  Louna
                </Text>
              </XStack>
              <Text color={colorScheme.secondary.darkGray} fontSize="$5">
                Based on your recent activity, it seems you&apos;ve been making steady progress. Keep up the good work and remember to stay hydrated throughout the day!
                
              </Text>
            </YStack>
          </Card>
        </XStack>
        <XStack justifyContent="space-between" alignItems="center">
          <Text fontSize="$6" fontWeight="bold" color={colorScheme.secondary.darkGray}>
            Trends
          </Text>
          <Text fontSize="$3" color="$gray11" fontWeight="600">
            {interval}
          </Text>
        </XStack>
        
        
          <>
            {(name === 'STEPS' || name === 'CALORIES') && (
              <XStack alignItems="center" space="$2" my="$2">
                <Circle size={100} backgroundColor={getColorForValue(stats.total, name)}>
                  <Text color="white" fontWeight="bold" fontSize="$3">{Math.round(stats?.total)} </Text>
                  <Text color="white" textAlign='center' fontWeight="7000" fontSize="$1">Total {name === 'STEPS' ? 'Steps': 'Kcal'} </Text>
                </Circle>
              
              </XStack>
            )}
            {name === 'HRV' && (
              <XStack alignItems="center" space="$2" my="$2">
                <Circle size={40} backgroundColor={getColorForValue(stats.average, name)}>
                  <Text color="white" fontWeight="bold" fontSize="$2">{Math.round(stats.average)}</Text>
                </Circle>
                <YStack>
                  <Text fontSize="$6" fontWeight="bold" color={colorScheme.primary.lightGreen}>
                    {Math.round(stats.average)} {getUnit(name)}
                  </Text>
                  <Text fontSize="$2" color="$gray11">Average</Text>
                </YStack>
                <YStack ml="auto">
                  <Text fontSize="$6" fontWeight="bold" color={colorScheme.primary.lightGreen}>
                    {calculateStressLevel(stats.average)}
                  </Text>
                  <Text fontSize="$2" color="$gray11">Stress Level</Text>
                </YStack>
              </XStack>
            )}
            <View
              backgroundColor={colorScheme.secondary.lightGray}
              borderRadius="$2"
              padding="$3"
               width="100%"
            >
              <XStack justifyContent="space-between" alignItems="center">
                <StatItem label="Min" value={stats.min} name={name} />
                <StatItem label="Avg" value={stats.average} name={name} />
                <StatItem label="Max" value={stats.max} name={name} />
              </XStack>
            </View>
          </>
        
      </YStack>
      <YStack space="$3" mt="$4">
       
        <XStack space="$3" alignItems="flex-start">
          <Card 
            backgroundColor={colorScheme.secondary.lightGray}
            borderRadius="$4"
            paddingHorizontal="$4"
            paddingVertical="$3"
            maxWidth="100%"
          >
            <YStack space="$3">
            <Text fontSize="$6" fontWeight="bold" color={colorScheme.secondary.darkGray}>
          Insight
        </Text>
              <XStack space="$2" alignItems="center">
                <Avatar circular size="$3">
                  <Avatar.Image src={require('../../../assets/lounaai.png')} />
                  <Avatar.Fallback backgroundColor="$blue5" />
                </Avatar>
                <Text color={colorScheme.secondary.darkGray} fontSize="$4" fontWeight="bold">
                  Louna
                </Text>
              </XStack>
             {isLoading && 
             ( <Text color={colorScheme.secondary.darkGray} fontSize="$5">
                 {insight?.insight}
              </Text>
            )}
            </YStack>
          </Card>
        </XStack>
      </YStack>
    </Card>
  );
};

export default StatsCard;