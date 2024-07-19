import { type MutableRefObject, useCallback, useEffect, useRef, useState } from "react"
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    TouchableHighlight,
    TouchableOpacity,
} from "react-native"
import { useRouter } from "expo-router"
import Ionicons from "@expo/vector-icons/Ionicons"
import _ from "lodash"
import {
    Avatar,
    H3,
    Input,
    SizableText,
    Tabs,
    Text,
    View,
    XStack,
} from "tamagui"

import { RecipeItem, RecipeSkeleton } from "../recipeItem"
import { Colors } from "../../constants/colors"
import { api , type RouterOutputs } from "../../utils/api"

const meals = ["BREAKFAST", "LUNCH", "DINNER", "SNACK"]
type MealType = "BREAKFAST" | "LUNCH" | "DINNER" | "SNACK" []

type Recipe = NonNullable<RouterOutputs['recipe']['getRecipe']>

const RecipeScreen = () => {
    const [activeTab, setActiveTab] = useState("BREAKFAST")
    const [searchTerm, setSearchTerm] = useState<string>()
    const [skip, setSkip] = useState(0)
    const [loadingMore, setLoadingMore] = useState(false)
    const [recipesByTab, setRecipesByTab] = useState<{ [key in MealType]?: Recipe[] }>({})
    const onEndReachedCalledDuringMomentum = useRef(true)
    const router = useRouter()

    const { isLoading: isLoadingProfile, data: user } = api.auth.getProfile.useQuery()

    const {
        data,
        isLoading,
        isRefetching,
        refetch,
    } = api.recipe.list.useQuery(
        {
            filter: {
                mealType: [activeTab],
                skip,
                limit: 20,
            },
            searchName: searchTerm,
        },
        { keepPreviousData: true },
    )

    useEffect(() => {
        if (data && data.recipes) {
            setRecipesByTab((prev) => ({
                ...prev,
                [activeTab]: data.recipes,
            }))
        }
    }, [data, activeTab])

    useEffect(() => {
        if (recipesByTab[activeTab]?.length){
            setLoadingMore(false)
        }
    }, [activeTab, recipesByTab])

    const handleLoadMore = useCallback(() => {
        if (!onEndReachedCalledDuringMomentum.current) {
            setLoadingMore(true)
            setSkip((prev) => prev + 20)
            onEndReachedCalledDuringMomentum.current = true
        }
    }, [])

    const handleSearchTerm = (term: string) => {
        setSearchTerm(term)
        debouncSearch()
    }

    const debouncSearch = _.debounce(refetch, 300)

    const handleGoToRecipeBookmark = () => {
        router.push(`/recipes/bookmarks`)
    }

    const goToProfile = () => {
        router.push("/profile")
    }

    return (
        <View flex={1}>
            <View flex={1} mb={"$3"} mt={"$5"} paddingHorizontal={"$4"}>
                <XStack justifyContent="space-between" alignItems="center">
                    <H3
                        fontSize={"$9"}
                        fontWeight={"$15"}
                        color={Colors.light.primary}
                    >
                        Recipes
                    </H3>
                    <XStack gap={"$4"} alignItems="center">
                        <TouchableOpacity onPress={handleGoToRecipeBookmark}>
                            <Ionicons
                                name="bookmark-outline"
                                size={25}
                                color={Colors.light.primary}
                            />
                        </TouchableOpacity>
                        <TouchableHighlight onPress={goToProfile}>
                            <Avatar circular size="$3">
                                {!isLoadingProfile && user && (
                                    <Avatar.Image src={user?.imageUrl} />
                                )}
                                <Avatar.Fallback bc="$blue3" />
                            </Avatar>
                        </TouchableHighlight>
                    </XStack>
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
                    <Ionicons
                        name="search-outline"
                        size={20}
                        color={Colors.light.primary}
                    />
                </XStack>

                <View mt="$4" mb={"$15"}>
                    <Tabs
                        defaultValue={activeTab}
                        flexDirection="column"
                        mt="$2"
                        onValueChange={(val) => setActiveTab(val as MealType)}
                    >
                        <Tabs.List space="$1">
                            {meals.map((meal) => (
                                <Tabs.Tab value={meal} key={meal} my="$4">
                                    <SizableText
                                        fontSize={"$3"}
                                        color={
                                            activeTab === meal
                                                ? Colors.light.primary
                                                : "black"
                                        }
                                    >
                                        {meal}
                                    </SizableText>
                                </Tabs.Tab>
                            ))}
                        </Tabs.List>
                        <Tabs.Content value="BREAKFAST" display="flex" mb={100}>
                            <RecipeList
                                recipes={recipesByTab["BREAKFAST"] || []}
                                isLoading={isLoading}
                                onEndReachedCalledDuringMomentum={onEndReachedCalledDuringMomentum}
                                isRefetching={isRefetching}
                                isLoadingMore={loadingMore}
                                handleLodingMore={handleLoadMore}
                                handleRefreshData={refetch}
                            />
                        </Tabs.Content>
                        <Tabs.Content value="LUNCH" display="flex" mb={100}>
                            <RecipeList
                                recipes={recipesByTab["LUNCH"] || []}
                                isLoading={isLoading}
                                onEndReachedCalledDuringMomentum={onEndReachedCalledDuringMomentum}
                                isRefetching={isRefetching}
                                isLoadingMore={loadingMore}
                                handleLodingMore={handleLoadMore}
                                handleRefreshData={refetch}
                            />
                        </Tabs.Content>
                        <Tabs.Content value="DINNER" display="flex" mb={100}>
                            <RecipeList
                                recipes={recipesByTab["DINNER"] || []}
                                isLoading={isLoading}
                                onEndReachedCalledDuringMomentum={onEndReachedCalledDuringMomentum}
                                isRefetching={isRefetching}
                                isLoadingMore={loadingMore}
                                handleLodingMore={handleLoadMore}
                                handleRefreshData={refetch}
                            />
                        </Tabs.Content>
                        <Tabs.Content value="SNACK" display="flex" mb={100}>
                            <RecipeList
                                recipes={recipesByTab["SNACK"] || []}
                                isLoading={isLoading}
                                onEndReachedCalledDuringMomentum={onEndReachedCalledDuringMomentum}
                                isRefetching={isRefetching}
                                isLoadingMore={loadingMore}
                                handleLodingMore={handleLoadMore}
                                handleRefreshData={refetch}
                            />
                        </Tabs.Content>
                    </Tabs>
                </View>
            </View>
        </View>
    )
}

export default RecipeScreen

const RecipeList = ({
    recipes,
    handleRefreshData,
    isRefetching,
    isLoading,
    handleLodingMore,
    isLoadingMore,
    onEndReachedCalledDuringMomentum,
}: {
    recipes: Recipe[]
    isLoading: boolean
    isRefetching: boolean
    isLoadingMore: boolean
    handleLodingMore: () => void
    onEndReachedCalledDuringMomentum:  MutableRefObject<boolean>
    handleRefreshData: () => void
}) => {

    const recipeRef = useRef()

    const renderItem = ({ item }: { item: Recipe }) => {
        return <RecipeItem recipe={item} />
    }

    const renderFooter = () => {
        return isLoadingMore ? (
            <ActivityIndicator size="small" color={Colors.light.primary} />
        ) : null
    }


    return isLoading && !isLoadingMore ? (
        <FlatList
            data={[{}, {}, {}, {}]} // Just a placeholder to show skeletons
            showsVerticalScrollIndicator={false}
            renderItem={() => <RecipeSkeleton />}
            keyExtractor={(_, index) => index.toString()}
        />
    ) : (
        <FlatList
            data={recipes}
            ref={recipeRef}
            renderItem={renderItem}
            scrollEnabled
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => {
                return <Text>No recipes found</Text>
            }}
            keyExtractor={(item) => item.id}
            refreshControl={
                <RefreshControl
                    onRefresh={handleRefreshData}
                    refreshing={isRefetching}
                    tintColor={Colors.light.primary}
                />
            }
            onEndReached={handleLodingMore}
            ListFooterComponent={renderFooter}
            onMomentumScrollBegin={() => {
                onEndReachedCalledDuringMomentum.current = false
            }}
            initialScrollIndex={0}
            onEndReachedThreshold={0.7}
            onScrollToIndexFailed={({ index, averageItemLength }) => {
                recipeRef.current?.scrollToOffset({
                    offset: index * averageItemLength,
                    animated: true,
                })
            }}
        />
    )
}
