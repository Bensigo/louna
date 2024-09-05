

import React from 'react';
import { Stack } from 'expo-router';
import { View } from 'tamagui';
import { HeaderBackButton } from '~/components/header';

const RootLayout = () => {
  return (
    <View flex={1}>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: '',
            headerTransparent: true,
            presentation: "formSheet",
            // headerLeft: () => <HeaderBackButton />,
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            title: 'Challenge Settings',
            headerTransparent: true,
            presentation: "formSheet",
            headerLeft: () => <HeaderBackButton />,
          }}
        />
      </Stack>
    </View>
  );
};

export default RootLayout;
