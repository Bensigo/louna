// RecipeItem.jsx

import React from "react"
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View,
} from "react-native"
import { useRouter } from "expo-router"
import Ionicons from "@expo/vector-icons/Ionicons"
import { Skeleton } from "moti/skeleton"
import { XStack } from "tamagui"

import { buildFileUrl } from "../../utils/buildUrl"
import CustomImage from "../CustomImage"

export enum CATEGORY {
    BREAKFAST = "BREAKFAST",
    LAUNCH = "LAUNCH",
    DINNER = "DINNER",
    SNACK = "SNACK",
}

export interface Recipe {
    id: string
    name: string
    duration: number
    description: string
    ingredients: string[]
    images: string[]
    category: CATEGORY
    steps: string[]
    likes: RecipeLike[]
    bookmarks: Bookmark[]
    createdAt: string // Assuming the datetime is represented as a string for simplicity
    updatedAt: string
    deleted: boolean
}

export interface RecipeLike {
    id: string
    userId: string
}

export interface Bookmark {
    id: string
    userId: string
}
const { width: screenWidth } = Dimensions.get("window")


const RecipeItem = ({ recipe }: { recipe: Recipe }) => {
    const router = useRouter()
    const { id, name, duration, category, likes, images } = recipe

    const handleGoToDetail = () => {
        router.push(`recipes/${id}`)
    }
    return (
        <TouchableWithoutFeedback onPress={handleGoToDetail}>
            <View style={styles.cardContainer}>
                <CustomImage
                    src={buildFileUrl(images[0].repo, images[0].key)}
                    alt={name}
                    width={"100%"}
                    height={200}
                />
                <View style={styles.detailsContainer}>
                    <Text style={styles.title}>{name}</Text>
                    <Text style={styles.duration}>{duration} mins</Text>
                    <Text style={styles.category}>{category}</Text>
                    {likes?.length > 0 && (<XStack space={2} style={styles.likesContainer} alignItems="center"> 
   
                            <Text style={styles.likes}>
                                {likes.length.toLocaleString('en-US',{
                                      notation: 'compact',
                                      maximumFractionDigits: 1
                                })} 
                            </Text>
                            <Ionicons
                            name={"heart-outline"}
                            size={20}
                            color={"black"}
                        />
                    </XStack>
                      )}
                </View>
            </View>
        </TouchableWithoutFeedback>
    )
}

export const RecipeSkeleton = () => {
    return (
        <View style={styles.cardContainer}>
            <Skeleton height={200} width={"100%"} colorMode="light" />
            <View style={styles.detailsContainer}>
               <XStack  space={'$3'}>
               <Skeleton height={20} width={"100%"} colorMode="light" />
                <Skeleton height={20} width={"100%"} colorMode="light" />
                <Skeleton
                    height={20}
                    width={"100%"}
                    colorMode="light"
                   
                />
               </XStack>
                <XStack space={2} style={styles.likesContainer}>
                    <Skeleton
                        height={20}
                        width={40}
                        colorMode="light"
                        radius="round"
                    />
                    <Skeleton
                        height={20}
                        width={40}
                        colorMode="light"
                        radius="round"
                    />
                </XStack>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: "white",
        borderRadius: 8,
        overflow: "hidden",
        marginBottom: 16,
        elevation: 3,
        marginHorizontal: 3,
        minWidth: screenWidth / 1.7,
    },
    image: {
        height: 150,
        width: "100%",
    },
    detailsContainer: {
        padding: 12,
    },
    title: {
        fontSize: 15,
        fontWeight: "bold",
        marginBottom: 8,
    },
    duration: {
        fontSize: 14,
        color: "#555",
        marginBottom: 4,
    },
    category: {
        fontSize: 14,
        color: "#555",
    },
    likesContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
        marginTop: 8,
    },
    likes: {
        color: "#555",
    },
})

export { RecipeItem }
const img2 =
    "https://food.fnr.sndimg.com/content/dam/images/food/fullset/2013/11/25/0/FNK_pan-seared-salmon-with-kale-apple-salad_s4x3.jpg.rend.hgtvcom.1280.960.suffix/1387918756116.jpeg"
const image =
    "https://frommybowl.com/wp-content/uploads/2020/01/One_Pot_Pasta_Vegetables_Vegan_FromMyBowl-10.jpg"
export const mockRecipes = [
    {
        id: "1",
        name: "Spaghetti Bolognese",
        duration: 30,
        description:
            "Classic Italian pasta dish with meat sauce, Classic Italian pasta dish with meat sauce, Classic Italian pasta dish with meat sauce.Classic Italian pasta dish with meat sauce",
        ingredients: [
            {
                id: "1",
                name: "Spaghetti",
                imageUrl: image,
            },
            {
                id: "2",
                name: "Ground beef",
                imageUrl: image,
            },
            {
                id: "3",
                name: "Spaghetti",
                imageUrl: image,
            },
            {
                id: "4",
                name: "Tomato sauce",
                imageUrl: image,
            },
            {
                id: "5",
                name: "Onions",
                imageUrl: image,
            },
            {
                id: "6",
                name: "Garlic",
                imageUrl: image,
            },
        ],
        nutrients: [
            {
                name: "Protien",
                value: 240,
                unit: "g",
            },
            {
                name: "carbs",
                value: 100,
                unit: "g",
            },
            {
                name: "Fat",
                value: 350,
                unit: "g",
            },
            {
                name: "Vitamins",
                value: 100,
                unit: "g",
            },
        ],
        images: [image, img2, image],
        category: CATEGORY.BREAKFAST,
        steps: [
            "Classic Italian pasta dish with meat sauce, Classic Italian pasta dish with meat sauce, ",
            "Classic Italian pasta dish with meat sauce, Classic Italian pasta dish with meat sauce, Classic Italian pasta dish with meat sauce, Classic Italian pasta dish with meat sauce, ",
            "Classic Italian pasta dish with meat sauce, Classic Italian pasta dish with meat sauce,Classic Italian pasta dish with meat sauce, Classic Italian pasta dish with meat sauce,  ",
            "Classic Italian pasta dish with meat sauce, Classic Italian pasta dish with meat sauce, ",
        ],
        likes: [
            { userId: "user_id_1", id: "6879239483" },
            { userId: "user_id_2", id: "dsfhieu9087678" },
        ],
    },
    // Add more recipes here...
    {
        id: "2",
        name: "Chicken Stir-Fry",
        duration: 25,
        description: "Quick and delicious stir-fried chicken with vegetables.",
        ingredients: [
            "Chicken breast",
            "Bell peppers",
            "Broccoli",
            "Soy sauce",
        ],
        images: [image],
        category: CATEGORY.BREAKFAST,
        steps: [
            "Cut chicken into strips",
            "Stir-fry with veggies",
            "Add soy sauce",
            "Serve",
        ],
        likes: [
            { userId: "user_id_3", id: "425367849hjfkj" },
            { userId: "user_id_1", id: "36874fghfjdi" },
        ],
    },
    {
        id: "3",
        name: "Chicken Noodles",
        duration: 25,
        description: "Quick and delicious stir-fried chicken with vegetables.",
        ingredients: [
            "Chicken breast",
            "Bell peppers",
            "Broccoli",
            "Soy sauce",
        ],
        images: [image],
        category: CATEGORY.BREAKFAST,
        steps: [
            "Cut chicken into strips",
            "Stir-fry with veggies",
            "Add soy sauce",
            "Serve",
        ],
        likes: [
            { userId: "user_id_3", id: "425367849hjfkj" },
            { userId: "user_id_1", id: "36874fghfjdi" },
        ],
    },
    // Add more recipes here...
]
