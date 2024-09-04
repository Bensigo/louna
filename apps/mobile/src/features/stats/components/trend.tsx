import React from 'react';
import { Card, Text, XStack, YStack, Progress, Separator } from 'tamagui';
import { ArrowUpRight, ArrowDownRight, ArrowRight, Info } from '@tamagui/lucide-icons';

interface TrendData {
  trend: string;
  scores: { timestamp: Date; rawScore: number }[];
  overallChange?: number;
  average?: number;
  min?: number;
  max?: number;
}

const TrendDisplay: React.FC<{ data: TrendData }> = ({ data }) => {
  if (data && data?.scores.length < 1)return <></>
  const getTrendIcon = () => {
    if (data.overallChange === undefined) return null;
    if (data.overallChange > 0) return <ArrowUpRight color="$green10" size="$1" />;
    if (data.overallChange < 0) return <ArrowDownRight color="$red10" size="$1" />;
    return <ArrowRight color="$yellow10" size="$1" />;
  };

  const getTrendColor = () => {
    if (data.overallChange === undefined) return '$gray10';
    if (data.overallChange > 0) return '$green10';
    if (data.overallChange < 0) return '$red10';
    return '$yellow10';
  };

  const getTrendDescription = () => {
    if (data.trend === 'Improving') return 'Improvement';
    if (data.trend === 'Declining') return 'Decline';
    return 'Stable';
  };


  
  return (
    <Card elevate padding="$4" space="$3">
      <XStack justifyContent="space-between" alignItems="center">
        <Text fontSize="$6" fontWeight="bold">{data.trend}</Text>
        <XStack alignItems="center" space="$2">
          {getTrendIcon()}
          <Text color={getTrendColor()} fontSize="$5">
            {data.overallChange?.toFixed(2)}%
          </Text>
        </XStack>
      </XStack>

      <Text fontSize="$3" color="$gray11">
        {getTrendDescription()} over the last 7 days.
      </Text>

      <Separator marginVertical="$2" />

      <YStack space="$2">
        <Text fontSize="$4">Average Score: {data.average?.toFixed(2)}</Text>
        <Progress value={((data.average ?? 0) - (data.min ?? 0)) / ((data.max ?? 1) - (data.min ?? 0)) * 100}>
          <Progress.Indicator animation="bouncy" />
        </Progress>
        <Text fontSize="$3" color="$gray11">
          Your average score relative to min and max values
        </Text>
      </YStack>

      <XStack justifyContent="space-between" marginTop="$2">
        <Text fontSize="$3" color="$gray10">Min: {data.min?.toFixed(2)}</Text>
        <Text fontSize="$3" color="$gray10">Max: {data.max?.toFixed(2)}</Text>
      </XStack>

      <XStack alignItems="center" space="$2" marginTop="$2">
        <Info size="$1" color="$blue10" />
        <Text fontSize="$1" color="$gray11">
          Based on {data.scores?.length} data points
        </Text>
      </XStack>
    </Card>
  );
};

export default TrendDisplay;