

import { Plus } from "@tamagui/lucide-icons";
import { router, Stack } from "expo-router";
import {  Button, H1, View } from "tamagui";

import { HeaderBackButton } from "~/components/header";
import { colorScheme } from "~/constants/colors";




const RootLayout = () => {
  const gotoCreate =() => router.push('/challenges/create')
  return (
    <View flex={1}>
     <View paddingHorizontal={10}>
     <H1 fontSize={30} fontWeight={'bold'} color={colorScheme.text.primary}>Sleep</H1>
     </View>
      <Stack >
      
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
            headerLeft: () => <HeaderBackButton />,
          }}
        ></Stack.Screen>
      </Stack>
    </View>

  );
};

export default RootLayout;
