import React, { useRef, useState } from "react"
import { TouchableOpacity, useWindowDimensions } from "react-native"
import { ResizeMode, Video } from "expo-av"
import { useRouter } from "expo-router"
import {
    H3,
    Image,
    ScrollView,
    SizableText,
    Tabs,
    Text,
    View,
    YStack,
    AnimatePresence,
    styled,
} from "tamagui"

import { Colors } from "../../../constants/colors"
import { api } from "../../../utils/api"
import { Activity } from "./list"
import Upcoming from "./upcoming"

const categories: string[] = [
    "Strength",
    "Endurance",
    "Running",
    "HIIT",
    "Cycling",
    "Boxing",
    "Therapy",
    "Prenatal",
    "Post natal",
    "Mindfulness",
    "Pilates",
    "Yoga",
    "Dance"
  ];

const CategoryPill = ({ category, onPress }) => {
    const { width: DEVICE_WIDTH } = useWindowDimensions()
    const pillWidth = DEVICE_WIDTH / 2.4

    return (
        <TouchableOpacity onPress={onPress}>
            <View
                flexDirection="row"
                alignItems="center"
                gap={"$2"}
                backgroundColor="white"
                borderRadius={10}
                height={50}
                width={pillWidth}
                marginRight={10}
                marginBottom={10}
                paddingRight={10}
                paddingLeft={15}
            >
                <Image
                    source={require("../../../../assets/yoga-woman.jpg")}
                    alt="image"
                    style={{ height: 30, width: 30, borderRadius: 15 }}
                />
                <Text
                    style={{
                        fontSize: 13,
                        fontWeight: "bolder",
                    }}
                >
                    {category?.toUpperCase()}
                </Text>
            </View>
        </TouchableOpacity>
    )
}



const BookingScreen = () => {
    const [tabState, setTabState] = useState({
        currentTab: 'upcoming',
        intentAt: null,
        activeAt: null,
        prevActiveAt: null,
      });
    
      const setCurrentTab = (currentTab) => setTabState({ ...tabState, currentTab });
      const setIntentIndicator = (intentAt) => setTabState({ ...tabState, intentAt });
      const setActiveIndicator = (activeAt) =>
        setTabState({ ...tabState, prevActiveAt: tabState.activeAt, activeAt });
    
      const { activeAt, intentAt, prevActiveAt, currentTab } = tabState;
      const direction = (() => {
        if (!activeAt || !prevActiveAt || activeAt.x === prevActiveAt.x) {
          return 0;
        }
        return activeAt.x > prevActiveAt.x ? -1 : 1;
      })();
    
      const handleOnInteraction = (type, layout) => {
        if (type === 'select') {
          setActiveIndicator(layout);
        } else {
          setIntentIndicator(layout);
        }
      };
    return (
        <View flex={1} mt="$4">
             <Tabs
      value={currentTab}
      onValueChange={setCurrentTab}
      orientation="horizontal"
      size="$4"
      flexDirection="column"
      activationMode="manual"
      flex={1}
    
    >
      <YStack>
        <AnimatePresence>
          {intentAt && (
            <TabsRovingIndicator
              width={intentAt.width}
              height="$0.5"
              x={intentAt.x}
              bottom={0}
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {activeAt && (
            <TabsRovingIndicator
              theme="active"
              active
              width={activeAt.width}
              height="$0.5"
              x={activeAt.x}
              bottom={0}
            />
          )}
        </AnimatePresence>
        <Tabs.List
          disablePassBorderRadius
          loop={false}
          borderBottomLeftRadius={0}
          borderBottomRightRadius={0}
          paddingBottom="$1.5"
          borderColor="$color3"
          borderBottomWidth="$0.5"
          backgroundColor="transparent"
        >
          <Tabs.Tab
            unstyled
            paddingHorizontal="$3"
            paddingVertical="$2"
            value="upcoming"
            onInteraction={handleOnInteraction}
          >
            <SizableText fontSize={'$5'} color={Colors.light.primary}>Upcoming</SizableText>
          </Tabs.Tab>
          <Tabs.Tab
            unstyled
            paddingHorizontal="$3"
            paddingVertical="$2"
            value="bookings"
            onInteraction={handleOnInteraction}
          >
            <SizableText fontSize={'$5'} color={Colors.light.primary}>Bookings</SizableText>
          </Tabs.Tab>
       
        </Tabs.List>
      </YStack>
      <AnimatePresence exitBeforeEnter custom={{ direction }} initial={false}>
        <AnimatedYStack key={currentTab} flex={1}>
          <Tabs.Content  value={currentTab} forceMount flex={1} pb={'$3'} justifyContent="center">
            {currentTab === 'upcoming' && <Upcoming />}
            {currentTab === 'bookings' && <BookingTab />}
          </Tabs.Content>
        </AnimatedYStack>
      </AnimatePresence>
    </Tabs>
        </View>
    )
}

const TabsRovingIndicator = ({ active, ...props }) => {
    return (
      <YStack
        position="absolute"
        backgroundColor={Colors.light.primary}
        opacity={0.7}
        animation="quick"
        enterStyle={{
          opacity: 0,
        }}
        exitStyle={{
          opacity: 0,
        }}
        {...(active && {
          backgroundColor: Colors.light.primary,
          opacity: 0.6,
        })}
        {...props}
      />
    );
};
  
const AnimatedYStack = styled(YStack, {
    f: 1,
    x: 0,
    o: 1,
    animation: 'quick',
    variants: {
      direction: {
        ':number': (direction) => ({
          enterStyle: {
            x: direction > 0 ? -25 : 25,
            opacity: 0,
          },
          exitStyle: {
            zIndex: 0,
            x: direction < 0 ? -25 : 25,
            opacity: 0,
          },
        }),
      },
    },
  });

const BookingTab = () => {
    const videoRef = useRef(null)
    const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = useWindowDimensions()
    const videoSource = require("../../../../assets/pilates-vid.mp4") // todo: change to proper video

    const { data: userData, isLoading: isLoadingUserData } =
        api.auth.getProfile.useQuery()

    const router = useRouter()
    const renderItem = () => {
        return <Activity />
    }
    const handleCategoryPress = (category: string) => {
        router.push({
            pathname: "/bookings/list",
            params: {
                category,
            },
        })
    }
    return (
        <ScrollView
            flex={1}
            mt="$4"
            width={DEVICE_WIDTH}
            px={"$4"}
            showsVerticalScrollIndicator={false}
        >
            <View mt={"$3"} height={DEVICE_HEIGHT / 3.4} borderRadius={10}>
                <Video
                    ref={videoRef}
                    source={videoSource}
                    style={{ flex: 1, borderRadius: 10 }}
                    resizeMode={ResizeMode.COVER}
                    isLooping
                    isMuted
                    shouldPlay
                />
            </View>
            <View my={"$3"}>
                <H3 fontSize={"$7"} my="$1">
                    Categories
                </H3>
                <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                    {categories.map((item, index) => (
                        <CategoryPill
                            key={index}
                            category={item}
                            onPress={() => handleCategoryPress(item)}
                        />
                    ))}
                </View>
            </View>
        </ScrollView>
    )
}

export default BookingScreen
