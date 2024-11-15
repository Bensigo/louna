import React, {  useState } from 'react';
import { Card, YStack, Text, XStack, View, Circle, Avatar, Button } from 'tamagui';
import type {  HealthDataType } from '~/integration/healthKit';
import { colorScheme } from '~/constants/colors';
import { calculateStressLevel } from './listHealthCards';
import { getUnit } from './utils/util';
import { WebView } from 'react-native-webview' 
import {  TouchableWithoutFeedback, Modal } from 'react-native';
import { X } from '@tamagui/lucide-icons';

interface Stats {
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

const healthDataImportance = {
  STEPS: "Tracks daily physical activity, which is crucial for overall fitness and can help in weight management and cardiovascular health.",
  HEART_RATE: "Monitors heart health and can provide insights into cardiovascular fitness, stress levels, and overall well-being.",
  HRV: "Measures the variation in time between heartbeats, which is a key indicator of stress levels, recovery, and overall health.",
  CALORIES: "Helps in managing energy expenditure and maintaining a balanced diet by tracking the number of calories burned during activities."
};


const StatsCard = ({ name, interval, stats,  insightTip, isLoading, link} : { name: HealthDataType; interval: string , link: string,  stats: Stats, isLoading: boolean, insightTip: any}) => {
  console.log({ link })
 const [showWebView, setShowWebview] = useState(false)


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
                
              {healthDataImportance[name]}
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
               <YStack>
               <Text color={colorScheme.secondary.darkGray} fontSize="$5">
                 {insightTip}
              </Text>
              <TouchableWithoutFeedback onPress={() => setShowWebview(true)}>
                     <Text 
                color={colorScheme.primary.lightGreen} 
                fontSize="$6" 
                marginTop="$2" 
              >
               Learn more
              </Text>
              </TouchableWithoutFeedback>
             
               </YStack>
            
            </YStack>
          </Card>
        </XStack>
      </YStack>
      
      <Modal
        visible={showWebView}
        animationType="slide"
        onRequestClose={() => setShowWebview(false)}
      >
        <View style={{ flex: 1 }}>
          <Button
            icon={X}
            size="$4"
            circular
            position="absolute"
            top="$6"
            left="$4"
            zIndex={1}
            onPress={() => setShowWebview(false)}
            backgroundColor="$gray5"
          />
          <WebView
            source={{ uri: link }}
            style={{ flex: 1 }}
          />
        </View>
      </Modal>
    </Card>
  );
};

export default StatsCard;