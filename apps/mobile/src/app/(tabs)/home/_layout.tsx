import React, { useState } from "react";
import { ActivityIndicator } from "react-native";
import { Stack } from "expo-router";
import { Avatar, H1, Text, View } from "tamagui";

import { Colors, colorScheme } from "~/constants/colors";
import { HealthKitProvider } from "~/integration/healthKit";
import { useAppUser } from "~/provider/user";

const RootLayout = () => {
  const user = useAppUser();
  const [avatarLoaded, setAvatarLoading] = useState(true);
  return (
    <HealthKitProvider>
       <View paddingHorizontal={10}>
     <H1 fontSize={30} fontWeight={'bold'} color={colorScheme.text.primary}>Summary</H1>
     </View>
       {/* <View padding="$4" alignSelf="flex-start">
        <View flexDirection="row" alignItems="center" py={"$3"}>
          {avatarLoaded ? (
            <Avatar
              circular
              size="$4"
              borderWidth={2}
              borderColor={colorScheme.primary.lightGreen}
            >
              <Avatar.Image
                source={{
                  uri:
                    user?.image ??
                    `https://fastly.picsum.photos/id/1063/400/300.jpg`,
                }}
                onLoadStart={() => setAvatarLoading(true)}
                onLoad={() => setAvatarLoading(false)}
                onError={() => setAvatarLoading(false)}
              />
            </Avatar>
          ) : (
            <View justifyContent="center" alignItems="center">
              <ActivityIndicator size={"small"} />
            </View>
          )}
          <View marginLeft="$3">
            <Text
              style={{
                fontSize: 13,
                fontWeight: "bold",
                color: colorScheme.secondary.darkGray,
              }}
            >
              {user?.name}!
            </Text>
            
          </View>
        </View>
      </View> */}
      <View  flex={1}  px={'$2'}>
        <Stack>
          <Stack.Screen name="(stats)" options={{ headerShown: false }} />
          <Stack.Screen
            name="[name]"
            options={{ headerShown: false, presentation: "formSheet" }}
          />
        </Stack>
      </View>
    </HealthKitProvider>
  );
};

export default RootLayout;
