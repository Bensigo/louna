import React, { useState, useEffect } from 'react';
import { View, Text, Card, YStack, XStack, styled, Button, H3 } from 'tamagui';
import { BarChart } from 'react-native-gifted-charts';
import { Tabs } from 'tamagui';
import { colorScheme } from '~/constants/colors';
import { format, startOfDay, startOfWeek, startOfMonth, startOfYear, parseISO } from 'date-fns';
import { api } from '~/utils/api';


interface HealthDataPoint {
    timestamp: Date;
    value: number
}

const FIXED_BAR_COUNT = 14; // This sets the number of bars we always want to display
const VISIBLE_BARS = 7; // Number of bars visible at once

function processDataForChart(data: HealthDataPoint[], interval: string) {
  const groupedData = new Map<string, { value: number, timestamp: Date }>();

  data.forEach(point => {
    const key = getGroupKey(new Date(point.timestamp), interval);
    const currentData = groupedData.get(key) || { value: 0, timestamp: new Date(point.timestamp) };
    groupedData.set(key, { value: currentData.value + point.value, timestamp: currentData.timestamp });
  });

  const sortedData = Array.from(groupedData, ([label, { value, timestamp }]) => ({ 
    value,
    label,
    timestamp,
    formattedLabel: formatLabel(timestamp, interval)
  }))
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  // Select up to FIXED_BAR_COUNT evenly spaced data points
  const step = Math.max(1, Math.floor(sortedData.length / FIXED_BAR_COUNT));
  return sortedData.filter((_, index) => index % step === 0).slice(-FIXED_BAR_COUNT);
}

function formatLabel(date: Date, interval: string): string {
  switch (interval) {
    case 'day':
      return format(date, 'HH:mm');
    case 'week':
      return format(date, 'EEE');
    case 'month':
      return format(date, 'dd');
    case 'year':
      return format(date, 'MMM');
    default:
      return '';
  }
}

function getGroupKey(date: Date, interval: string): string {
    switch (interval) {
      case 'day':
        return format(date, 'HH:00');
      case 'week':
        return format(startOfWeek(date), 'EEE');
      case 'month':
        return format(date, 'dd');
      case 'year':
        return format(date, 'MMM');
      default:
        return '';
    }
}




const intervals = [
  { label: 'Day', value: 'day' },
  { label: 'Week', value: 'week' },
  { label: 'Month', value: 'month' },
  { label: 'Year', value: 'year' },
];

const StyledCard = styled(Card, {
  backgroundColor: 'white',
  borderRadius: 16,
  shadowOpacity: 0.1,
  width: '100%', // Make the card full width
});

const StyledTabs = styled(Tabs, {
  backgroundColor: '#f0f0f0',
  borderRadius: 12,
  padding: 4,
});

const StyledTabsTrigger = styled(Tabs.Trigger, {
  backgroundColor: 'transparent',
  borderRadius: 8,
  paddingVertical: 8,
  paddingHorizontal: 16,
});

const StyledTabsTriggerText = styled(Text, {
  fontSize: 14,
});

const StyledButton = styled(Button, {
  backgroundColor: colorScheme.primary.green,
  color: 'white',
  borderRadius: 8,
  paddingVertical: 8,
  paddingHorizontal: 16,
  marginRight: 8,
});

const HealthDataChart = ({ name }: {name: string }) => {
  const [interval, setInterval] = useState('day');
  const [data, setData] = useState([]);

  const {isLoading, data: chartData } = api.healthDataLog.list.useQuery({ type: name, interval })

  useEffect(() => {
    if (chartData?.length){
        const processedData = processDataForChart(chartData, interval);
        setData(processedData);
    } else {
        setData([]);
    }
  }, [chartData]);

  const maxValue = data.length > 0 ? Math.max(...data.map((item) => item.value), 1) : 100;
  const averageValue = data.length > 0 ? data.reduce((sum, item) => sum + item.value, 0) / data.length : 0;


  const getUnit = (name: string) => {
    switch (name.toLowerCase()) {
      case 'steps':
        return 'Steps';
      case 'hrv':
        return 'ms';
      case 'heart rate':
        return 'BPM';
      // Add more cases as needed
      case 'calories':
        return 'Cal'
      default:
        return '';
    }
  };


  const calChartData = () => {
    if (data.length === 0) return 'No data';

    const value = name.toLowerCase() === 'steps' || name.toLowerCase() === 'calories'
      ? data.reduce((sum, item) => sum + item.value, 0)
      : data.reduce((sum, item) => sum + item.value, 0) / data.length;

    const formattedValue = value.toFixed(1);
    const prefix = name.toLowerCase() === 'steps' || name.toLowerCase() === 'calories' ? 'Total' : 'Avg';

    return `${prefix} ${formattedValue}`;
  }

  return (
    <StyledCard padding="$4">
      <YStack space="$4" width="100%">
       
        <StyledTabs
          value={interval}
          onValueChange={(value) => setInterval(value)}
          orientation="horizontal"
          flexDirection="row"
        >
          <Tabs.List>
            {intervals.map((item) => (
              <StyledTabsTrigger 
                key={item.value} 
                value={item.value}
                pressStyle={{
                    backgroundColor: colorScheme.primary.lightGreen 
                }}
                backgroundColor={interval === item.value ? colorScheme.primary.green : 'transparent'}
              >
                <StyledTabsTriggerText
                  color={interval === item.value ? 'white' : '#666'}
                  fontWeight={interval === item.value ? '700' : '500'}
                >
                  {item.label}
                </StyledTabsTriggerText>
              </StyledTabsTrigger>
            ))}
          </Tabs.List>
        </StyledTabs>
           <View >
             <XStack alignItems='center' justifyContent='flex-start'>
               <H3>{name}</H3>
               <Text fontSize={18} fontWeight="bold" color={colorScheme.primary.green} marginLeft={10}>
                  {calChartData()} {getUnit(name)}
               </Text>
             </XStack>
           </View>

        {isLoading ? (
          <View height={250} justifyContent="center" alignItems="center">
            <Text color="#666">Loading...</Text>
          </View>
        ) : (
            <View height={250} paddingTop={20} width="100%" >
    
            <BarChart
              data={data.map(item => ({ value: item.value }))}
              barWidth={24}
              spacing={16}
              roundedTop
              roundedBottom
              hideRules
              xAxisThickness={1}
              yAxisThickness={0}
              yAxisTextStyle={{ color: '#999', fontSize: 12 }}
              xAxisLabelTextStyle={{ color: '#999', fontSize: 10 }}
              noOfSections={5}
              maxValue={maxValue}
              barBorderRadius={4}
              frontColor={colorScheme.primary.lightGreen}
              gradientColor="#8a7dfd"
              showXAxisLabels
              xAxisLabelTexts={data.map((item, index) => 
                index % 2 === 0 ? item.formattedLabel : ''
              )}
              xAxisLabelWidth={40}
              rotateLabel
              xAxisLabelsHeight={40}
              xAxisLabelsVerticalShift={3}
              width={300} // Adjust this value as needed
              height={200}
            />
          </View>
        )}
      </YStack>
    </StyledCard>
  );
};

export default HealthDataChart;