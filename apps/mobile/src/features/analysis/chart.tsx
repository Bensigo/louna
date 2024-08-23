import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, YStack, ScrollView, XStack, styled } from 'tamagui';
import { BarChart, LineChart } from 'react-native-gifted-charts';
import {  useHealthKit } from '~/integration/healthKit';
import type {  HealthDataType } from '~/integration/healthKit';
import { processDataForChart } from './utils/processData';
import {  getStartTimeFromInterval, getUnit } from './utils/util';
import type {  HealthDataPoint } from './utils/util';
import StatsCard from "./statsCard"
import { colorScheme } from '~/constants/colors';
import { format } from 'date-fns';
import { api } from '~/utils/api';

interface HealthDataChartProps {
  name: HealthDataType;
}

const FilterButton = styled(View, {
  paddingVertical: 8,
  paddingHorizontal: 12,
  borderRadius: 20,
  backgroundColor: 'transparent',
  marginHorizontal: 4,
  pressStyle: {
    backgroundColor: '#def8d3',
  },
});

const FilterText = styled(Text, {
  color: '$gray11',
  fontSize: 14,
  fontWeight: '700',
  variants: {
    active: {
      true: {
        color: '#4caf50',
        fontWeight: 'bold',
        fontSize: 16
      },
    },
  },
});

const TooltipContainer = styled(View, {
  backgroundColor: '$gray1',
  borderRadius: 8,
  padding: 8,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
});

const TooltipText = styled(Text, {
  color: '$gray12',
  fontSize: 14,
  marginBottom: 4,
});

const HealthDataChart: React.FC<HealthDataChartProps> = ({ name }) => {
  const [interval, setInterval] = useState('day');
  const [isLoading, setLoading] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [stats, setStats] = useState<{ average: number | null; total?: number | null; min: number | null; max: number | null }>({
    average: null,
    total: null,
    min: null,
    max: null
  });
  const [selectedDataPoint, setSelectedDataPoint] = useState(null);


  const { mutate: getInsight , data: insight, isLoading: isAiLoading } = api.coach.getHealthInsight.useMutation()


  const { getIntervalData, isAuthorized } = useHealthKit();

  const intervalOptions = [
    { label: 'D', value: 'day' },
    { label: 'W', value: 'week' },
    { label: 'M', value: 'month' },
    { label: 'Y', value: 'year' },
  ];

  const handleIntervalChange = useCallback((newInterval: string) => {
    setInterval(newInterval);
  }, []);

  const fetchAndProcessData = useCallback(async () => {
    if (!isAuthorized) {
      setData([]);
      setStats({ average: null, total: null, min: null, max: null });
      return;
    }

    try {
      setLoading(true);
      const now = new Date();
      const startTime = getStartTimeFromInterval(interval);
      const healthData = await getIntervalData(name, startTime, now);
     
      const chartData: HealthDataPoint[] = healthData.map(sample => ({
        timestamp: new Date(sample.startTime),
        value: Math.round(sample.value)
      }));
      const processedData = processDataForChart(chartData, interval, name);
     
      setData(processedData);

      // Calculate stats
      if (processedData.length > 0) {
        const values = processedData.map(item => item.value);
        let average, total, min, max;
        
        if (name === 'STEPS' || name === 'CALORIES') {
          total = values.reduce((sum, val) => sum + val, 0);
          average = total / values.length;
        } else {
          average = values.reduce((sum, val) => sum + val, 0) / values.length;
        }
        
        min = Math.min(...values);
        max = Math.max(...values);

        const type = name === 'CALORIES' ? 'ENERGY_BURNED' : name
        getInsight({ avg: average, min, max, ...(total ? { total }: {}), dataType: type  })
        
        setStats({ average, total, min, max });
      } else {
        setStats({ average: null, total: null, min: null, max: null });
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }, [isAuthorized, interval, name, getIntervalData]);

  useEffect(() => {
    fetchAndProcessData();
  }, [fetchAndProcessData]);

  

  const renderChart = useCallback(() => {
    

    if (data.length === 0) {
      return <Text>No data available</Text>;
    }

    const chartData = data.map(item => ({
      value: typeof item.value === 'number' ? Math.round(item.value) : 0,
      label: item.formattedLabel,
      timestamp: item.timestamp,
    }));

    const maxValue = Math.max(...chartData.map(item => item.value));
    const minValue = Math.min(...chartData.map(item => item.value));
    const yAxisRange = maxValue - minValue;

    const chartProps = {
      data: chartData,
      noOfSections: 5,
      maxValue: maxValue + yAxisRange * 0.1,
      minValue: Math.max(0, minValue - yAxisRange * 0.1),
      yAxisTextStyle: { color: '#999', fontSize: 12 },
      xAxisLabelTextStyle: { color: '#999', fontSize: 10 },
      showXAxisLabels: true,
      onPress: (item, index) => setSelectedDataPoint(item),
    };

    if (name === 'STEPS' || name === 'CALORIES') {
      return (
        <BarChart
          {...chartProps}
          barWidth={24}
          spacing={16}
          width={300}
          height={220}
          xAxisThickness={0}
          yAxisThickness={0}
          barBorderRadius={4}
          frontColor={colorScheme.primary.lightGreen}
        />
      );
    } else {
      return (
        <LineChart
          {...chartProps}
          color={colorScheme.primary.lightGreen}
          dataPointsColor={colorScheme.primary.green}
          startFillColor={colorScheme.primary.lightGreen}
          endFillColor={colorScheme.primary.lightGreen}
          startOpacity={0.9}
          endOpacity={0.2}
        
          height={250}
          width={300}
          xAxisLabelTextStyle={{ color: '#999', fontSize: 12, rotation: 30, originY: 30, y: 5 }}
          xAxisThickness={0}
          yAxisThickness={0}
          areaChart
          curved
        />
      );
    }
  }, [data, name, setSelectedDataPoint]);

  return (
    <ScrollView>
      <YStack space="$4" width="100%">
        <XStack justifyContent="center" backgroundColor="#def8d3" padding="$2" borderRadius={24}>
          {intervalOptions.map((option) => (
            <FilterButton
              key={option.label}
              onPress={() => handleIntervalChange(option.value)}
            >
              <FilterText active={interval === option.value}>
                {option.label}
              </FilterText>
            </FilterButton>
          ))}
        </XStack>
      
          <View height={320} paddingTop={20} marginTop={30} width="100%">
            {renderChart()}
           
          </View>

        <StatsCard name={name} interval={interval} stats={stats} link={insight?.link}  insightTip={insight?.insight ?? ''} isLoading={isAiLoading} />
      </YStack>
    </ScrollView>
  );
};

export default HealthDataChart;