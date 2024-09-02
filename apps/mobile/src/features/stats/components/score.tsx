import React from 'react';
import { Text, YStack } from 'tamagui';
import Svg, { Circle, Text as SVGText } from 'react-native-svg';
import { colorScheme } from '~/constants/colors';

interface ScoreComponentProps {
  score: number;
  title: string;
  infoText: string;
}

const Score: React.FC<ScoreComponentProps> = ({ score, title, infoText }) => {
  const size = 150;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = (score / 100) * circumference;

  return (
    <YStack space="$4" padding="$4" width="100%">
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
            fontSize="35"
            fontWeight="bold"
            textAnchor="middle"
            alignmentBaseline="central"
            fill="white"
          >
            {score + '%'}
          </SVGText>
        </Svg>
        <Text fontSize="$6" fontWeight="bold">{title}</Text>
        <Text fontSize={11} >{infoText}</Text>
      </YStack>    
      
    </YStack>
  );
};

export default Score;