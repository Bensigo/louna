import React, { useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import {  View } from 'react-native';
import type {  HealthDataType } from '~/integration/healthKit';
import ChartWrapper from '~/features/stats/chartWrapper';


const ChartScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { type } = route.params as { type: HealthDataType };

  useEffect(() => {
    navigation.setOptions({
      title: `${type} Chart`,
    });
  }, [type, navigation]);

  return (
    <View flex={1} padding={10}>
      <ChartWrapper healthDataType={type} />
    </View>
  );
};

export default ChartScreen;
