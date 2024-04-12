import { useEffect, useRef, useState } from "react"
import {
    FlatList,
    RefreshControl,
    TouchableHighlight,
    TouchableWithoutFeedback,
} from "react-native"
import { ResizeMode, Video } from "expo-av"
import { isLoading } from "expo-font"
import { usePathname, useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { Skeleton } from "moti/skeleton"
import {
    Avatar,
    H2,
    Input,
    Text,
    useTheme,
    View,
    XStack,
    YStack,
} from "tamagui"

import { buildFileUrl, buildFileUrlV2 } from "../../../utils/buildUrl"
import { api } from "../../../utils/api"
import CustomImage from "../../../components/CustomImage"

const VideoCard = ({ videoSource, title, id }) => {
   const router = useRouter()
   const pathname = usePathname()

    console.log({ videoSource })

    const handlePress = () => {
        router.push(`smw/${id}`)
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
                    <Text style={{ fontSize: 12, color: "black" }}>
                        Duration:{" "}
                        20 mins
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

const catgeoryFilter = [
    "low-stress",
    "moderate-stress",
    "high-stress",
    "meditation",
    "breathing-exercise",
    "time in nature",
    "exercise",
    "weight loss",
    "muscle tone",
    "endurance improvement",
    "stress relief",
    "mobility",
]

const SmwScreen = () => {
    const [searchTerm, setSearchTerm] = useState<string>()
    const [selectedCategory, setSelectedCategory] = useState<string>(
        catgeoryFilter[0],
    )
    const onEndReachedCalledDuringMomentum = useRef(true)
    const router = useRouter()
    const { isLoading, data } = api.auth.getProfile.useQuery()

    const {
        isLoading: isLoadingSmw,
        data: smws,
        refetch,
        isRefetching,
    } = api.smw.list.useQuery({
        filter: {
            category: selectedCategory,
            skip: 0,
            limit: 50,
        },
        searchTerm,
    })

    const goToProfile = () => {
        router.push("/profile")
    }
    const handleSearchTerm = () => {}

    const handleCategoryPress = (category: string) => {
        setSelectedCategory(category)
    }

    const handleRefreshData = () => {}

    console.log({ smws })
    return (
        <View flex={1} mt="$4" px="$4">
            <XStack justifyContent="space-between" alignItems="center">
                <YStack gap="$2">
                    <H2 fontSize={"$9"} fontWeight={"$15"}>
                        SMW
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
            <View mt="$3">
                <FlatList
                    data={catgeoryFilter}
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item }) => (
                        <TouchableHighlight
                            onPress={() => handleCategoryPress(item)}
                        >
                            <View
                                mr={"$2.5"}
                                px="$3"
                                py={"$2"}
                                bg={
                                    selectedCategory === item
                                        ? "black"
                                        : "white"
                                }
                                borderRadius={"$3"}
                            >
                                <Text
                                    color={
                                        selectedCategory === item
                                            ? "white"
                                            : "black"
                                    }
                                >
                                    {item}
                                </Text>
                            </View>
                        </TouchableHighlight>
                    )}
                />
            </View>
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

export default SmwScreen
