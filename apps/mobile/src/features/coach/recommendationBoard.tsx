import React from 'react';
import { SafeAreaView } from 'react-native';
import { YStack, Text } from 'tamagui';
import { api } from '~/utils/api';

const RecommendationBoard = () => {

    const { data, isLoading } = api.coach.newChallengeSuggestions.useQuery({})
    console.log({ suggestions : data , isLoading })
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Text fontSize={24} fontWeight="bold">
          Recommendation Board
        </Text>
      </YStack>
    </SafeAreaView>
  );
};

export default RecommendationBoard;
