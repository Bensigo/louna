import React, { useEffect, useState } from 'react';
import { Card, XStack, YStack, Text, Stack } from 'tamagui';
import { Heart, Footprints, Activity, Flame, ChevronRight } from '@tamagui/lucide-icons';
import { api } from '~/utils/api';
import { TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import Healthkit, { HKQuantityTypeIdentifier, HKUnits } from '@kingstinct/react-native-healthkit';
import { useHealthKit } from '~/integration/healthKit';

interface HealthCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: React.ReactNode;
  secondaryTitle?: string;
  secondaryValue?: string | number;
  secondaryUnit?: string;
  backgroundColor: string;
  iconColor: string;
}




const HealthCard: React.FC<HealthCardProps & {name: string }> = ({ 
  title, 
  value, 
  unit, 
  icon, 
  secondaryTitle, 
  secondaryValue, 
  secondaryUnit,
  backgroundColor,
  iconColor,
  name
}) => {

  const handlePress = () => {
    router.push(`/(tabs)/home/${name}`);
  };

  return (

 
  <Card
    elevate
    onPress={handlePress}
    size="$4"
    bordered
    animation="bouncy"
    scale={0.9}
    hoverStyle={{ scale: 0.925 }}
    pressStyle={{ scale: 0.875 }}
    backgroundColor={backgroundColor}
    borderWidth={1}
    borderColor={iconColor + '20'}
    flex={1}
   
    height={140}
    margin="$1"
    shadowOffset={{ width: 0, height: 1 }}
    shadowOpacity={0.05}
    shadowRadius={2}
  >
    <YStack flex={1} padding="$3" justifyContent="space-between">
      <XStack justifyContent="space-between" alignItems="center">
        <XStack space="$2" alignItems="center">
          <Stack backgroundColor={backgroundColor} borderRadius="$2" padding="$1">
            {React.cloneElement(icon as React.ReactElement, { color: iconColor, size: 24 })}
          </Stack>
          <Text fontSize="$4" fontWeight="bold" color={iconColor}>{title}</Text>
        </XStack>
        <ChevronRight size={20} color={iconColor} />
      </XStack>
      <XStack justifyContent="space-between" alignItems="flex-end">
        <XStack alignItems="baseline" space="$1">
          <Text fontSize="$8" fontWeight="bold" lineHeight={40} color={iconColor}>{value}</Text>
          <Text fontSize="$3" color={iconColor} fontWeight="medium">{unit}</Text>
        </XStack>
        {secondaryTitle && (
          <XStack alignItems="baseline" space="$1">
            <Text fontSize="$4" fontWeight="900" color={iconColor}>{secondaryTitle}:</Text>
            <Text fontSize="$8" fontWeight="bold" lineHeight={28} color={iconColor}>{secondaryValue}</Text>
            <Text fontSize="$3" color={iconColor} fontWeight="medium">{secondaryUnit}</Text>
          </XStack>
        )}
      </XStack>
    </YStack>
  </Card>

  )

};


interface HealthData {
  steps: number;
  heartRate: number;
  hrv: number;
  stressLevel: string | number;
  energyBurned: number;
}

type StressLevel = 'Low' | 'Medium' | 'High' | 'Unknown';


const HealthCardList: React.FC = () => {
 
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const { isAuthorized, getMostRecentValue } = useHealthKit()

  const calculateStressLevel = (hrv: number | undefined): StressLevel => {
    if (hrv === undefined) return 'Unknown';
    // Implement your stress level calculation logic here
    // For example:
    if (hrv > 70) return 'Low';
    if (hrv > 45) return 'Medium';
    return 'High';
  };

  useEffect(() => {
    const fetchHealthData = async () => {
      try {
        setLoading(true)
         if (isAuthorized){
          console.log({ isAuthorized })
          const steps = await getMostRecentValue('STEPS')
          const heartRate = await getMostRecentValue('HEART_RATE')
          const hrv = await getMostRecentValue('HRV');
          const energyBurned = await getMostRecentValue('CALORIES')
          
          const stressLevel = calculateStressLevel(hrv ?? undefined);
  
          
  
          setHealthData({
            steps: steps ?? 0,
            heartRate: heartRate ?? 0,
            hrv: hrv ?? 0,
            stressLevel,
            energyBurned: energyBurned ?? 0,
          });
         }
        setLoading(false)
      } catch (error) {
        console.error('Error fetching health data:', error);
      } finally {
        setLoading(false);
      }
    };

    void fetchHealthData();
  }, [isAuthorized]);
  
  

  return (
    <YStack  mt={'$3'} justifyContent="space-between" gap="$2">
      <HealthCard
        name='STEPS'
        title="Steps" 
        value={isLoading ? "-" : healthData?.steps ?? 0} 
        unit="steps" 
        icon={<Footprints size={24} />} 
        backgroundColor="#def8d3" 
        iconColor="#4caf50" 
      />
      <HealthCard 
      name='HEART_RATE'
        title="Heart Rate" 
        value={isLoading ? "-" : healthData?.heartRate ?? 0} 
        unit="bpm" 
        icon={<Heart size={24} />} 
        backgroundColor="#fde8e8" 
        iconColor="#f44336" 
      />
      <HealthCard 
      name="HRV"
        title="HRV" 
        value={isLoading ? "-" : healthData?.hrv ?? 0} 
        unit="ms" 
        icon={<Activity size={24} />} 
        secondaryTitle="Stress"
        secondaryValue={isLoading ? "-" : healthData?.stressLevel ?? "N/A"}
        secondaryUnit=""
        backgroundColor="#e6f7ff"
        iconColor="#2196f3"
      />
      <HealthCard 
        title="Energy" 
        value={isLoading ? "-" : healthData?.energyBurned ?? 0} 
        unit="kcal" 
        icon={<Flame size={24} />} 
        backgroundColor="#fff7e6" 
        iconColor="#ff9800" 
        name='CALORIES'
      />
    </YStack>
  )
};

export default HealthCardList;