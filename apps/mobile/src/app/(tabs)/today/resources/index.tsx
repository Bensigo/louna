import { useRef, useState } from "react"

import { View, Text } from "tamagui"
import { Skeleton } from "moti/skeleton"
import { FlatList, RefreshControl } from "react-native"
import { ResourceItem } from "../../../../components/RecommendedResouces"
import { getResources, type Resource } from "../../../../api/resources"
import { useQuery } from "@tanstack/react-query"
import { useLocalSearchParams } from "expo-router"



const ResourcesScreen = () => {
    const [page, setPage] = useState(1)
    const { tags } = useLocalSearchParams();
    const resourcesRef = useRef()

    const {
        isLoading,
        data,
        refetch,
        isRefetching: isResourceRefetching,
    } = useQuery(["getActivities", tags], () => getResources(tags))



    if (isLoading) {
        return (
            <View px={"$4"} py={"$3"} flex={1}>
                <Skeleton colorMode="light" height={"100%"} width={"100%"} />
            </View>
        )
    }

    return (
       <View px={'$4'} py={'$2'}>
              <FlatList
                            data={data}
                            keyExtractor={(data) => data.id}
                            ListEmptyComponent={() => (
                                <Text>No Articles found</Text>
                            )}
                            renderItem={({ item }) => <ResourceItem resource={item} width={'100%'} height={250} />}
                            showsVerticalScrollIndicator={false}
                     
                            
                          
                            maxToRenderPerBatch={15}
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
                                    onRefresh={refetch}
                                    refreshing={isResourceRefetching}
                                />
                            }
                        />
       </View>
    )
}

export default ResourcesScreen;