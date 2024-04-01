import React, { useEffect } from "react"
import {
    Redirect,
    Tabs,
    usePathname,
    useRootNavigation,
    useRouter,
} from "expo-router"
import { SignedIn, useAuth } from "@clerk/clerk-expo"
// import Ionicons from "@expo/vector-icons/Ionicons"
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useAsyncStorage } from "@react-native-async-storage/async-storage"

import { PostLoadingSekeleton } from "../../components/community/post"
import { api } from "../../utils/api"
import { useColorScheme } from "react-native"
import { Colors } from "../../constants/colors"
import { CustomTabBar } from "../../components/CustomTabbar"






const HAS_SET_USER_PREF = "HAS_SET_USER_PREF"


const TabBarIcon = (props: { name: React.ComponentProps<typeof Ionicons>['name'], color: string}) => {
    return <Ionicons size={28} style={{ marginBottom: -3 }} {...props} />
}




const TabScreenLayout = () => {
    const { isSignedIn } = useAuth()
    const router = useRouter()
    const rootNav = useRootNavigation()
    const { getItem: hasSetPref } = useAsyncStorage(HAS_SET_USER_PREF)
    const colorScheme = useColorScheme();


    const { data: user, isLoading } = api.auth.getProfile.useQuery()
 



    useEffect(() => {
        
        if (isSignedIn && user) {
            if (!user.hasPref) {
                router.replace("(onboarding)")
            }
        }
        return () => {}
    }, [isSignedIn, hasSetPref, rootNav, router, user])

    if (isLoading) {
        return (
            <>
                <PostLoadingSekeleton />
                <PostLoadingSekeleton />
                <PostLoadingSekeleton />
            </>
        )
    }

    if (!isSignedIn) {
        return <Redirect href={"login"} />
    }

    return (
        <SignedIn>
            <Tabs
                initialRouteName="community"
            
                screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
                   tabBarItemStyle: {
                      backgroundColor: 'transparent'
                   }
                }}
                sceneContainerStyle={{
                    backgroundColor: "transparent",
                }}
                tabBar={(props) =>  <CustomTabBar {...props}/>}
                
            >
                <Tabs.Screen
                    name="home"
                    options={{
                        tabBarLabel: "Home",
                        tabBarIcon: ({ color }) => ( <TabBarIcon name={'home-outline'} color={color} />),
                    }}
                ></Tabs.Screen>
                <Tabs.Screen
                    name="recipes"
                    options={{
                        tabBarLabel: "Recipes",
                        tabBarIcon: ({ color }) => (
                            
                            <MaterialCommunityIcons name="food-takeout-box-outline" size={28} color={color} />
                        ),
                    }}
                ></Tabs.Screen>
                <Tabs.Screen
                    name="community"
                    options={{
                        tabBarLabel: "Community",
                        tabBarHideOnKeyboard: true,
                        tabBarIcon: ({ color }) => ( <TabBarIcon name={"people-outline"} color={color} />),
                    }}
                ></Tabs.Screen>
                <Tabs.Screen
                    name="bookings"
                    options={{
                        tabBarLabel: "Bookings",
                        tabBarIcon: ({ color }) => ( <TabBarIcon name={"calendar-outline" } color={color} />),

                    }}
                ></Tabs.Screen>
                <Tabs.Screen
                    name="profile"
                    options={{
                        tabBarLabel: "Profile",
                        tabBarIcon: ({ color }) => ( <TabBarIcon name={'person-outline'} color={color} />),
                    }}
                ></Tabs.Screen>
            </Tabs>
        </SignedIn>
    )
}

export default TabScreenLayout
