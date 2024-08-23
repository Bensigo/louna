import React, { useCallback, useEffect, useState } from "react";
import { View, Card, XStack, Button, Text, ScrollView, YStack } from "tamagui";
import { LineChart } from "react-native-gifted-charts";
import { Flame, Heart, Activity, BarChart2, Footprints, ChevronUp, ChevronDown } from "@tamagui/lucide-icons";
import { colorScheme } from "~/constants/colors";
import { HealthSample, useHealthKit } from "~/integration/healthKit";
import { startOfDay, startOfMonth, startOfWeek, startOfYear } from "date-fns";
import { processDataForChart } from "../utils/processData";
import { HealthDataPoint } from "../utils/util";





interface ActivityData {
  steps: number;
  heartRate: number;
  energyBurned: number;
}

interface HrvSummary {
  hrv: number;
  percentage: string;
  isIncrease: boolean;
  treashold: string | null;
};


export function getStartTimeFromInterval(interval: string): Date {
  const now = new Date();
  switch (interval) {
    case 'D':
      return startOfDay(now);
    case 'W':
      return startOfWeek(now);
    case 'M':
      return startOfMonth(now);
    case 'Y':
      return startOfYear(now);
    default:
      return now;
  }
}

interface StressBreakdown {
  label: string;
  value: number;
  percentage: number;
  color: string;
}

function processStressBreakdownData(hrvData: HealthSample[]): StressBreakdown[] {
  const stressLevels = [
    { label: 'Great', threshold: 70, color: '#4CAF50' },
    { label: 'Normal', threshold: 45, color: '#90CAF9' },
    { label: 'Pay Attention', threshold: 30, color: '#FFCC80' },
    { label: 'Overload', threshold: 0, color: '#EF5350' },
  ];

  const breakdown = stressLevels.map(level => ({
    ...level,
    value: 0,
    percentage: 0,
  }));

  hrvData.forEach(data => {
    const level = stressLevels.find(l => data.value >= l.threshold);
    if (level) {
      const index = breakdown.findIndex(b => b.label === level.label);
      if (index !== -1) {
        breakdown[index].value++;
      }
    }
  });

  const total = breakdown.reduce((sum, item) => sum + item.value, 0);

  return breakdown.map(item => ({
    ...item,
    percentage: total > 0 ? Math.round((item.value / total) * 100) : 0,
  }));
}

  // Calming color palette
  const colors = {
    background: "#F8FAFC",
    primary: "#64B5F6",
    secondary: "#81C784",
    high: "#FF8A65",
    text: "#334E68",
    lightText: "#94A3B8",
    accent: "#E2E8F0",
  };

const filters = ["D", "W", "M", "Y"];
const hrvTreashold = {
  'Great': 70,
  'Normal': 45,
  'Pay Attention': 30,
  'Overload': 0,
}

const StressWrapper = () => {
  const [activeFilter, setActiveFilter] = useState<'D' |'W'| 'M'| 'Y'>("D");
  
  const [data, setData] = useState<any[]>([]);  
  const [isLoadingActivity, setLoadingActivity] = useState<boolean>(false);
  const [activityData, setActivityData] = useState<ActivityData | null>(null);
  const [hrvSummary, setHrvSummary ] = useState<HrvSummary>(null)
  const [stressBreakdown, setStressBreakDown] = useState<StressBreakdown[]>([])
  const { isAuthorized, getMostRecentValue, getIntervalData } = useHealthKit()


  const lineData = [
    { value: 65 }, { value: 70 }, { value: 62 }, { value: 68 },
    { value: 74 }, { value: 66 }, { value: 72 }
  ];

  const fetchActivityData = useCallback(async () => {
    try {
      setLoadingActivity(true);
      if (isAuthorized) {
        console.log({ isAuthorized });
        const steps = await getMostRecentValue('STEPS');
        const heartRate = await getMostRecentValue('HEART_RATE');
        const energyBurned = await getMostRecentValue('CALORIES');
        setActivityData({
          steps: steps ?? 0,
          heartRate: heartRate ?? 0,
          energyBurned: energyBurned ?? 0,
        });
      }
    } catch (error) {
      console.error('Error fetching health data:', error);
    } finally {
      setLoadingActivity(false);
     
    }
  }, [isAuthorized, getMostRecentValue]);

  const fetchStressOverView = useCallback(async () => {
    if (!isAuthorized) {
      setHrvSummary({ hrv: 0, percentage: '0', isIncrease: false, treashold: null });
      return;
    }
    const now = new Date();
    const beginOfDay = startOfDay(now);

    const hrvs = await getIntervalData('HRV', beginOfDay, now);

    const reversedHrvs = hrvs?.reverse() ?? [];
    const currentHrv = reversedHrvs[0]?.value ?? 0;
    const prevHrv = reversedHrvs[1]?.value ?? 0;
    const difference = currentHrv - prevHrv;

    const percentage = (difference / prevHrv) * 100;
  
    const isIncrease = difference > 0;
    const threshold = Object.keys(hrvTreashold).find(key => hrvTreashold[key] <= currentHrv);
    
    setHrvSummary({
      hrv: Math.round(currentHrv),
      percentage: percentage.toFixed(2),
      isIncrease,
      treashold: threshold
    } as HrvSummary);
  }, [isAuthorized, getIntervalData]);



  const fetchIntervalData = useCallback(async (activeFilter: 'D' |'W'| 'M'| 'Y' ) => {
    if(!isAuthorized){
      return []
    }
    const now = new Date();
    const start = getStartTimeFromInterval(activeFilter)
    const hrvs = await getIntervalData('HRV', start, now)

    return hrvs
  }, [isAuthorized])


  useEffect(() => {
   void  (async () => {
    const hrvs  =  await fetchIntervalData(activeFilter)
    const breakDown = processStressBreakdownData(hrvs)
   
    const preprocessData: HealthDataPoint[] = hrvs.map(sample => ({
      timestamp: new Date(sample?.startTime),
      value: Math.round(sample.value)
    }));
    const chartData = processDataForChart(preprocessData, activeFilter, 'HRV')
    setStressBreakDown(breakDown)
    setData(chartData)
   })()
  }, [activeFilter, setStressBreakDown, fetchIntervalData])
  
  


  useEffect(() => {
    void fetchActivityData();

  }, [fetchActivityData]);

  useEffect(() => {
  
    void fetchStressOverView()
  }, [ fetchStressOverView]);




  const maxValue = Math.max(...data.map(item => item.value));
  const minValue = Math.min(...data.map(item => item.value));
  const yAxisRange = maxValue - minValue;

  const chartProps = {
    data,
    noOfSections: 5,
    maxValue: maxValue + yAxisRange * 0.1,
    minValue: Math.max(0, minValue - yAxisRange * 0.1),
    yAxisTextStyle: { color: '#999', fontSize: 12 },
    xAxisLabelTextStyle: { color: '#999', fontSize: 10 },
    showXAxisLabels: true,
  
  };


  return (
    <View flex={1} backgroundColor={"#F0FFF0"} >
      {/* Activity Card */}
      <Card 
        elevation={0} 
        padding="$4" 
        margin="$2"
        backgroundColor="white"
        borderRadius="$4"
      >
        <XStack justifyContent="space-between" alignItems="center" mb="$3">
          <XStack alignItems="center" space="$2">
            <Activity size={24} color="#FF9500" />
            <Text fontSize="$6" fontWeight="bold" color={colorScheme.text.secondary}>Activity</Text>
          </XStack>
        </XStack>
        <XStack justifyContent="space-between" alignItems="center">
          <YStack>
            <XStack alignItems="center" space="$2">
              <Flame size={15} color="#FF2D55" />
              <Text color="#FF2D55" fontSize="$3">Energy</Text>
            </XStack>
            <Text color={colorScheme.text.secondary} fontSize="$6" fontWeight="bold">{activityData?.energyBurned} <Text fontSize="$4" fontWeight="normal" color={colorScheme.text.secondary}>cal</Text></Text>
          </YStack>
          <YStack>
            <XStack alignItems="center" space="$2">
              <Footprints size={15} color="#6495ED" />
              <Text color="#6495ED" fontSize="$3">Steps</Text>
            </XStack>
            <Text color={colorScheme.text.secondary} fontSize="$6" fontWeight="bold">{activityData?.steps} <Text fontSize="$4" fontWeight="normal" color={colorScheme.text.secondary}>steps</Text></Text>
          </YStack>
          <YStack>
            <XStack alignItems="center" space="$2">
              <Heart size={15} color="#008000" />
              <Text color="#008000" fontSize="$3">Heart Rate</Text>
            </XStack>
            <Text color={colorScheme.text.secondary} fontSize="$6" fontWeight="bold">{activityData?.heartRate} <Text fontSize="$4" fontWeight="normal" color={colorScheme.text.secondary}>bpm</Text></Text>
          </YStack>
        </XStack>
      </Card>

      {/* Stress Overview Card */}
      <Card 
        elevation={0} 
        padding="$4" 
        margin="$2"
        backgroundColor="white"
        borderRadius="$4"
      >
        <XStack alignItems="center" space="$2" mb="$2">
          <BarChart2 size={24} color={colorScheme.text.secondary} />
          <YStack>
              <Text fontSize="$6" fontWeight="bold" color={colorScheme.text.secondary}>Stress Overview</Text>
              <Text fontSize={'$2'} color={colorScheme.secondary.gray}>Using HRV data</Text>
          </YStack>

        </XStack>
        <XStack justifyContent="space-between" alignItems="center" backgroundColor={colorScheme.background.light} padding="$3" borderRadius="$4">
          <YStack>
            <Text fontSize="$4" color={colorScheme.text.secondary}>Current Stress Level</Text>
            <Text fontSize="$7" fontWeight="bold" color={colorScheme.primary.green}>{hrvSummary?.treashold}</Text>
          </YStack>
          <YStack alignItems="flex-end">
            <Text fontSize="$7" fontWeight="bold" color={colorScheme.secondary.darkGray}>{hrvSummary?.hrv} <Text fontSize="$4" fontWeight="normal" color={colorScheme.secondary.gray}>ms</Text></Text>
            <XStack alignItems="center" space="$1">
              {hrvSummary?.isIncrease ? (
                <ChevronUp size={16} color={colorScheme.primary.green} />
              ) : (
                <ChevronDown size={16} color={colorScheme.accent.red} />
              )}
              <Text fontSize="$3" color={hrvSummary?.isIncrease ? colorScheme.primary.green : colorScheme.accent.red}>
                {hrvSummary?.percentage}%
              </Text>
            </XStack>
          </YStack>
        </XStack>
      </Card>

      {/* Levels Breakdown Card */}
      <Card 
        elevation={0} 
        padding="$5" 
        margin="$2"
        backgroundColor="white"
        borderRadius="$4"
      >
        <YStack space="$4">
          <XStack alignItems="center" space="$2">
            <Text fontSize={20}>😬</Text>
            <YStack>
              <Text fontSize="$6" fontWeight="bold" color={colors.text}>Stress Levels Breakdown</Text>
              <Text fontSize="$4" color={colors.lightText}>Understand the stress distribution</Text>
            </YStack>
          </XStack>
          
          <XStack backgroundColor={colors.accent} borderRadius="$4" padding="$1" marginBottom="$3">
            {filters.map((filter) => (
              <Button
                key={filter}
                flex={1}
                onPress={() => setActiveFilter(filter)}
                backgroundColor="transparent"
                pressStyle={{
                    backgroundColor: 'transparent',
                    borderWidth: 0
                }}
              >
                <Text
                  color={activeFilter === filter ? colorScheme.primary.lightGreen : colorScheme.secondary.darkGray}
                  fontWeight={activeFilter === filter ? 'bold' : 'normal'}
                >
                  {filter}
                </Text>
              </Button>
            ))}
          </XStack>
          
          <Card backgroundColor="#F5F5F5" padding="$4" borderRadius="$4">
            <Text fontSize="$4" fontWeight="bold" color={colors.text} mb="$2">Levels Breakdown</Text>
            
          {stressBreakdown.length > 1 ? <>
           <Text fontSize="$3" color={colors.lightText} mb="$1">Total</Text>
            <Text fontSize="$8" fontWeight="bold" color={colors.text} mb="$3"> {stressBreakdown?.reduce((sum, item) => sum + item.value, 0)}<Text fontSize="$4" color={colorScheme.secondary.darkGray}>times</Text></Text>
            
            <YStack space="$3">
              { stressBreakdown?.map((item, index) => (
                <XStack key={index} justifyContent="space-between" alignItems="center">
                  <XStack alignItems="center" gap="$2">
                    <View width={12} height={12} backgroundColor={item?.color} borderRadius={6} />
                    <Text fontSize="$4" color={colors.text}>{item?.label}</Text>
                  </XStack>
                  <YStack alignItems="flex-end">
                    <Text fontSize="$5" fontWeight="bold" color={colors.text}>{item?.value}<Text fontSize="$3" color={colorScheme.secondary.darkGray}>times</Text></Text>
                    <Text fontSize="$3" color={colors.lightText}>{item?.percentage}%</Text>
                  </YStack>
                </XStack>
              ))}
            </YStack>

            <View height={20} flexDirection="row" mt="$3">
              {  stressBreakdown.map((item, index) => (
                <View key={index} flex={item.percentage} backgroundColor={item.color} />
              ))}
            </View>
           </>:  <Text fontSize="$3" color={colors.lightText} mb="$1">No data found</Text>}
          </Card>
        </YStack>
      </Card>

      {/* HRV Trend Card */}
      <Card 
        elevation={0} 
        padding="$5" 
        margin="$2"
        backgroundColor="white"
        borderRadius="$4"
      >
        <YStack space="$3">
          <Text fontSize="$4" fontWeight="bold" color={colors.text}>HRV Trend</Text>
          <XStack backgroundColor={colors.accent} borderRadius="$4" padding="$1" marginBottom="$3">
            {filters.map((filter) => (
              <Button
                key={filter}
                flex={1}
                backgroundColor="transparent"
                onPress={() => setActiveFilter(filter)}
                pressStyle={{
                    backgroundColor: 'transparent',
                    borderWidth: 0
                }}
              >
                <Text
                 color={activeFilter === filter ? colorScheme.primary.lightGreen : colorScheme.secondary.darkGray}
                  fontWeight={activeFilter === filter ? 'bold' : 'normal'}
                >
                  {filter}
                </Text>
              </Button>
            ))}
          </XStack>
          <View style={{ height: 250 }}>
            {data.length > 0 ? (
              <LineChart 
               {...chartProps}
                color={colorScheme.primary.lightGreen}
                dataPointsColor={colorScheme.primary.green}
                startFillColor={colorScheme.primary.lightGreen}
                endFillColor={colorScheme.primary.lightGreen}
                startOpacity={0.9}
                endOpacity={0.2}
                height={200}
                width={300}
                hideDataPoints
                curved
                thickness={2}
                xAxisLabelTextStyle={{ color: '#999', fontSize: 12, rotation: 30, originY: 30, y: 5 }}
                xAxisThickness={0}
                yAxisThickness={0}
                yAxisTextStyle={{ color: '#999', fontSize: 12 }}
              />
            ) : (
              <Text textAlign="center" color={colorScheme.secondary.darkGray}>No data available</Text>
            )}
          </View>
        </YStack>
      </Card>
    </View>
  );
};

export default StressWrapper;