import { Stack } from "expo-router";
import React from "react";
import { ActivityIndicator } from "react-native";
import { Avatar, H1, View, Text } from "tamagui";
import { Colors, colorScheme } from "~/constants/colors";
import { HealthKitProvider } from "~/integration/healthKit";
import { useAppUser } from "~/provider/user";

const RootLayout = () => {

  return (
    <HealthKitProvider>
   <View paddingHorizontal={10} flex={1} backgroundColor={"#F0FFF0"}>
  
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: false }}
      />
       <Stack.Screen
        name="[name]"
        options={{ headerShown: false, presentation: "formSheet" }}
      />
    </Stack>
   </View>
   </HealthKitProvider>
  )
};

export default RootLayout;