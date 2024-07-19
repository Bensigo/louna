import React from "react"
import {
    ActivityIndicator,
    TouchableOpacity,
    useWindowDimensions,
} from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import Ionicons from "@expo/vector-icons/Ionicons"
import { Skeleton } from "moti/skeleton"
import {
    H4,
    H6,
    ScrollView,
    Text,
    View,
    XStack,
    YStack,
} from "tamagui"

import { Carousel } from "../carousel"
import CustomImage from "../CustomImage"
import { api } from "../../utils/api"
import { buildFileUrl } from "../../utils/buildUrl"
import ReadMoreCollapsible from "../collapable"


const RecipeDetail = () => {
    const router = useRouter()
    const { id } = useLocalSearchParams()

    const ctx = api.useUtils()

    const { data: recipe, isLoading } = api.recipe.getRecipe.useQuery({
        id: id as string,
    })




    const { data: isBookmark } = api.recipe.isBookmark.useQuery({ id: id as string })

    const { data: isLike } = api.recipe.isLike.useQuery({ id: id as string })


    const { mutate: likeRecipe, isLoading: isLiking } =  api.recipe.likeRecipe.useMutation()

    const { mutate: bookmarkRecipe, isLoading: isCreatingBokmark } =
        api.recipe.bookmarkRecipe.useMutation()

    const { width: SCREEN_WIDTH } = useWindowDimensions()

    const goBack = () => {
        router.replace("/recipes")
    }

    if (isLoading) {
        return <Skeleton height={"100%"} width={"100%"} colorMode="light" />
    }

    const handleBookmark = () => {
        if (id){
            bookmarkRecipe({
                id: id as string
            }, {
                onSuccess: () => {
                    ctx.recipe.isBookmark.invalidate()
                    ctx.recipe.list.invalidate()
                }
            })
        }
        
    }
    const handleLikePress = () => {
        if (id){
            likeRecipe({
                id: id as string
            }, {
                onSuccess: () => {
                    ctx.recipe.isLike.invalidate()
                }
            })
        }
    }

    return (
        <View flex={1}>
            {recipe && (
                <ScrollView py={3} showsVerticalScrollIndicator={false}>
                    <Carousel
                        data={recipe?.images}
                        width={SCREEN_WIDTH}
                        isLike={isLike as boolean}
                        height={300}
                        onBackPress={goBack}
                        onLike={handleLikePress}
                        isLikePress={isLiking}
                     
                    />
                    <View px={'$4'}>
                        <XStack
                            justifyContent="space-between"
                            alignItems="center"
                        >
                            <H4 fontSize={"$8"}>{recipe.name}</H4>
                            <TouchableOpacity onPress={handleBookmark}>
                                {isCreatingBokmark ? (
                                    <ActivityIndicator size={'small'} />
                                ) : (
                                    <Ionicons
                                        name={isBookmark? 'bookmark': "bookmark-outline"}
                                     
                                        style={isBookmark && { color: 'black'}}
                                        size={25}
                                    />
                                )}
                            </TouchableOpacity>
                        </XStack>
                        <YStack space={20} mb={20}>
                            <XStack mt={5} space>
                                <Text color={"$gray10"}>
                                    {recipe.duration} mins
                                </Text>
                                <View
                                    borderWidth={1}
                                    height={15}
                                    borderColor={"$gray10"}
                                ></View>
                                <Text color={"$gray10"}>
                                    {recipe.calories} KCAL
                                </Text>
                                <View
                                    borderWidth={1}
                                    height={15}
                                    borderColor={"$gray10"}
                                ></View>
                                <Text color={"$gray10"}>
                                    {recipe.difficulty}{" "}
                                </Text>
                            </XStack>
                            <ReadMoreCollapsible text={recipe.description} />

                            
                        </YStack>
                        <YStack mb={20} space={20}>
                            <H4 fontWeight={"$6"}>Nutrients</H4>
                            <ScrollView
                                horizontal
                                backgroundColor={"$gray5"}
                                py={"$4"}
                                px={"$2"}
                            >
                                {recipe.nutrients.map((nutrient, index) => (
                                    <YStack
                                        minWidth={80}
                                        borderRadius={"$5"}
                                        px={"$3"}
                                        py={"$4"}
                                        key={index}
                                        mr={10}
                                        backgroundColor={"white"}
                                    >
                                        <Text
                                            mb={5}
                                            textAlign="center"
                                            color={"$green8"}
                                        >
                                            {nutrient.value}
                                            {nutrient.unit}
                                        </Text>
                                        <Text textAlign="center">
                                            {nutrient.name}{" "}
                                        </Text>
                                    </YStack>
                                ))}
                            </ScrollView>
                        </YStack>
                        <YStack mb={20}>
                            <H4 fontWeight={"$6"}>Ingredients</H4>
                            {recipe.ingredients?.map((item) => (
                                <XStack
                                    key={item.id}
                                    my={5}
                                    py={10}
                                    space={10}
                                    alignItems="center"
                                    borderBottomWidth={0.5}
                                    borderBottomColor={"$gray8"}
                                >
                                    <CustomImage
                                        height={40}
                                        width={40}
                                        src={buildFileUrl(
                                            item.image.repo,
                                            item.image.key,
                                        )}
                                        alt={item.name}
                                    />
                                    <Text>{item.name}</Text>
                                </XStack>
                            ))}
                        </YStack>
                        <YStack mb={20}>
                            <H4 fontWeight={"$6"}>Steps</H4>
                            {recipe.steps.map((step: string, index: number) => (
                                <YStack
                                    key={index}
                                    my={5}
                                    py={10}
                                    space={10}
                                    borderBottomWidth={0.5}
                                    borderBottomColor={"$gray8"}
                                >
                                    <H6>Step {index + 1}</H6>
                                    <Text color={"$gray10"}>{step}</Text>
                                </YStack>
                            ))}
                        </YStack>
                    </View>
                </ScrollView>
            )}
        </View>
    )
}

export default RecipeDetail
