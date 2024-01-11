import { FlatList, ImageBackground, StyleSheet } from "react-native"
import Ionicons from "@expo/vector-icons/Ionicons"
import {
    Card,
    H3,
    H4,
    Image,
    Input,
    ListItemSubtitle,
    SizableText,
    Tabs,
    Text,
    View,
    XStack,
    YStack,
} from "tamagui"

import { api } from "../../../utils/api"
import  { mockRecipes , RecipeItem } from "../../../components/recipeItem"








const meals = ["Breakfast", "Lunch", "Snack", "Dinner"]

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
                <Tabs defaultValue="Breakfast" flexDirection="column" mt="$2">
                    <Tabs.List space="$1" mb="$2">
                        {meals.map((meal) => (
                            <Tabs.Tab value={meal} key={meal}>
                                <SizableText fontSize={"$3"}>
                                    {meal}
                                </SizableText>
                            </Tabs.Tab>
                        ))}
                    </Tabs.List>
                    <Tabs.Content value="Breakfast" display="flex" mb={20}>
                        <FlatList
                            data={mockRecipes}
                            keyExtractor={(item) => item.id}
                            scrollEnabled
                            scrollToOverflowEnabled
                            initialNumToRender={15}
                            renderItem={({ item  }) =>
                             <RecipeItem 
                                name={item.name}
                                images={item.images}
                                category={item.category}
                                likes={item.likes}
                                id={item.id}
                                duration={item.duration}
                             />}
                        />
                    </Tabs.Content>
                  
                </Tabs>
            </View>
        </View>
    )
}

export default Recipe


const image =
    "https://frommybowl.com/wp-content/uploads/2020/01/One_Pot_Pasta_Vegetables_Vegan_FromMyBowl-10.jpg"
      