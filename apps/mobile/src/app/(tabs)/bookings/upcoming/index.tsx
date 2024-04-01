import React, { useRef, useState } from "react"
import {
    FlatList,
    RefreshControl,
    TouchableOpacity,
    useWindowDimensions,
} from "react-native"
import { useRouter } from "expo-router"
import { format } from "date-fns"
import { Skeleton } from "moti/skeleton"
import { Card, H5, Text, View, XStack, YStack } from "tamagui"

import { api } from "../../../../utils/api"

const MAX_LIMIT = 10

export default function Upcoming() {
    const router = useRouter()
    const [page, setPage] = useState(1)
    const bookingRef = useRef()
    const { height } = useWindowDimensions()
    const onEndReachedCalledDuringMomentum = useRef(true)

    const { data, isLoading, isRefetching, refetch } =
        api.booking.list.useQuery({
            limit: MAX_LIMIT,
            page,
        })

    const handleUpdateList = ({ distanceFromEnd }: any) => {
        if (!onEndReachedCalledDuringMomentum.current) {
            setPage((prev) => prev + 1)
            onEndReachedCalledDuringMomentum.current = true
        }
    }

    const goToBooking = (id: string) => {
        router.push({
            pathname: `/bookings/upcoming/${id}`,
        })
    }

    const renderItem = ({ item: booking }) => {
        return (
            <TouchableOpacity onPress={() => goToBooking(booking.id)}>
                <Card px="$3" py="$4">
                    <XStack gap={"$3"} alignItems="center">
                        <YStack gap="$2">
                            <H5 fontSize={"$5"}>
                                {format(booking.session.startTime, "MMM d")}
                            </H5>
                            <Text fontSize={"$2"}>
                                {format(booking.session.startTime, "h:mm a")} -{" "}
                                {format(booking.session.endTime, "h:mm a")}
                            </Text>
                        </YStack>
                        <YStack gap="$2">
                            <H5 fontSize={"$5"}>{booking.session.title}</H5>
                            <XStack gap={"$2"}>
                                <Text fontSize={"$2"}>
                                    Points: {booking.session.point}
                                </Text>
                                <Text fontSize={"$2"}>
                                    Capacity: {booking.session.capacity}
                                </Text>
                            </XStack>
                        </YStack>
                    </XStack>
                </Card>
            </TouchableOpacity>
        )
    }

    const LoadingCard = () => {
        return (
            <Card px="$3" py="$4">
                <XStack gap={"$3"} alignItems="center">
                    <YStack gap="$2">
                        <Skeleton
                            colorMode="light"
                            height={80}
                            width={"100%"}
                        />

                        <Skeleton
                            colorMode="light"
                            height={40}
                            width={"100%"}
                        />
                    </YStack>
                    <YStack gap="$2">
                        <Skeleton
                            colorMode="light"
                            height={40}
                            width={"100%"}
                        />
                        <XStack gap={"$2"}>
                            <Skeleton
                                colorMode="light"
                                height={40}
                                width={50}
                            />
                            <Skeleton
                                colorMode="light"
                                height={40}
                                width={50}
                            />
                        </XStack>
                    </YStack>
                </XStack>
            </Card>
        )
    }

    return (
        <View flex={1} px={10}>
            <FlatList
                ref={bookingRef}
                data={data}
                ListEmptyComponent={() =>
                    isLoading ? (
                        <LoadingCard />
                    ) : (
                        <Text>No Booking available</Text>
                    )
                }
                style={{
                    flex: 1,
                    height: height,
                }}
                onEndReached={handleUpdateList}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                renderItem={renderItem}
                maxToRenderPerBatch={10}
                onEndReachedThreshold={0.7}
                onMomentumScrollBegin={() => {
                    onEndReachedCalledDuringMomentum.current = false
                }}
                onScrollToIndexFailed={({ index, averageItemLength }) => {
                    bookingRef.current?.scrollToOffset({
                        offset: index * averageItemLength,
                        animated: true,
                    })
                }}
                refreshControl={
                    <RefreshControl
                        onRefresh={refetch}
                        refreshing={isRefetching}
                    />
                }
            />
        </View>
    )
}
