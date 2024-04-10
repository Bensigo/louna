import React, { useRef, useState } from "react"
import {
    FlatList,
    RefreshControl,
    TouchableHighlight,
    TouchableOpacity,
    useWindowDimensions,
} from "react-native"
import { isLoading } from "expo-font"
import { useRouter } from "expo-router"
import Ionicons from "@expo/vector-icons/Ionicons"
import { Avatar, H2, H3, Image, ScrollView, Text, View, XStack, YStack } from "tamagui"
import { Video, ResizeMode } from 'expo-av';
import { api } from "../../../utils/api"
import { Activity, } from "./list"

const categories = [
    "stress relief",
    "fat loss",
    "muscle gain",
    "Cardiovasular",
    "therapy",
    "mobility",
    "endurance",
]

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
                borderRadius={5}
                height={70}
                width={pillWidth}
                marginRight={10}
                marginBottom={10}
                paddingRight={10}
                paddingLeft={15}
            >
                <Image
                    source={require("../../../../assets/yoga-woman.jpg")}
                    alt="image"
                    style={{ height: 40, width: 40, borderRadius: 20 }}
                />
                <Text
                    style={{
                        fontSize: 11,
                        fontWeight: "bold",
                        wordBreak: "break-all",
                    }}
                >
                    {category?.toUpperCase()}
                </Text>
            </View>
        </TouchableOpacity>
    )
}

const BookingScreen = () => {
    const videoRef = useRef(null)
    const { width: DEVICE_WIDTH, height: DEVICE_HEIGHT } = useWindowDimensions()
    const videoSource = require('../../../../assets/pilates-vid.mp4') // todo: change to proper video

    const { data: userData, isLoading: isLoadingUserData } =
        api.auth.getProfile.useQuery()

    const router = useRouter()

    const goToUpcoming = () => {
        router.push("/bookings/upcoming")
    }

    const handleCategoryPress = (category: string) => {
        router.push({
            pathname: "/bookings/list",
            params: {
                category,
            },
        })
    }

    const handleRefreshData = () => {}

    const renderItem = () => {
        return <Activity />
    }

    const goToProfile = () => {
        router.push("/profile")
    }

    return (
        <ScrollView flex={1}  mt="$4" width={DEVICE_WIDTH} px={"$4"} showsVerticalScrollIndicator={false}>
            <XStack justifyContent="space-between" alignItems="center">
                <YStack gap="$2">
                    <H2 fontSize={"$9"} fontWeight={"$15"}>
                        Bookings
                    </H2>
                </YStack>
                <XStack gap={"$3"} alignItems="center">
                    <TouchableOpacity onPress={goToUpcoming}>
                        <Ionicons name="calendar-outline" size={25} />
                    </TouchableOpacity>
                    <TouchableHighlight onPress={goToProfile}>
                        <Avatar circular size="$3">
                            {!isLoadingUserData && userData && (
                                <Avatar.Image src={userData?.imageUrl} />
                            )}
                            <Avatar.Fallback bc="$blue3" />
                        </Avatar>
                    </TouchableHighlight>
                </XStack>
            </XStack>

            <View mt={'$3'} height={DEVICE_HEIGHT / 2.8} borderRadius={10}>
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
                <H3 fontSize={'$7'} my="$1">Categories</H3>
                <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
              
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
