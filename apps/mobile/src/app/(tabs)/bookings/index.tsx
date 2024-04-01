import React, { useRef, useState } from "react"
import {
    FlatList,
    RefreshControl,
    SectionList,
    TouchableOpacity,
    useWindowDimensions,
} from "react-native"
import { useNavigation, useRouter } from "expo-router"
import Ionicons from "@expo/vector-icons/Ionicons"
import { H3, ScrollView, Text, View } from "tamagui"

import { api } from "../../../utils/api"
import { Activity, LoadingActivityCard } from "./list"

const categories = [
    "stress relief",
    "fat loss",
    "muscle gain",
    "group activities",
    "therapy",
    "mobility improvement",
    "endurance improvement",
]

const CategoryPill = ({ category, onPress }) => {
    const { width: DEVICE_WIDTH } = useWindowDimensions()
    const pillWidth = DEVICE_WIDTH / 2.2

    return (
        <TouchableOpacity onPress={onPress} style={{  marginRight: 12, marginBottom: 10 }}>
            <View
                flexDirection="row"
                alignContent="center"
                alignItems="center"
                justifyContent="center"
                backgroundColor="$gray6"
                borderRadius={5}
                height={70}
                width={pillWidth}
                paddingRight={5}
                py={"$3"}
                px={"$2"}
                flexWrap="wrap"
            >
                <Text wordWrap="break-word">{category?.toUpperCase()}</Text>
            </View>
        </TouchableOpacity>
    )
}

const Bookings = () => {
   
    const { width: DEVICE_WIDTH } = useWindowDimensions()
 
    
    const router = useRouter()

    const goToUpcoming = () => {
        router.push("/bookings/upcoming")
    }

    const handleCategoryPress = (category: string) => {
        router.push( {
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


    return (
        <View flex={1} mt="$4" width={DEVICE_WIDTH} px={"$3"}>
            <View alignItems="flex-end" alignContent="flex-end">
                <TouchableOpacity onPress={goToUpcoming}>
                    <Ionicons name="calendar-outline" size={20} />
                </TouchableOpacity>
                <Text>Upcoming</Text>
            </View>
            <View>
                <H3 my="$1">made For you</H3>
                <FlatList
                    data={[]}
                    horizontal
                    ListEmptyComponent={() => true ? <LoadingActivityCard />  :<Text>sessions not found</Text>}
                    renderItem={({ item }) => <Activity  session={item}/>}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.id}
                    refreshControl={
                        <RefreshControl
                            onRefresh={handleRefreshData}
                            refreshing={false}
                        />
                    }
                />
            </View>
            <View my={"$3"}>
                <H3 my="$1">Categories</H3>
                <FlatList
                    data={categories}
                    numColumns={2}
                    
                    renderItem={({ item }) => (
                        <CategoryPill
                            category={item}
                            onPress={() => handleCategoryPress(item)}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item) => item}
                />
            </View>
        </View>
    )
}

export default Bookings
