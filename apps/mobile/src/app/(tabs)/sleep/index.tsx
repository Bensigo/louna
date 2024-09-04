import React from 'react';
import { SafeAreaView } from 'react-native';
import { View, Text } from 'tamagui';

const SleepScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1 }} >
      <View flex={1} px={'$3'} justifyContent="center" alignItems="center">
        <Text fontSize="$6" fontWeight="bold">
          Sleep Screen
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default SleepScreen;
