import { H6, View , XStack, Text } from "tamagui"
import { api } from "../../utils/api"
import React, { useRef, useState } from "react"
import { TouchableOpacity, FlatList, RefreshControl , Linking, type ViewStyle} from "react-native"

import { Skeleton } from 'moti/skeleton'
import { usePathname, useRouter } from "expo-router"


import CustomImage from "../../components/CustomImage"
import { Colors } from "../../constants/colors"
import { buildFileUrl } from "../../utils/buildUrl"


export const MadeForYou = () => {
    const router = useRouter()
    const pathname = usePathname()
    const [page, setPage ] = useState(1)
    const resourcesRef = useRef()

    const {
        data,
        isRefetching: isResourceRefetching,
        isLoading: isLoadingResources,
    } = api.resource.list.useQuery({ filter: { page, limit: 10 } })


    const handleRefreshResourceData = () => {
        if (data && page < data?.data.totalPages) {
            setPage((prev) => prev + 1)
        }
    }

    const viewMoreArticles = () => {
        router.push(`home/articles`)
    }


    const LoadingResourceCard = () => {
        return (
            <View borderWidth="$0" mr={"$3"} py={"$1"} >
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
        <View >
           
            <View  px={"$3"} py={"$4"}>
                        <XStack
                            py={"$2.5"}
                            display="flex"
                            justifyContent="space-between"
                        >
                            <H6 mb="$2">Articles made for you</H6>
                            <TouchableOpacity onPress={viewMoreArticles}>
                                <Text>View All</Text>
                            </TouchableOpacity>
                        </XStack>

                        <FlatList
                            data={data?.data.resources}
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
                            onScrollToIndexFailed={({
                                index,
                                averageItemLength,
                            }) => {
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
}: { resource: any } & ViewStyle) => {
    const openWebView = async () => {
        const url = resource.url
        const isSupported = await Linking.canOpenURL(url)
        if (isSupported) {
            await Linking.openURL(url)
        }
    }
    return (
        <View borderWidth="$0" mr={"$3"} py={"$1"} {...rest}>
            <TouchableOpacity onPress={openWebView}>
                <CustomImage
                    src={buildFileUrl(resource.image.repo, resource.image.key)}
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
                </View>
            </TouchableOpacity>
        </View>
    )
}

