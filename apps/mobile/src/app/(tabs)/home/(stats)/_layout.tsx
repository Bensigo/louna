import type {
  MaterialTopTabNavigationEventMap,
  MaterialTopTabNavigationOptions,
} from "@react-navigation/material-top-tabs/lib/typescript/src/types";
import type {
  ParamListBase,
  TabNavigationState,
} from "@react-navigation/native";
import { ActivityIndicator } from "react-native";
import { withLayoutContext } from "expo-router";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { View } from "tamagui";

import { colorScheme } from "~/constants/colors";

const { Navigator } = createMaterialTopTabNavigator();

const TopTab = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

const RootLayout = () => {
  return (
    <View flex={1}>
      <TopTab
        screenOptions={{
          tabBarActiveTintColor: colorScheme.secondary.gray,
          tabBarInactiveTintColor: colorScheme.secondary.darkGray,
          tabBarStyle: {
            backgroundColor: "transparent",
          },
        
          tabBarIndicatorStyle: {
            backgroundColor: colorScheme.primary.lightGreen,
          },
          lazy: true,
          lazyPlaceholder() {
            return (
              <View justifyContent="center">
                <ActivityIndicator size={"small"} />
              </View>
            );
          },
          tabBarLabelStyle: {
            fontSize: 11,
          },
        }}
      >
         <TopTab.Screen
          name="physical"
          options={{
            title: "Wellbeing",
            // tabBarIcon: ({ color }) => (
            //   <Footprints size={20} color={color} />
            // ),
          }}
        ></TopTab.Screen>
        <TopTab.Screen
          name="stress"
          options={{
            title: "Stress",
            // tabBarIcon: ({ color }) => (
            //   <Frown size={20} color={color} />
            // ),
          }}
        ></TopTab.Screen>
        <TopTab.Screen
          name="recovery"
          options={{
            title: "Recovery",
            // tabBarIcon: ({ color }) => (
            //   <BatteryFull size={20} color={color} />
            // ),
          }}
        ></TopTab.Screen>
       
      </TopTab>
    </View>
  );
};
export default RootLayout;
