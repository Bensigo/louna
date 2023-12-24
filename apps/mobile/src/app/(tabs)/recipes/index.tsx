import { ImageBackground } from "react-native"
import Ionicons from "@expo/vector-icons/Ionicons"
import {
    Card,
    H3,
    H4,
    Image,
    Input,
    SizableText,
    Tabs,
    Text,
    View,
    XStack,
    YStack,
} from "tamagui"

import { api } from "../../../utils/api"

const meals = ["Breakfast", "Launch", "Snack", "Dinner"]

const Recipe = () => {
    const { data: userPreference } = api.preference.getUserPreference.useQuery()

    return (
        <View flex={1} mb={"$3"} mt={"$5"} paddingHorizontal={"$3.5"}>
            <H3>Today&rsquo;s Recipes</H3>
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
                    borderWidth={0}
                />
                <Ionicons name="search-outline" size={20} />
            </XStack>

            <View mt="$4">
                <Tabs defaultValue="For You" flexDirection="column" mt="$2">
                    <Tabs.List space="$1" mb="$2">
                        {meals.map((meal) => (
                            <Tabs.Tab value={meal} key={meal}>
                                <SizableText fontSize={"$3"}>
                                    {meal}
                                </SizableText>
                            </Tabs.Tab>
                        ))}
                    </Tabs.List>
                    <Tabs.Content value="Breakfast">
                        <RecipeItem />
                       
                        
                    </Tabs.Content>
                </Tabs>
            </View>
        </View>
    )
}

export default Recipe

const recipeListMockData = [
    {
        id: "111fk",
        title: "",
        duration: 10,
        photoUrl: "",
        cursine: "Italian",
        mealType: "breakfast",
        likes: [],
    },
    {
        id: "111ffk",
        title: "",
        duration: 10,
        photoUrl: "",
        cursine: "Italian",
        mealType: "dinner",
        likes: [],
    },
    {
        id: "11rjj",
        title: "",
        duration: 12,
        photoUrl: "",
        cursine: "Italian",
        mealType: "breakfast",
        likes: [],
    },
    {
        id: "1166",
        title: "",
        duration: 15,
        photoUrl: "",
        cursine: "Italian",
        mealType: "breakfast",
    },
    {
        id: "114",
        title: "",
        duration: 10,
        photoUrl: "",
        cursine: "Italian",
        mealType: "breakfast",
        likes: [],
    },
    {
        id: "e11",
        title: "",
        duration: 10,
        photoUrl: "",
        cursine: "Italian",
        mealType: "lunch",
        likes: [],
    },
    {
        id: "111",
        title: "",
        duration: 30,
        photoUrl: "",
        cursine: "Italian",
        mealType: "dinner",
        likes: [],
    },
]

const image =
    "https://frommybowl.com/wp-content/uploads/2020/01/One_Pot_Pasta_Vegetables_Vegan_FromMyBowl-10.jpg"
const RecipeItem = () => {
    return (
        <Card height={250} elevate my={3}>
            <Card.Header padded>
                <XStack alignItems="center" alignSelf="flex-end">
                    <Text> 300</Text>
                    <Ionicons
                        name={"heart-outline"}
                        size={20}
                        color={"black"}
                    />
                </XStack>
            </Card.Header>
            <Card.Background>
                <Image
                    resizeMode="cover"
                    alt="food"
                    alignItems="center"
                    blurRadius={1}
                    source={{
                        uri: image,
                        width: "100%",
                        height: "60%",
                    }}
                />
            </Card.Background>
            <Card.Footer padded>
                <YStack space={5}>
                    <H4>tasty Pasta</H4>
                    <XStack
                        display="flex"
                        width={"100%"}
                        justifyContent="space-between"
                    >
                        <XStack space={5}>
                            <View
                                display="flex"
                                px={10}
                                justifyContent="center"
                                alignSelf="center"
                                backgroundColor={"$green10"}
                                height={40}
                                borderRadius={5}
                            >
                                <Text
                                    height={25}
                                    fontWeight={"bold"}
                                    textAlign="center"
                                    color="white"
                                >
                                    10 mins
                                </Text>
                            </View>
                            <View
                                display="flex"
                                px={10}
                                justifyContent="center"
                                alignSelf="center"
                                backgroundColor={"$green10"}
                                height={40}
                                borderRadius={5}
                            >
                                <Text
                                    height={25}
                                    fontWeight={"bold"}
                                    textAlign="center"
                                    color="white"
                                >
                                    Japanese
                                </Text>
                            </View>
                        </XStack>
                    </XStack>
                </YStack>
            </Card.Footer>
        </Card>
    )
}
