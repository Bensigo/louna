import { useRef, useState } from "react"
import { api } from "../../../utils/api"
import { View, Text } from "tamagui"
import { Skeleton } from "moti/skeleton"
import { FlatList, RefreshControl } from "react-native"
import { ResourceItem } from "../../../components/RecommendedArticle"



const ArticlesScreen = () => {
    const [page, setPage] = useState(1)
    const resourcesRef = useRef()

    const { data, isRefetching: isResourceRefetching , isLoading} =
    api.resource.list.useQuery({ filter: { page, limit: 15 } })

    const handleRefreshResourceData = () => {
        if (data && page < data?.data.totalPages){
             setPage((prev) => prev + 1)
        }
    }

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
                            data={data?.data.resources}
                            keyExtractor={(data) => data.id}
                            ListEmptyComponent={() => (
                                <Text>No Articles found</Text>
                            )}
                            renderItem={({ item }) => <ResourceItem resource={item} width={'100%'} height={250} />}
                            onEndReached={handleRefreshResourceData}
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
                                    onRefresh={handleRefreshResourceData}
                                    refreshing={isResourceRefetching}
                                />
                            }
                        />
       </View>
    )
}

export default ArticlesScreen;