
import React from 'react';
import { SafeAreaView } from 'react-native';
import RecommendationBoard from '~/features/coach/recommendationBoard';

const CoachScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
        <RecommendationBoard />
    </SafeAreaView>
  );
};

export default CoachScreen;
