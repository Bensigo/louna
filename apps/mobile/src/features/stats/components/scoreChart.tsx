import React from 'react';
import { View } from 'react-native';
import { BarChart } from 'react-native-gifted-charts';
import { Text } from 'tamagui';
import { format, startOfDay, startOfWeek, startOfMonth, startOfYear } from 'date-fns';

type DataPoint = {
  timestamp: Date;
  score: number;
  rawScore: number;
};

type Interval = 'D' | 'W' | 'M' | 'Y';

interface PercentageChartProps {
  data: DataPoint[];
  interval: Interval;
  title: string;
}

const processData = (data: DataPoint[], interval: Interval) => {
  const groupedData = data.reduce((acc, item) => {
    let key: string;
    const date = new Date(item.timestamp);
    
    switch (interval) {
      case 'D':
        key = format(date, 'HH:mm');
        break;
      case 'W':
        key = format(startOfWeek(date), 'yyyy-MM-dd');
        break;
      case 'M':
        key = format(startOfMonth(date), 'yyyy-MM-dd');
        break;
      case 'Y':
        key = format(startOfYear(date), 'yyyy');
        break;
    }

    if (!acc[key]) {
      acc[key] = { total: 0, count: 0, date };
    }
    acc[key].total += item.score;
    acc[key].count += 1;
    return acc;
  }, {} as Record<string, { total: number; count: number; date: Date }>);

  return Object.entries(groupedData).map(([key, value]) => {
    const averageScore = value.total / value.count;
    let label: string;
    
    switch (interval) {
      case 'D':
        label = key;
        break;
      case 'W':
        label = format(value.date, 'EEE');
        break;
      case 'M':
        label = format(value.date, 'd');
        break;
      case 'Y':
        label = format(value.date, 'MMM');
        break;
    }

    return {
      value: averageScore,
      label,
      frontColor: '#1e88e5',
      topLabelComponent: () => (
        <Text fontSize="$3" color="$gray11">{`${averageScore.toFixed(0)}%`}</Text>
      ),
    };
  });
};

const PercentageChart: React.FC<PercentageChartProps> = ({ data, interval, title }) => {
  if(data.length < 1 )return null
  const chartData = processData(data, interval);

  return (
    <View>
      <Text fontSize="$6" fontWeight="bold" marginBottom="$2">{title}</Text>
      <BarChart
        data={chartData}
        width={300}
        height={200}
        barWidth={interval === 'Y' ? 20 : 30}
        noOfSections={4}
        yAxisLabelSuffix="%"
        xAxisLabelTextStyle={{ color: '#94A3B8', fontSize: 12 }}
        yAxisTextStyle={{ color: '#94A3B8', fontSize: 12 }}
        hideRules
        showYAxisIndices
      />
    </View>
  );
};

export default PercentageChart;
