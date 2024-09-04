import React from 'react';
import { SafeAreaView } from 'react-native';
import CoachWrapper from '~/features/coach/coachWrapper';

const CoachScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1 }} >
      <CoachWrapper />
    </SafeAreaView>
  );
};

export default CoachScreen;
