import {
    FlatList,
    TouchableHighlight,
    TouchableOpacity,
} from "react-native"
import { H2, H6, ScrollView, Text, View, XStack, Avatar, YStack } from "tamagui"

import { MadeForYou } from "../../../components/MadeForYou"
import { RecipeItem, RecipeSkeleton } from "../../../components/recipeItem"
import { api } from "../../../utils/api"
import { useRouter } from "expo-router"
import { format } from 'date-fns'

const TodayScreen = () => {
    const router = useRouter()
    const { isLoading, data } = api.auth.getProfile.useQuery()

    const goToProfile = () => {
        router.push('/profile')
    }

    const getDayAndMonth =(() => {
        const today = new Date()
        const formattedDate = format(today, 'dd MMMM');
        return formattedDate;
    })()
 
    return (
        <View flex={1} mt="$4" px="$4">
            <View mt="$4">
                <XStack justifyContent="space-between" alignItems="center">
                   <YStack gap="$2">
                        <H2 fontSize={"$9"} fontWeight={"$15"}>
                                Today
                            </H2>
                        <Text fontSize={"$6"}>{getDayAndMonth}</Text>
                   </YStack>
                    <TouchableHighlight onPress={goToProfile}>
                        <Avatar circular size="$3">
                           {!isLoading && data &&   <Avatar.Image src={data?.imageUrl} />}
                            <Avatar.Fallback bc="$blue3" />
                        </Avatar>
                    </TouchableHighlight>
                </XStack>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <MadeForYou />
                    <RecommendedRecipes />
                    <MadeForYou />
                </ScrollView>
            </View>
        </View>
    )
}

export default TodayScreen

const RecommendedRecipes = () => {
    const { data: recipes, isLoading } = api.recipe.list.useQuery({
        filter: {
            mealType: "BREAKFAST",
            skip: 0,
            limit: 10,
        },
    })

    if (isLoading) {
        return <RecipeSkeleton />
    }
    return (
        <View px={"$3"} py={"$2"}>
            <XStack py={"$2"} display="flex" justifyContent="space-between">
                <H6 mb="$2">Recipes made for you</H6>
                <TouchableOpacity onPress={() => {}}>
                    <Text>View All</Text>
                </TouchableOpacity>
            </XStack>
            <FlatList
                data={recipes?.recipes}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                    return <RecipeItem recipe={item} />
                }}
            />
        </View>
    )
}
