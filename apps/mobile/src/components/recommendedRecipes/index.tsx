import { Alert, FlatList, TouchableOpacity } from "react-native"
import { useMutation } from "@tanstack/react-query"
import { H6, Text, View, XStack } from "tamagui"

import { getSuggestedRecipes , type RequestBody } from "../../api/recipes"
import { RecipeItem, RecipeSkeleton } from "../recipeItem"
import { useEffect } from "react"
import { type RouterOutputs } from "@solu/api"

export const RecommendedRecipes = ({ user , isUserLoading }: { isUserLoading: boolean , user: RouterOutputs['auth']['getProfile']}) => {
    const {
        mutateAsync: getRecipes,
        data: recipes,
        isLoading,
    } = useMutation(getSuggestedRecipes, {
        onError(error) {
            console.log({ error })
            Alert.alert("Error", JSON.stringify(error))
        },
    })

    useEffect(() => {
        const userInfo : RequestBody = {
            step_count: 4000,
            age: user?.userPref?.age as number,
            diet_preference: 'Vegan' as string,
            gender: 'female', 
            height: user?.userPref?.height || 160, // fix this
            weight:user?.userPref?.weight as number,
            fitness_goal: user?.userPref?.fitnesGoal[0] as string, // fix this,
            meal_preference: user?.userPref?.dietPref as string[],
            meal_frequency: 2, // fix this,
            allergies: user?.userPref?.foodDislike as string[]
        }
        getRecipes(userInfo)
    }, [getRecipes, user])

    // if (isLoading) {
    //     return <RecipeSkeleton />
    // }
    return (
        <View px={"$3"} py={"$2"} mt={'$4'}>
            <XStack py={"$2"} display="flex" justifyContent="space-between">
                <H6 mb="$2">Recipes made for you</H6>
                <TouchableOpacity onPress={() => {}}>
                    <Text>View All</Text>
                </TouchableOpacity>
            </XStack>
            {isLoading || isUserLoading ? (
                <FlatList
                    horizontal
                    data={[{}, {}, {}, {}]}
                    renderItem={() => <RecipeSkeleton />}
                />
            ) : (
                <FlatList
                    data={recipes}
                    
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => (item?.id as string)}
                    renderItem={({ item }) => {
                        return <RecipeItem recipe={item} />
                    }}
                />
            )}
        </View>
    )
}
