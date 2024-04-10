import { useRef, useState } from "react"
import { FlatList, RefreshControl, SectionList, TouchableHighlight, TouchableOpacity } from "react-native"
import Ionicons from "@expo/vector-icons/Ionicons"
import { DefaultTheme } from "@react-navigation/native"
import { Avatar, H3, Input, SizableText, Tabs, Text, View, XStack, YStack, useDebounce } from "tamagui"

import { RecipeItem, RecipeSkeleton } from "../../../components/recipeItem"
import { api } from "../../../utils/api"
import _ from 'lodash'
import { usePathname, useRouter } from "expo-router"

const meals = ["Breakfast", "Lunch", "Snack", "Dinner"]
type MealType = "Breakfast" | "Lunch" | "Snack" | "Dinner"
const RecipeScreen = () => {
    const [activeTab, setActiveTab] = useState<MealType>("Breakfast")
    const [searchTerm, setSearchTerm] = useState<string>()
    const router = useRouter()
    const pathname = usePathname()

    const { isLoading: isLoadingProfile , data } = api.auth.getProfile.useQuery()

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
        searchName: searchTerm
    })

    const handleRefreshData = () => {
        // handle refgresh data

    }

    const handleSearchTerm =(term: string) => {
        setSearchTerm(term)
        debouncSearch()
        
    }

    const debouncSearch = _.debounce(refetch, 300)

    const handleGoToRecipeBookmark = () => {
        router.push(`/recipes/bookmarks`)
    }

    const goToProfile = () => {
        router.push('/profile')
    }

    return (
        <View flex={1}>
            <View flex={1} mb={"$3"} mt={"$5"} paddingHorizontal={"$4"}>
                <XStack justifyContent="space-between" alignItems="center">
                    <H3 fontSize={"$9"} fontWeight={"$15"}>Recipes</H3>
                    <XStack gap={'$4'} alignItems="center">
                    <TouchableOpacity onPress={handleGoToRecipeBookmark}>
                        <Ionicons name="bookmark-outline" size={25} />
                    </TouchableOpacity>
                    <TouchableHighlight onPress={goToProfile}>
                        <Avatar circular size="$3">
                           {!isLoadingProfile && data &&   <Avatar.Image src={data?.imageUrl} />}
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
                    <Ionicons name="search-outline" size={20} />
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
                                <Tabs.Tab value={meal} key={meal}>
                                    <SizableText fontSize={"$3"}>
                                        {meal}
                                    </SizableText>
                                </Tabs.Tab>
                            ))}
                        </Tabs.List>
                        <Tabs.Content value="Breakfast" display="flex" mb={100}>
                            <RecipeList
                                recipes={[
                                    {
                                        data: recipes?.recipes  || [],
                                        isHorizontal: true,
                                        title: "Made for you",
                                    },
                                    {
                                        data: recipes?.recipes || [],
                                        isHorizontal: false,
                                        title: "Recipes",
                                    },
                                ]}
                                isRefetching={isRefetching}
                                isLoading={isLoading}
                                handleRefreshData={handleRefreshData}
                                isHorizontal={true}
                            />
                        </Tabs.Content>
                        <Tabs.Content value="Lunch" display="flex" mb={100}>
                            <RecipeList
                                recipes={[
                                    {
                                        data: recipes?.recommend  || [],
                                        isHorizontal: true,
                                        title: "Made for you",
                                    },
                                    {
                                        data: recipes?.recipes || [],
                                        isHorizontal: false,
                                        title: "Recipes",
                                    },
                                ]}
                                isLoading={isLoading}
                                isRefetching={isRefetching}
                                handleRefreshData={handleRefreshData}
                                isHorizontal={true}
                            />
                        </Tabs.Content>
                        <Tabs.Content value="Dinner" display="flex" mb={100}>
                            <RecipeList
                                recipes={[
                                    {
                                        data: recipes?.recommend || [] ,
                                        isHorizontal: true,
                                        title: "Made for you",
                                    },
                                    {
                                        data: recipes?.recipes || [],
                                        isHorizontal: false,
                                        title: "Recipes",
                                    },
                                ]}
                                isLoading={isLoading}
                                isRefetching={isRefetching}
                                handleRefreshData={handleRefreshData}
                                isHorizontal={true}
                            />
                        </Tabs.Content>
                        <Tabs.Content value="Snack" display="flex" mb={100}>
                            <RecipeList
                                recipes={[
                                    {
                                        data: recipes?.recommend || [] ,
                                        isHorizontal: true,
                                        title: "Made for you",
                                    },
                                    {
                                        data: recipes?.recipes || [],
                                        isHorizontal: false,
                                        title: "Recipes",
                                    },
                                ]}
                                isLoading={isLoading}
                                isRefetching={isRefetching}
                                handleRefreshData={handleRefreshData}
                                isHorizontal={true}
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
    isHorizontal,
}: {
    recipes: any[]
    isLoading: boolean
    isRefetching: boolean
    handleRefreshData: () => void
    isHorizontal: boolean
}) => {
    const recipeRef = useRef()

    const renderItem = ({ item, section }) => {
        if (section.isHorizontal) return null
        return <RecipeItem recipe={item} />
    }

    return (
        <SectionList
            sections={recipes}
            ref={recipeRef}
            renderItem={renderItem}
            scrollEnabled
            showsVerticalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            refreshControl={
                <RefreshControl
                    onRefresh={handleRefreshData}
                    refreshing={isRefetching}
                />
            }
            renderSectionHeader={({ section }) => {
                return (
                    <View>
                        <View
                            backgroundColor={DefaultTheme.colors.background}
                            py={"$1"}
                        >
                            {/* <Text mb={"$2"} fontSize={"$6"}>
                                {section.title}
                            </Text> */}
                        </View>

                        {isLoading && <RecipeSkeleton />  }
                        {section.data.length === 0 && !isLoading && <Text color={'$gray10'}>Recipe not found</Text>}
                        {/* 
                        {section.isHorizontal && (
                            <FlatList
                                data={section.data}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => {
                                    return <RecipeItem recipe={item} />
                                }}
                            />
                        )} */}
                    </View>
                )
            }}
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


