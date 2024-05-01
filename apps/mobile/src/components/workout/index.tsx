import React from "react"
import {
    FlatList,
    ImageBackground,
    SectionList,
    Text,
    TouchableHighlight,
    TouchableWithoutFeedback,
} from "react-native"
import { usePathname, useRouter } from "expo-router"
import { Avatar, H3, View, XStack } from "tamagui"

import { api } from "../../utils/api"
import { styles } from "./styles"

// Define types for sections and items
type Section = {
    title: string
    data: Item[]
}

type Item = {
    name: string
    image: any // assuming you have image paths
}

// Data for sections and items
const data = [
    {
        title: "Cardio",
        data: [
            {
                id: 1,
                name: "Cycling",
                image: require("../../../../assets/yoga-woman.jpg"),
            },
            {
                id: 2,
                name: "Running",
                image: require("../../../../assets/group-yoga.jpg"),
            },
            {
                id: 3,
                name: "Dancing",
                image: require("../../../../assets/group-workout.jpg"),
            },
            {
                id: 4,
                name: "HIIT",
                image: require("../../../../assets/group-pilates.jpg"),
            },
        ],
    },
    {
        title: "Strength",
        data: [
            {
                id: 5,
                name: "Strength Core",
                image: require("../../../../assets/workout-c.jpg"),
            },
            {
                id: 6,
                name: "Strength Butt",
                image: require("../../../../assets/yoga-woman.jpg"),
            },
            {
                id: 7,
                name: "Strength Upper Body",
                image: require("../../../../assets/group-yoga.jpg"),
            },
        ],
    },
    {
        title: "Flexibility",
        data: [
            {
                id: 8,
                name: "Yoga",
                image: require("../../../../assets/yoga-woman.jpg"),
            },
            {
                id: 9,
                name: "Pilates",
                image: require("../../../../assets/group-pilates.jpg"),
            },
        ],
    },
    {
        title: "Mind",
        data: [
            {
                id: 10,
                name: "Meditation",
                image: require("../../../../assets/group-yoga.jpg"),
            },
            {
                id: 11,
                name: "Sound Healing",
                image: require("../../../../assets/yoga-woman.jpg"),
            },
            {
                id: 12,
                name: "Sleeping Sound",
                image: require("../../../../assets/group-pilates.jpg"),
            },
        ],
    },
]

// Item component
const ItemComponent = ({ name, image }: Item) => {
    const pathname = usePathname()
    const router  = useRouter()
    const gotToCategory = () => {
        router.replace({
            pathname: `workout/name`,
            params: {
                category: name.toLowerCase()
            }
        })
    }
    return (
        <TouchableHighlight onPress={gotToCategory}>
            <ImageBackground source={image} style={styles.card}>
                <Text style={styles.cardText}>{name}</Text>
            </ImageBackground>
        </TouchableHighlight>
    )
}

// Main component
const FitnessScreen = () => {
    const router = useRouter()
    const { isLoading: isLoadingProfile, data: profile } =
        api.auth.getProfile.useQuery()

    const goToProfile = () => {
        router.push("/profile")
    }

    return (
        <View flex={1} style={styles.container}>
            <XStack justifyContent="space-between" alignItems="center">
                <H3 fontSize={"$9"} fontWeight={"$15"}>
                    Workouts
                </H3>
                <XStack gap={"$4"} alignItems="center">
                    <TouchableWithoutFeedback onPress={goToProfile}>
                        <Avatar circular size="$3">
                            {!isLoadingProfile && profile && (
                                <Avatar.Image src={profile?.imageUrl} />
                            )}
                            <Avatar.Fallback bc="$blue3" />
                        </Avatar>
                    </TouchableWithoutFeedback>
                </XStack>
            </XStack>
            <SectionList
                sections={data}
                showsVerticalScrollIndicator={false}
                keyExtractor={( item, i ) => `${item.id}-${i}`}
                renderItem={() => null}
                renderSectionHeader={({ section }) => {
                    return (
                        <View>
                            <Text style={styles.sectionHeader}>
                                {section.title}
                            </Text>
                            <FlatList
                                data={section.data}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                keyExtractor={(item, i) => `${item.id}-${i}`}
                                renderItem={({ item }) => (
                                    <ItemComponent {...item} />
                                )}
                            />
                        </View>
                    )
                }}
            />
        </View>
    )
}

export default FitnessScreen
