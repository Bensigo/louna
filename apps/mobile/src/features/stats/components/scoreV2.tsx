import React from 'react';
import { Text, YStack, XStack } from 'tamagui';
import { colorScheme } from '~/constants/colors';
import { interpretStressScore } from '../utils';
import Svg, { Circle, Text as SVGText } from 'react-native-svg';
import { ChevronUp, ChevronDown } from "@tamagui/lucide-icons";

interface StressScore {
  score: number;
  rating: string;
  description: string;
  percentage: number;
}

interface StressDisplayProps {
  score: StressScore | null;
  hideInterperted?: boolean
}

const ScoreDisplay: React.FC<StressDisplayProps> = ({ score, hideInterperted  }) => {
  if (!score) return null;

  const interpretedScore = interpretStressScore(score.score);

  const size = 150;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = (score.percentage / 100) * circumference;

  return (
    <YStack gap="$4" backgroundColor="$red100" padding="$4" borderRadius="$4">
      <XStack alignItems="center" justifyContent="space-between">
        <YStack flex={1} alignItems="center" space="$2">
            <YStack alignItems="center" space="$2">
            <Svg width={size} height={size}>
          <Circle
            stroke="#e0e0e0"
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
          />
          <Circle
            stroke={colorScheme.primary.lightGreen}
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            strokeLinecap="round"
          />
          <SVGText
            x={size / 2}
            y={size / 2}
            fontSize="24"
            fontWeight="bold"
            textAnchor="middle"
            alignmentBaseline="central"
            fill="white"
          >
            {score.percentage.toFixed(1) + '%'}
          </SVGText>
            </Svg>
            
            </YStack>
          
     
          {/* <Text fontSize="$6" fontWeight="bold" color="$color">
            {score.rating}
          </Text> */}
          {!hideInterperted ? <Text fontSize="$3" color="$color" textAlign="center">
            Your score is {interpretedScore.rawScore.toFixed(2)}. You are currently{' '}
            <Text
              fontSize="$3"
              color={interpretedScore.percentageChange > 0 ? "$green" : "$red"}
            >
              {interpretedScore.percentageChange > 0 ? 'higher' : 'lower'}
            </Text>{' '}
            by{' '}
            <Text
              fontSize="$3"
              color={interpretedScore.percentageChange > 0 ? "$green" : "$red"}
            >
              {Math.abs(interpretedScore.percentageChange).toFixed(1)}%
            </Text>{' '}
            than your baseline. {score.description}
          </Text> :  <Text>{score.description}</Text>}
         
        </YStack>
      </XStack>
    </YStack>
  );
};

export default ScoreDisplay;