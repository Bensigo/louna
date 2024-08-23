import React from "react";
import { ActivityIndicator } from "react-native";
import { Avatar, ScrollView, Text, View } from "tamagui";

import { colorScheme } from "~/constants/colors";
import StressWrapper from "~/features/analysis/stress";
import { useAppUser } from "~/provider/user";

const StressScreen = () => {
  const user = useAppUser();
  const [avatarLoaded, setAvatarLoading] = React.useState(true);
  return (
    <ScrollView flex={1} p={0} >
      <View
        padding="$4"
        margin="$2"
        backgroundColor={colorScheme.background.white}
      >
        <View flexDirection="row" alignItems="center" py={"$3"}>
          {avatarLoaded ? (
            <Avatar
              circular
              size="$6"
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
                fontSize: 20,
                fontWeight: "bold",
                color: colorScheme.secondary.darkGray,
              }}
            >
              Welcome back,{user?.name}!
            </Text>
            <Text style={{ color: colorScheme.secondary.gray }}>
              Let's check your health stats
            </Text>
          </View>
        </View>
      </View>
      <StressWrapper />
    </ScrollView>
  );
};

export default StressScreen;
