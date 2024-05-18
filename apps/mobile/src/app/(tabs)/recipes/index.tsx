import { useRef, useState } from "react"
import {
    FlatList,
    RefreshControl,
    TouchableHighlight,
    TouchableOpacity,
} from "react-native"
import { usePathname, useRouter } from "expo-router"
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

import { RecipeItem, RecipeSkeleton } from "../../../components/recipeItem"
import { api } from "../../../utils/api"
import { Colors } from "../../../constants/colors"


const meals = ["Breakfast", "Lunch", "Dinner", "Snack" ]
type MealType = "Breakfast" | "Lunch" | "Snack" | "Dinner"
const RecipeScreen = () => {
    const [activeTab, setActiveTab] = useState<MealType>("Breakfast")
    const [searchTerm, setSearchTerm] = useState<string>()
    const router = useRouter()

    const { isLoading: isLoadingProfile, data } = api.auth.getProfile.useQuery()

    const {
        data: recipes,
        isLoading,
        isRefetching,
        refetch,
    } = api.recipe.list.useQuery({
        filter: {
            mealType: activeTab.toUpperCase(),
            skip: 0,
            limit: 50,
        },
        searchName: searchTerm,
    })

    const handleRefreshData = () => {
        // handle refgresh data
    }

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
                    <H3 fontSize={"$9"} fontWeight={"$15"} color={Colors.light.primary}>
                        Recipes
                    </H3>
                    <XStack gap={"$4"} alignItems="center">
                        <TouchableOpacity onPress={handleGoToRecipeBookmark}>
                            <Ionicons name="bookmark-outline" size={25} color={Colors.light.primary} />
                        </TouchableOpacity>
                        <TouchableHighlight onPress={goToProfile}>
                            <Avatar circular size="$3">
                                {!isLoadingProfile && data && (
                                    <Avatar.Image src={data?.imageUrl} />
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
                    <Ionicons name="search-outline" size={20} color={Colors.light.primary}  />
                </XStack>

                <View mt="$4" mb={"$15"}>
                    <Tabs
                        defaultValue={activeTab}
                        flexDirection="column"
                        mt="$2"
                        onValueChange={(val) => setActiveTab(val as MealType)}
                    
                    >
                        <Tabs.List space="$1" >
                            {meals.map((meal) => (
                                <Tabs.Tab value={meal} key={meal} my="$4"  >
                                    <SizableText fontSize={"$3"} color={activeTab === meal ? Colors.light.primary : 'black'}>
                                        {meal}
                                    </SizableText>
                                </Tabs.Tab>
                            ))}
                        </Tabs.List>
                        <Tabs.Content value="Breakfast" display="flex" mb={100}>
                            <RecipeList
                                recipes={recipes?.recipes}
                                isLoading={isLoading}
                                isRefetching={isRefetching}
                                handleRefreshData={handleRefreshData}
                            />
                        </Tabs.Content>
                        <Tabs.Content value="Lunch" display="flex" mb={100}>
                            <RecipeList
                                recipes={recipes?.recipes}
                                isLoading={isLoading}
                                isRefetching={isRefetching}
                                handleRefreshData={handleRefreshData}
                            />
                        </Tabs.Content>
                        <Tabs.Content value="Dinner" display="flex" mb={100}>
                            <RecipeList
                                recipes={recipes?.recipes}
                                isLoading={isLoading}
                                isRefetching={isRefetching}
                                handleRefreshData={handleRefreshData}
                            />
                        </Tabs.Content>
                        <Tabs.Content value="Snack" display="flex" mb={100}>
                            <RecipeList
                                recipes={recipes?.recipes}
                                isLoading={isLoading}
                                isRefetching={isRefetching}
                                handleRefreshData={handleRefreshData}
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
}: {
    recipes: any[]
    isLoading: boolean
    isRefetching: boolean
    handleRefreshData: () => void
}) => {
    const recipeRef = useRef()

    const renderItem = ({ item }) => {
        if (isLoading) {
            return <RecipeSkeleton />
        }
        return <RecipeItem recipe={item} />
    }

    return (
        <FlatList
            data={recipes}
            ref={recipeRef}
            renderItem={renderItem}
            scrollEnabled
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => {
                if (isLoading) {
                    return <RecipeSkeleton />
                }
                return <Text>No recipes found</Text>
            }}
            keyExtractor={(item) => item.id}
            refreshControl={
                <RefreshControl
                    onRefresh={handleRefreshData}
                    refreshing={isRefetching}
                />
            }
            onEndReached={handleRefreshData}
            maxToRenderPerBatch={50}
            initialScrollIndex={0}
            onEndReachedThreshold={0}
            onScrollToIndexFailed={({ index, averageItemLength }) => {
                recipeRef.current?.scrollToOffset({
                    offset: index * averageItemLength,
                    animated: true,
                })
            }}
        />
    )
}
