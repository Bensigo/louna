import React from 'react';
import { View } from 'tamagui';
import HomeWrapper from '~/features/home/wrapper';

const HomeScreen = () => {
  return (
    <View flex={1} px={'$3'}>
       <HomeWrapper />
    </View>
  );
};

export default HomeScreen;
