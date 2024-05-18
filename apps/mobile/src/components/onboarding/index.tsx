/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import React, { useState, useRef } from "react";
import {LinearGradient} from "expo-linear-gradient";
import { FlatList, useWindowDimensions, type ImageSourcePropType, Animated, ImageBackground  } from "react-native";
import { View, YStack, H4, Text, Button } from "tamagui";
import { Paginator } from './paginator'
import { useRouter } from "expo-router";
import { Colors } from "../../constants/colors";
type OnboardingData = {
  id: string;
  title: string;
  body: string;
  image: ImageSourcePropType;
};

const data: OnboardingData[] = [
  {
    id: '1',
    title: 'Group Activites',
    body: 'Get ready for fun activities, shared laughs, and unforgettable moments.',
    image: require('../../../assets/group-yoga.jpg'),
  },
  {
    id: '2',
    title: 'Community',
    body: 'A community where connections are real, openness is embraced, and mutual support is the foundation of our wellness journey together.',
    image: require('../../../assets/community.jpg'),
  },
  {
    id: '3',
    title: 'Tasty Recipes',
    body: 'Explore a variety of flavorful and healthy recipes from around the world. Enjoy delicious meals that align with your goal of eating well.',
    image: require('../../../assets/cooking.jpg'),
  },
];

const RenderItem: React.FC<OnboardingData> = (props) => {
  const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();

  return (
    <View  flex={1} style={{ width: SCREEN_WIDTH}} >
      <YStack >
      <ImageBackground
          source={props.image}
          style={{
            height: SCREEN_HEIGHT * 0.65,
            width: SCREEN_WIDTH,
            position: "relative",
          }}
        ></ImageBackground>
      <LinearGradient
          colors={["transparent", Colors.light.secondray]}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: SCREEN_HEIGHT * 0.65,
          }}
        />
      
        <View paddingHorizontal="$4" paddingTop={4}  alignItems="center"  >
          <H4 color="black" fontWeight={"$7"}>{props.title}</H4>
          <Text color="black" textAlign="center" fontWeight={'$10'} lineHeight={18}>{props.body}</Text>
        </View>
      </YStack>
    </View>
  );
};

function Onboarding() {
    const scrollX = useRef(new Animated.Value(0)).current;
    const [_, setCurrentIndex ] = useState<number | null| undefined>(0)
    const router = useRouter()

    const slideRef = useRef(null)

    const viewableItemChanged = useRef(({viewableItems }: any) => {
        setCurrentIndex(viewableItems[0]?.index)
    }).current;

    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current

    const handlePress = ( ) => {
      router.replace("signup")
    }

  return (
    <View flex={1} bg={Colors.light.secondray}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        pagingEnabled
        bounces={false}
        renderItem={({ item }) => <RenderItem {...item}  />}
        onScroll={Animated.event([{
            nativeEvent: {
                contentOffset: {
                    x: scrollX
                }
            }
        }], { useNativeDriver: false })}
        onViewableItemsChanged={viewableItemChanged}
        viewabilityConfig={viewConfig}
        scrollEventThrottle={32}
        ref={slideRef}
      />
      
      <YStack  paddingVertical="$5" paddingHorizontal={'$4'} >
                <Button
                    backgroundColor={Colors.light.primary}
                    fontWeight={"$14"}
                    height={"$5"}
                    onPress={handlePress}
                    fontSize={"$6"}
                    color={"white"}
                    pressStyle={{
                        backgroundColor: Colors.light.primary,
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
