import React, { useRef, useState } from "react"
import {
    FlatList,
    Linking,
    RefreshControl,
    TouchableOpacity,
    type ViewStyle,
} from "react-native"
import { usePathname, useRouter } from "expo-router"
import { useQuery } from "@tanstack/react-query"
import { Skeleton } from "moti/skeleton"
import { H6, Text, View, XStack } from "tamagui"

import { getResources, type Resource } from "../../api/resources"
import { Colors } from "../../constants/colors"
import { buildFileUrl } from "../../utils/buildUrl"
import CustomImage from "../CustomImage"

export const RecommendedResources = ({ tags }: { tags: string[] }) => {
    const router = useRouter()
    const [page, setPage] = useState(1)
    const resourcesRef = useRef()

    // const {
    //     data,
    //     isRefetching: isResourceRefetching,
    //     isLoading: isLoadingResources,
    // } = api.resource.list.useQuery({ filter: { page, limit: 10 } })

    const {
        isLoading: isLoadingResources,
        data,
        refetch,
        isRefetching: isResourceRefetching,
    } = useQuery(["getActivities", tags], () => getResources(tags))

    const handleRefreshResourceData = () => {
        // if (data && page < data?.data.totalPages) {
        //     setPage((prev) => prev + 1)
        // }
    }

    const viewMoreArticles = () => {
        router.push({
            pathname: 'today/resources',
            params: tags,
        })
    }

    const LoadingResourceCard = () => {
        return (
            <View borderWidth="$0" mr={"$3"} py={"$1"}>
                <Skeleton
                    colorMode="light"
                    height={120}
                    width={"100%"}
                ></Skeleton>
                <View py={"$4"}>
                    <Skeleton
                        colorMode="light"
                        height={20}
                        width={"100%"}
                    ></Skeleton>
                </View>
            </View>
        )
    }

    return (
        <View>
            <View px={"$3"} py={"$4"}>
                <XStack
                    py={"$2.5"}
                    display="flex"
                    justifyContent="space-between"
                >
                    <H6 mb="$2">Resources made for you</H6>
                    <TouchableOpacity onPress={viewMoreArticles}>
                        <Text>View All</Text>
                    </TouchableOpacity>
                </XStack>

                <FlatList
                    data={data?.slice(0, 2)}
                    keyExtractor={(data) => data.id}
                    ListEmptyComponent={() =>
                        isLoadingResources ? (
                            <LoadingResourceCard />
                        ) : (
                            <Text>No resources found</Text>
                        )
                    }
                    renderItem={({ item }) => (
                        <ResourceItem
                            resource={item}
                            width={250}
                            height={200}
                        />
                    )}
                    onEndReached={handleRefreshResourceData}
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    maxToRenderPerBatch={10}
                    initialScrollIndex={0}
                    onEndReachedThreshold={0}
                    onScrollToIndexFailed={({ index, averageItemLength }) => {
                        resourcesRef.current?.scrollToOffset({
                            offset: index * averageItemLength,
                            animated: true,
                        })
                    }}
                    refreshControl={
                        <RefreshControl
                            onRefresh={handleRefreshResourceData}
                            refreshing={isResourceRefetching}
                        />
                    }
                />
            </View>
        </View>
    )
}

export const ResourceItem = ({
    resource,
    ...rest
}: { resource: Resource } & ViewStyle) => {
    const pathname = usePathname()
    const router = useRouter()

    const handlePress = async () => {
        if (resource.contentType === "Link") {
            const url = resource.url
            const isSupported = await Linking.canOpenURL(url)
            if (isSupported) {
                await Linking.openURL(url)
            }
            return
        }
        router.push(`today/resources/${resource.id}`)
        // go to resource detail screen
    }
    return (
        <View borderWidth="$0" mr={"$3"} py={"$1"} {...rest}>
            <TouchableOpacity onPress={handlePress}>
                <CustomImage
                    src={buildFileUrl(
                        resource?.image.repo as string,
                        resource?.image.key as string,
                    )}
                    resizeMode="cover"
                    height={120}
                    style={{ borderRadius: 10 }}
                    width={"100%"}
                    alt={resource.title}
                />
                <View py={"$4"}>
                    <Text
                        fontSize={"$4"}
                        color={Colors.light.text}
                        fontWeight={"500"}
                    >
                        {resource.title}
                    </Text>
                    <View
                        mt="$2"
                        borderRadius={10}
                        bg={Colors.light.secondray}
                        py={"$1"}
                        px="$2"
                        maxWidth={70}
                    >
                        <Text
                            textAlign="center"
                            fontSize={"$3"}
                            color={Colors.light.primary}
                        >
                            {resource.contentType === "Link"
                                ? "Article"
                                : resource.contentType}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    )
}
