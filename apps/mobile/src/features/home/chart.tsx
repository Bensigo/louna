import React, { useState, useEffect } from 'react';
import { View, Text, Card, YStack, XStack, styled } from 'tamagui';
import { BarChart } from 'react-native-gifted-charts';
import { Tabs } from 'tamagui';
import { colorScheme } from '~/constants/colors';
import { format, startOfDay, startOfWeek, startOfMonth, startOfYear, parseISO } from 'date-fns';
import { api } from '~/utils/api';


interface HealthDataPoint {
    timestamp: Date;
    value: number
}

function processDataForChart(data: HealthDataPoint[], interval: string) {
  const groupedData = new Map<string, { value: number, timestamp: Date }>();

  data.forEach(point => {
    const key = getGroupKey(new Date(point.timestamp), interval);
    const currentData = groupedData.get(key) || { value: 0, timestamp: new Date(point.timestamp) };
    groupedData.set(key, { value: currentData.value + point.value, timestamp: currentData.timestamp });
  });

  return Array.from(groupedData, ([label, { value, timestamp }]) => ({ 
    value,
    label,
    timestamp,
    formattedLabel: formatLabel(timestamp, interval)
  }))
    .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
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


  function getMockHealthData(interval: string): HealthDataPoint[] {
    const now = new Date();
    const data: HealthDataPoint[] = [];
    let start: Date;
  
    switch (interval) {
      case 'day':
        start = startOfDay(now);
        for (let i = 0; i < 24; i++) {
          data.push({
            timestamp: new Date(start.getTime() + i * 60 * 60 * 1000),
            value: Math.floor(Math.random() * 100)
          });
        }
        break;
      case 'week':
        start = startOfWeek(now);
        for (let i = 0; i < 7; i++) {
          data.push({
            timestamp: new Date(start.getTime() + i * 24 * 60 * 60 * 1000),
            value: Math.floor(Math.random() * 1000)
          });
        }
        break;
      case 'month':
        start = startOfMonth(now);
        for (let i = 0; i < 30; i++) {
          data.push({
            timestamp: new Date(start.getTime() + i * 24 * 60 * 60 * 1000),
            value: Math.floor(Math.random() * 5000)
          });
        }
        break;
      case 'year':
        start = startOfYear(now);
        for (let i = 0; i < 12; i++) {
          data.push({
            timestamp: new Date(start.getTime() + i * 30 * 24 * 60 * 60 * 1000),
            value: Math.floor(Math.random() * 50000)
          });
        }
        break;
    }
  return data;
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

const HealthDataChart = ({ name }: {name: string }) => {
  const [interval, setInterval] = useState('day');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

//   const {} = api.healthDataLog.

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const mockData = getMockHealthData(interval);
      const processedData = processDataForChart(mockData, interval);
      setData(processedData);
      setLoading(false);
    }, 1000);
  }, [interval]);

  return (
    <StyledCard padding="$4" width="100%">
      <YStack space="$4">
       
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
        {loading ? (
          <View height={250} justifyContent="center" alignItems="center">
            <Text color="#666">Loading...</Text>
          </View>
        ) : data.length > 0 ? (
          <View height={250} paddingTop={20}>
            <BarChart
              data={data.map(item => ({ value: item.value, label: item.formattedLabel }))}
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
              maxValue={Math.max(...data.map((item) => item.value))}
              barBorderRadius={4}
              frontColor={colorScheme.primary.lightGreen}
              gradientColor="#8a7dfd"
              showXAxisLabels
              xAxisLabelWidth={40}
              rotateLabel
            />
          </View>
        ) : (
          <View height={250} justifyContent="center" alignItems="center">
            <Text color="#666">No data available</Text>
          </View>
        )}
      </YStack>
    </StyledCard>
  );
};

export default HealthDataChart;