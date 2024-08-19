import { withLayoutContext } from "expo-router";

import type { TabNavigationState, ParamListBase } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import type {  MaterialTopTabNavigationEventMap, MaterialTopTabNavigationOptions } from "@react-navigation/material-top-tabs/lib/typescript/src/types";
import { Colors, colorScheme } from "~/constants/colors";
import {  View } from "tamagui";
import { ActivityIndicator } from "react-native";


const { Navigator } = createMaterialTopTabNavigator();

const TopTab = withLayoutContext<MaterialTopTabNavigationOptions, typeof Navigator,TabNavigationState<ParamListBase>, MaterialTopTabNavigationEventMap >(Navigator)

const RootLayout = () => {
    return (
      <View flex={1}>
       
        <TopTab  screenOptions={{
          tabBarActiveTintColor: colorScheme.secondary.gray,
          
          tabBarStyle: {
            backgroundColor: 'transparent'
          },
          tabBarIndicatorStyle: {
            backgroundColor: colorScheme.primary.lightGreen
          },
          lazy: true,
          lazyPlaceholder() {
            return <View justifyContent="center">
              <ActivityIndicator size={'small'} />
            </View>
          },
      }} >
        <TopTab.Screen name="suggested" options={{ title: 'Suggested'}}></TopTab.Screen>
        <TopTab.Screen name="upcoming" options={{ title: 'Upcoming'}}></TopTab.Screen>
        <TopTab.Screen name="joined" options={{ title: 'Reserved'}}></TopTab.Screen>
      </TopTab>
      </View>
    );
  };
export default RootLayout;