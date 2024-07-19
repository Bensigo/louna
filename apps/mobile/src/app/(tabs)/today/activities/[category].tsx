import { useRef } from "react"
import {
    FlatList,
    RefreshControl,
    TouchableWithoutFeedback,
} from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { useQuery } from "@tanstack/react-query"
import { H6, Text, View, YStack } from "tamagui"

import { type RouterOutputs } from "@solu/api"

import { getSuggestedActivities } from "~/api/activities"
import CustomImage from "../../../../components/CustomImage"
import { buildFileUrl } from "../../../../utils/buildUrl"
import { LoadingActivityCard } from "../../bookings/list"

const ActivityByCategoryScreen = () => {
    const { category } = useLocalSearchParams()
    const onEndReachedCalledDuringMomentum = useRef(true)

    const {
        isLoading,
        data: activities,
        refetch,
        isRefetching,
    } = useQuery(["suggestedActivities", category], () =>
        getSuggestedActivities(category),

    )


    const handleRefreshData = () => {}


    return (
        <View py={"$3"} px={'$3'} flex={1}>
            {isLoading ? (
                <FlatList
                    data={[{}, {}, {}, {}]} 
                    showsVerticalScrollIndicator={false}
                    renderItem={() => <LoadingActivityCard />}
                    keyExtractor={(_, index) => index.toString()}
                />
            ) : (
                <FlatList
                    data={activities}
                    ListEmptyComponent={<Text>Activities not found</Text>}
                    renderItem={({ item }) => <Activity data={item} />}
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
            )}
        </View>
    )
}

export default ActivityByCategoryScreen

const Activity = ({ data }: { data: RouterOutputs["session"]["get"] }) => {
    const router = useRouter()
    const partner = data?.Partner || {}
   
    const { images } = partner

    const goToSessionDetail = () => {
        router.push({
            pathname: `/activities/list/${partner?.id}`,
            params: {
                date: new Date(),
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
                        src={buildFileUrl(images[0]?.repo, images[0]?.key)}
                        alt={images[0].key}
                        height={100}
                        width={100}
                    />

                    <YStack ml={"$2"} maxWidth={210}>
                        <H6 wordWrap="break-word">{partner?.name}</H6>
                        <Text color="$gray9">{partner?.category}</Text>
                        <Text
                            fontSize={"$3"}
                            wordWrap="break-word"
                            color="$gray9"
                        >
                            {data?.Address?.name}
                        </Text>
                    </YStack>
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}
