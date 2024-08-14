import React, { useRef, useState } from "react";
import {
  Animated,
  FlatList,
  ImageBackground,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Button, H4, Text, View, YStack } from "tamagui";

import { Colors, colorScheme } from "../../constants/colors";
import { Paginator } from "./paginator";

interface OnboardingData {
  id: string;
  title: string;
  body: string;
  image: any; // Adjust type as needed
}

const data: OnboardingData[] = [
  {
    id: "1",
    title: "Understand Your Body",
    body: "Gain insights into your body's functions to improve your overall well-being.",
    image: require("../../../assets/onboarding/track.png"),
  },
  {
    id: "2",
    title: "Create a Health Party",
    body: "Invite friends or family to join your health party, making it fun to track everyone's progress.",
    image: require("../../../assets/onboarding/party.png"),
  },
  {
    id: "3",
    title: "Join Challenges",
    body: "Participate in fun challenges with your party and earn medals together.",
    image: require("../../../assets/onboarding/track.png"),
  },
];

const RenderItem: React.FC<OnboardingData> = (props) => {
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();

  return (
    <View
      flex={1}
      style={{
        width: SCREEN_WIDTH,
      }}
    >
      <YStack flex={1}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ImageBackground
            source={props.image}
            style={{
              height: SCREEN_HEIGHT,
              width: SCREEN_WIDTH,
              justifyContent: "center",
              alignItems: "center",

              overflow: "hidden",
            }}
            resizeMode="cover"
          />
        </View>
        <LinearGradient
          colors={[colorScheme.primary.lightGreen, "transparent"]}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: SCREEN_HEIGHT * 0.35,
          }}
        />

        <View paddingHorizontal="$4" paddingTop={4} alignItems="center">
          <H4 color="white" fontWeight={"$7"} fontSize={24}>
            {props.title}
          </H4>
          <Text
            color="white"
            textAlign="center"
            fontWeight={"$4"}
            fontSize={16}
            paddingHorizontal="$4"
          >
            {props.body}
          </Text>
        </View>
      </YStack>
    </View>
  );
};

function Onboarding() {
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
  const scrollX = useRef(new Animated.Value(0)).current;
  const [_, setCurrentIndex] = useState<number | null | undefined>(0);
  const router = useRouter();

  const slideRef = useRef(null);

  const viewableItemChanged = useRef(({ viewableItems }: any) => {
    setCurrentIndex(viewableItems[0]?.index);
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const handlePress = () => {
    router.replace("/register");
  };

  return (
    <View flex={1} backgroundColor={colorScheme.primary.lightGreen}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        renderItem={({ item }) => <RenderItem {...item} />}
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  x: scrollX,
                },
              },
            },
          ],
          { useNativeDriver: false },
        )}
        onViewableItemsChanged={viewableItemChanged}
        viewabilityConfig={viewConfig}
        scrollEventThrottle={32}
        ref={slideRef}
      />
  
      <LinearGradient
        colors={["transparent", colorScheme.primary.lightGreen]}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: SCREEN_HEIGHT * 0.55,
        }}
      />
      <YStack paddingVertical="$5" paddingHorizontal={"$4"}>
        <Button
          backgroundColor={colorScheme.primary.green}
          fontWeight={"$14"}
          height={"$5"}
          onPress={handlePress}
          fontSize={"$6"}
          color={"white"}
          borderRadius={25} // Added rounded corners
          pressStyle={{
            backgroundColor: colorScheme.primary.lightGreen,
          }}
        >
          Get Started
        </Button>
      </YStack>

      <Paginator data={data} scrollX={scrollX} />
    </View>
  );
}

export { Onboarding };
