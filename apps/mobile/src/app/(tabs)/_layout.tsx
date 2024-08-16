import {  StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, Tabs } from "expo-router";
import { Activity, Home, Smile, User } from "@tamagui/lucide-icons";

import { CustomTabBar } from "~/components/customTabBar";
import {  colorScheme } from "~/constants/colors";
import { useAppUser } from "~/provider/user";



import { useEffect, useState } from "react";

export default function TabLayout() {
  const user = useAppUser()

  useEffect(() => {
    if (user){
      if (!user.hasPref){
         router.push('/(onboarding)/')
      }
    }
    return () => {}
  }, [user])

  return (
    <SafeAreaView
      style={{ flex: 1, paddingTop: StatusBar.currentHeight }}
      edges={["top", "left", "right"]}
    >
      <Tabs
        initialRouteName="home"
        screenOptions={{
          headerShown: false,

          tabBarActiveTintColor: colorScheme.primary.lightGreen,
          tabBarItemStyle: {
            backgroundColor: "transparent",
          },
        
          tabBarStyle: {
            backgroundColor: "transparent",
            borderTopWidth: 0
          },
        }}
        sceneContainerStyle={{
          backgroundColor: "transparent",
        }}
        tabBar={(props) => <CustomTabBar {...props} />}
      >
        <Tabs.Screen
          name="home"
          options={{
            tabBarLabel: "Home",
            tabBarIcon: ({ color }) => <Home color={color} />,
          }}
        />
        <Tabs.Screen
          name="challenges"
          options={{
            tabBarLabel: "Challenges",
            tabBarIcon: ({ color }) => <Activity color={color} />,
          }}
        />
        <Tabs.Screen
          name="coach"
          options={{
            tabBarLabel: "Coach",
            tabBarHideOnKeyboard: true,
            tabBarIcon: ({ color }) => <Smile color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarLabel: "Profile",
            tabBarIcon: ({ color }) => <User color={color} />,
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}
