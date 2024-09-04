import {  StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, Tabs } from "expo-router";
import { Activity, Home, GanttChartSquare, User, Moon, MessageCircle } from "@tamagui/lucide-icons";

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
        {/* <Tabs.Screen
          name="home"
          options={{
            tabBarLabel: "Home",
            tabBarIcon: ({ color }) => <Home color={color} />,
          }}
        /> */}
        <Tabs.Screen
          name="home"
          options={{
            tabBarLabel: "Home",
            tabBarIcon: ({ color }) => <Activity color={color} />
          }}
        />
        <Tabs.Screen
          name="sleep"
          options={{
            tabBarLabel: "Sleep",
            tabBarIcon: ({ color }) => <Moon color={color} />,
          }}
        />
         <Tabs.Screen
          name="coach"
          options={{
            tabBarLabel: "louna",
            tabBarIcon: ({ color }) => <MessageCircle color={color} />,
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
