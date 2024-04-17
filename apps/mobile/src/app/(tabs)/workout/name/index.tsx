import { useLocalSearchParams, usePathname, useRouter } from "expo-router";
import React, {  useRef } from "react";
import { TouchableHighlight, FlatList, RefreshControl, TouchableWithoutFeedback } from "react-native";
import { View, Text, XStack, Avatar, H2, YStack } from "tamagui";
import { api } from "../../../../utils/api";
import { buildFileUrlV2 } from "../../../../utils/buildUrl";
import { Skeleton } from "moti/skeleton";
import CustomImage from "../../../../components/CustomImage";

const VideoCard = ({ videoSource, title, id }) => {
    const router = useRouter()
    const pathname = usePathname()
 
     console.log({ videoSource })
 
     const handlePress = () => {
         router.push(`workout/name/${id}`)
     }
 
     return (
         <TouchableWithoutFeedback onPress={handlePress} style={{ marginTop: 10 }}>
             <View>
                <CustomImage alt={'vide'} height={200} width={'100%'} src={videoSource} style={{  borderRadius: 10 }} />
                 <View style={{ padding: 10, backgroundColor: "Background" }}>
                     <Text
                         style={{
                             fontSize: 14,
                             fontWeight: "bold",
                             color: "black",
                         }}
                     >
                         {title}
                     </Text>
                 </View>
             </View>
         </TouchableWithoutFeedback>
     )
 }
 
 const LoadingData = () => {
     return (
         <View my={"$2"} py={"$1"}>
             <Skeleton colorMode="light" height={150} width={"100%"} />
             <XStack gap={"$2"} mt={"$2"}>
                 <Skeleton colorMode="light" height={15} width={"100%"} />
                 <Skeleton colorMode="light" height={10} width={"100%"} />
             </XStack>
         </View>
     )
 }

 
const WorkoutCategoryScreen = () => {
    const { category } = useLocalSearchParams()

    const { isLoading, data } = api.auth.getProfile.useQuery()

    const onEndReachedCalledDuringMomentum = useRef(true)
    const router = useRouter()

    const {
        isLoading: isLoadingSmw,
        data: smws,
        refetch,
        isRefetching,
    } = api.smw.list.useQuery({
        filter: {
            category: category,
            skip: 0,
            limit: 50,
        }, 
    })

    
    const goToProfile = () => {
        router.push("/profile")
    }

    const handleRefreshData = () => {}


    return (
        <View flex={1} mt="$4" px="$4">
            <XStack justifyContent="space-between" alignItems="center">
                <YStack gap="$2">
                    <H2 fontSize={"$9"} fontWeight={"$15"}>
                        {category}
                    </H2>
                </YStack>
                <TouchableHighlight onPress={goToProfile}>
                    <Avatar circular size="$3">
                        {!isLoading && data && (
                            <Avatar.Image src={data?.imageUrl} />
                        )}
                        <Avatar.Fallback bc="$blue3" />
                    </Avatar>
                </TouchableHighlight>
            </XStack>
            <FlatList
                style={{
                    marginTop: 10
                }}
                data={smws}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={() =>
                    isLoadingSmw ? <LoadingData /> : <Text>smws not found</Text>
                }
                renderItem={({ item }) => (
                    <VideoCard
                        videoSource={buildFileUrlV2(
                            `/${item.thumbnailRepo}/${item.thumbnailKey}`,
                        )}
                        
                        id={item.id}
                        title={item.title}
                    />
                )}
                showsVerticalScrollIndicator={false}
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
            ></FlatList>
        </View>
    )

}

export default WorkoutCategoryScreen;