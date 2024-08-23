import { useColorScheme } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { config } from "@tamagui/config/v3";
import { createTamagui, TamaguiProvider, Theme } from "@tamagui/core";
import { PortalProvider } from "@tamagui/portal";

import { UserProvider } from "../provider/user";
import { TRPCProvider } from "../utils/api";
import { supabase } from "../utils/supabase";

const tamaguiConfig = createTamagui(config);

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <TamaguiProvider config={tamaguiConfig}>
      <SessionContextProvider supabaseClient={supabase}>
        <TRPCProvider>
          <PortalProvider>
            <Theme name={"light"}>
              <ThemeProvider
                value={{
                  ...DefaultTheme,
                  colors: {
                    ...DefaultTheme.colors,
                    background: '#fff',
                   
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
