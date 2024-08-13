
import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { YStack } from 'tamagui';
import { GetChallenge } from '~/features/challenge/getChallenge';

const ChallengeDetailsScreen = () => {
  const { id } = useLocalSearchParams();

  return (
    <YStack flex={1} justifyContent="center" alignItems="center">
       <GetChallenge id={id as string} />
    </YStack>
  );
};

export default ChallengeDetailsScreen;
