import { Redirect, Tabs, usePathname } from "expo-router"
import { SignedIn, useAuth } from "@clerk/clerk-expo"
import Ionicons from "@expo/vector-icons/Ionicons"
import { color } from "react-native-reanimated"

const hideTabbarRoute = [
    '/community/communityForum',
    // '/recipes/recipePreference'
]

const TabScreen = () => {
    const { isSignedIn } = useAuth()
    const path = usePathname()

    console.log({ path })

    if (!isSignedIn) {
        return <Redirect href={"login"} />
    }
    return (
        <SignedIn>
            <Tabs
                initialRouteName="community"
                
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: {
                        display: hideTabbarRoute.includes(path) ? 'none': 'flex',
                    },
                 
                }}
                sceneContainerStyle={{
                    backgroundColor: "transparent",
                
                }}
             
            >
                <Tabs.Screen
                    name="home"
                    options={{
                        tabBarLabel: "Home",
                        tabBarIcon: () => (
                            <Ionicons name="home-outline" size={30} />
                        ),
                    }}
                ></Tabs.Screen>
                <Tabs.Screen
                    name="recipes"
                    options={{
                        tabBarLabel: "Recipes",
                        tabBarIcon: () => (
                            <Ionicons name="fast-food-outline" size={30} />
                        ),
                    }}
                ></Tabs.Screen>
                <Tabs.Screen
                    name="community"
                    options={{
                        tabBarLabel: "Community",
                        tabBarHideOnKeyboard: true,
                        tabBarIcon: () => (
                            <Ionicons name="people-outline" size={30} />
                        ),
                    }}
                ></Tabs.Screen>
                <Tabs.Screen
                    name="bookings"
                    options={{
                        tabBarLabel: "Bookings",
                        tabBarIcon: () => (
                            <Ionicons name="calendar-outline" size={30} />
                        ),
                    }}
                ></Tabs.Screen>
                <Tabs.Screen
                    name="profile"
                    options={{
                        tabBarLabel: "Profile",
                        tabBarIcon: () => (
                            <Ionicons name="ios-woman-outline" size={30} />
                        ),
                    }}
                ></Tabs.Screen>
            </Tabs>
        </SignedIn>
    )
}

export default TabScreen
