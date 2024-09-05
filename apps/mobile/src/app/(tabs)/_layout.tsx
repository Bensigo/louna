import {  StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, Tabs } from "expo-router";
import { Activity, Home, GanttChartSquare, User, Moon, MessageCircle } from "@tamagui/lucide-icons";

import { CustomTabBar } from "~/components/customTabBar";
import {  colorScheme } from "~/constants/colors";
import { useAppUser } from "~/provider/user";



import { useEffect, useState } from "react";
import { getData } from "~/utils/healthkit";
import { appApi } from "~/utils/api";

export default function TabLayout() {
  const user = useAppUser()

  useEffect(() => {
    if (user && !user.hasPref) {
      router.push('/(onboarding)/')
    }
    
    const fetchHealthData = async () => {
      const healthData = await getData();
      if (healthData) {
        await appApi.log.syncHealthData.mutate(healthData);
      }
    };

    void fetchHealthData();

    // No cleanup function needed, so we can omit the return statement
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
