import React from 'react';
import { View, Text } from 'tamagui';

const HomeScreen = () => {
  return (
    <View flex={1} justifyContent="center" alignItems="center">
      <Text fontSize={24} fontWeight="bold" color="black">
        Welcome to the Home Screen
      </Text>
    </View>
  );
};

export default HomeScreen;
