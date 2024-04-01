import React, { useEffect, useRef, useState } from "react"
import {
    FlatList,
    RefreshControl,
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    useWindowDimensions,
} from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import Ionicons from "@expo/vector-icons/Ionicons"
import _ from "lodash"
import { Skeleton } from "moti/skeleton"
import {
    Button,
    H3,
    H6,
    Image,
    Input,
    ScrollView,
    Text,
    View,
    XStack,
    YStack,
} from "tamagui"

import { LeftBackButton } from "../../../_layout"
import CustomImage from "../../../../components/CustomImage"
import DateCalendarTabs from "../../../../components/DateTimeCard"
import { api } from "../../../../utils/api"
import { buildFileUrl } from "../../../../utils/buildUrl"

const MAX_LIMIT = 50

const BookingList = () => {
    const { width: DEVICE_WIDTH } = useWindowDimensions()
    const [page, setPage] = useState(1)
    const onEndReachedCalledDuringMomentum = useRef(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [slectedDate, setSeletedDate] = useState<Date>(new Date())
    const params = useLocalSearchParams()
    const router = useRouter()

    const {
        data: resp,
        isLoading,
        refetch,
        isRefetching,
    } = api.partner.list.useQuery(
        {
            filter: {
                category: params.category as string,
                date: slectedDate,
            },
            ...(searchTerm ? { searchName: searchTerm } : {}),
            limit: MAX_LIMIT,
            page,
        },
        {
            cacheTime: 0,
        },
    )

    console.log({ resp })

    const goToUpcoming = () => {
        router.push("/bookings/upcoming")
    }

    const handleSearchTerm = (term: string) => {
        setSearchTerm(term)
        debouncSearch()
    }

    const debouncSearch = _.debounce(refetch, 300)

    const handleDateSelect = (date: Date) => {
        setSeletedDate(date)
    }

    const handleRefreshData = () => {
        if (!onEndReachedCalledDuringMomentum.current) {
            // load data
            setPage((prev) => prev + 1)
            onEndReachedCalledDuringMomentum.current = true
        }
    }

    return (
        <View flex={1} width={DEVICE_WIDTH} px={"$3"}>
            <LeftBackButton route="/bookings" bg="black" />
            <H3>Search</H3>
            <XStack justifyContent="space-between" mb={15} alignItems="center">
                <XStack
                    mt={10}
                    borderRadius={10}
                    alignItems="center"
                    space
                    backgroundColor={"white"}
                    paddingHorizontal={10}
                    paddingVertical={5}
                >
                    <Input
                        flex={1}
                        backgroundColor={"transparent"}
                        value={searchTerm}
                        borderWidth={0}
                        onChangeText={handleSearchTerm}
                    />
                    <Ionicons name="search-outline" size={20} />
                </XStack>
            </XStack>
            <YStack space="$2">
                <DateCalendarTabs onDatePress={handleDateSelect} />
                <FlatList
                    data={resp?.partners}
                    ListEmptyComponent={() => isLoading ? <LoadingActivityCard /> :<Text>sessions not found</Text>}
                    renderItem={({ item }) => (
                        <Activity partner={item} date={slectedDate} />
                    )}
                    showsVerticalScrollIndicator={false}
                    keyExtractor={(item) => item.id}
                    onEndReached={handleRefreshData}
                    onMomentumScrollBegin={() => {
                        onEndReachedCalledDuringMomentum.current = false
                    }}
                    onEndReachedThreshold={0.7}
                    refreshControl={
                        <RefreshControl
                            onRefresh={refetch}
                            refreshing={isRefetching}
                        />
                    }
                />
            </YStack>
        </View>
    )
}

export default BookingList

export const LoadingActivityCard = () => {
    return (
        <View
            mb={10}
            mr={"$2"}
            px={20}
            py={15}
            borderRadius={8}
            backgroundColor={"white"}
            style={{ elevation: 3 }}
        >
            <View flexDirection="row" alignItems="flex-start">
               <XStack gap={'$2'}>
               <Skeleton colorMode="light" height={100} width={100} />
                <YStack gap={"$4"} maxWidth={210}>
                    <Skeleton  colorMode="light" height={20} width={"100%"} />
                    <Skeleton colorMode="light" height={10} width={"100%"} />
                    <Skeleton colorMode="light" height={10} width={"100%"} />
                </YStack>
               </XStack>
            </View>
        </View>
    )
}

export const Activity = ({ partner, date }) => {
    const router = useRouter()
    const { images } = partner
    console.log({ date, d: 2222 })
    const goToSessionDetail = () => {
        router.push({
            pathname: `/bookings/list/${partner.id}`,
            params: {
                date,
            },
        })
    }

    return (
        <TouchableWithoutFeedback onPress={goToSessionDetail}>
            <View
                mb={10}
                mr={"$2"}
                px={20}
                py={15}
                borderRadius={8}
                backgroundColor={"white"}
                style={{ elevation: 3 }}
            >
                <View flexDirection="row" alignItems="flex-start">
                    <CustomImage
                        src={buildFileUrl(images[0].repo, images[0].key)}
                        alt={images[0].key}
                        height={100}
                        width={100}
                    />

                    <YStack ml={"$2"} maxWidth={210}>
                        <H6 wordWrap="break-word">{partner.name}</H6>
                        <Text color="$gray9">{partner.category}</Text>
                        <Text
                            fontSize={"$3"}
                            wordWrap="break-word"
                            color="$gray9"
                        >
                            {partner?.addresses[0].name}
                        </Text>
                    </YStack>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}

function formatTimeRange(startTime: Date, endTime: Date): string {
    const startHours = startTime.getHours().toString().padStart(2, "0")
    const startMinutes = startTime.getMinutes().toString().padStart(2, "0")
    const endHours = endTime.getHours().toString().padStart(2, "0")
    const endMinutes = endTime.getMinutes().toString().padStart(2, "0")

    return `${startHours}:${startMinutes} - ${endHours}:${endMinutes}`
}
