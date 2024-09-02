import React, { } from "react";
import { Stack } from "expo-router";
import {  View } from "tamagui";



const RootLayout = () => {

  return (
      <View  flex={1} >
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen
            name="[chart]"
            options={{ headerShown: false, presentation: "formSheet" }}
          />
        </Stack>
      </View>
   
  );
};

export default RootLayout;
