import React, { useRef, useState } from "react"
import { TouchableOpacity, useWindowDimensions } from "react-native"
import Ionicons from "@expo/vector-icons/Ionicons"
import { Image, H3, H4, ScrollView, Text, View, XStack, YStack, H6 } from "tamagui"

import { Carousel } from "../../../components/carousel"
import { mockRecipes, Recipe } from "../../../components/recipeItem"
import { useRouter } from "expo-router"

const RecipeDetail = ({ recipe }: Recipe) => {

    const router = useRouter()
    recipe = mockRecipes[0] as Recipe
    const { width: SCREEN_WIDTH } = useWindowDimensions()


    const goBack = () => {
      router.replace('/recipes')
    }



    return (
        <ScrollView py={3}>
            <Carousel data={recipe.images} width={SCREEN_WIDTH} height={300} onBackPress={goBack} />
            <View px={10}>
                <XStack justifyContent="space-between" alignItems="center">
                    <H4 fontSize={"$8"}>{recipe.name}</H4>
                    <TouchableOpacity>
                        <Ionicons name="bookmark-outline" size={25} />
                    </TouchableOpacity>
                </XStack>
               <YStack space={20} mb={20}>
               <XStack mt={5} space>
                    <Text color={'$gray10'}>{recipe.duration} mins</Text>
                    <View borderWidth={1} height={15} borderColor={'$gray10'}></View>
                    <Text color={'$gray10'}>500 KCAL</Text>
                    <View borderWidth={1} height={15} borderColor={'$gray10'}></View>
                    <Text color={'$gray10'}>Easy</Text>
                </XStack>
                <Text color={'$gray10Dark'}>{recipe.description}</Text>
               </YStack>
                <YStack mb={20} space={20}>
                    <H4 fontWeight={'$6'}>Nutrients</H4>
                    <ScrollView horizontal backgroundColor={'$gray5'} py={'$4'} px={'$2'}>
                        {recipe.nutrients.map((nutrient, index) => (
                            <YStack minWidth={80} borderRadius={'$5'} px={'$3'} py={'$4'} key={index} mr={10} backgroundColor={'white'}>
                               <Text mb={5} textAlign="center" color={'$green8'}>{nutrient.value}{nutrient.unit}</Text>
                               <Text textAlign="center">{nutrient.name} </Text>
                            </YStack>
                        ))}
                    </ScrollView>
                </YStack>
                <YStack  mb={20}>
                    <H4 fontWeight={'$6'}>Ingredients</H4>
                    {recipe.ingredients.map((item) => (
                        <XStack key={item.id} my={5} py={10} space={10} alignItems="center" borderBottomWidth={0.5} borderBottomColor={'$gray8'}>
                            <Image style={{ height: 40, width: 40 }}  source={{ uri: item.imageUrl }}/>
                            <Text>{item.name}</Text>
                        </XStack>
                    ))}
                </YStack>
                <YStack mb={20}>
                    <H4 fontWeight={'$6'}>Steps</H4>
                    {recipe.steps.map((step: string, index: number) => (
                        <YStack key={index} my={5} py={10} space={10} borderBottomWidth={0.5} borderBottomColor={'$gray8'}>
                            <H6>Step {index + 1}</H6>
                            <Text  color={'$gray10'}>{step}</Text>
                        </YStack>
                    ))}
                </YStack>
            </View>
        </ScrollView>
    )
}

export default RecipeDetail
