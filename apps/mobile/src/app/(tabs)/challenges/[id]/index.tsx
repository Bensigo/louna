
import React from 'react';
import { useLocalSearchParams } from 'expo-router';
import { YStack } from 'tamagui';
import { GetChallenge } from '~/features/challenge/getChallenge';

const ChallengeDetailsScreen = () => {
  const { id } = useLocalSearchParams();

  return (
    
       <GetChallenge id={id as string} />
 
  );
};

export default ChallengeDetailsScreen;
