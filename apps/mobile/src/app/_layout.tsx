import { useColorScheme } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { config } from "@tamagui/config/v3";
import { createTamagui, TamaguiProvider, Theme } from "@tamagui/core";
import { PortalProvider } from "@tamagui/portal";
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from "expo-task-manager";
import { Alert } from 'react-native';

import { UserProvider } from "../provider/user";
import { appApi, TRPCProvider } from "../utils/api";
import { supabase } from "../utils/supabase";
import { useEffect } from "react";
import React from "react";
import { BACKGROUND_HEALTH_DATA_FETCH_TASK, registerBackgroundFetchAsync, unregisterBackgroundFetchAsync } from "~/utils/backgroundFetch";
import { getData } from "~/utils/healthkit";




const tamaguiConfig = createTamagui(config);

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isRegistered, setIsRegistered] = React.useState(false);
  const [status, setStatus] = React.useState<BackgroundFetch.BackgroundFetchStatus | null>(null);

  const checkStatusAsync = async () => {
    const status = await BackgroundFetch.getStatusAsync();
    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_HEALTH_DATA_FETCH_TASK);
    setStatus(status);
    setIsRegistered(isRegistered);
    
  };

  useEffect(() => {
    const setupBackgroundFetch = async () => {
      try {
        await registerBackgroundFetchAsync();
        await checkStatusAsync();
      } catch (error) {
        console.error('Failed to register background fetch:', error);
        // Alert.alert('Error', 'Failed to set up background fetch. Please check your permissions.');
      }
    };
   
    void setupBackgroundFetch();

    return () => {
      unregisterBackgroundFetchAsync().catch(error => 
        console.error('Failed to unregister background fetch:', error)
      );
    };
  }, []);


  

  


  return (
    <TamaguiProvider config={tamaguiConfig}>
      <SessionContextProvider supabaseClient={supabase}>
        <TRPCProvider>
          <PortalProvider>
            <Theme name={colorScheme}>
              <ThemeProvider
                value={{
                  ...DefaultTheme,
                  colors: {
                    ...DefaultTheme.colors,
                    background: colorScheme === 'dark' ? '#000' : '#fff',
                    text: colorScheme === 'dark' ? '#fff' : '#000',
                    primary: colorScheme === 'dark' ? '#4B5563' : '#4CAF50',
                  }
                }}
              >
                <StatusBar />
                <UserProvider>
           
                  <Stack>
                    <Stack.Screen
                      name="index"
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="(auth)"
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="(tabs)"
                      options={{ headerShown: false }}
                    />
                    <Stack.Screen
                      name="(onboarding)"
                      options={{ headerShown: false }}
                    />
                  </Stack>
                 
                </UserProvider>
              </ThemeProvider>
            </Theme>
          </PortalProvider>
        </TRPCProvider>
      </SessionContextProvider>
    </TamaguiProvider>
  );
}
