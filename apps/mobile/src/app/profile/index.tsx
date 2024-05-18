import { useRef, useState } from "react"
import {
    Linking,

    StyleSheet,
    TouchableOpacity,
} from "react-native"
import {  useRouter } from "expo-router"
import {  Octicons } from "@expo/vector-icons"
import { type ViewStyle } from "@tamagui/core"
import FontAwesomIcon from "@expo/vector-icons/FontAwesome"

import { Skeleton } from "moti/skeleton"
import {
    Avatar,
    Card,
    CardHeader,
    Text,
    View,
    XStack,
    YStack,
} from "tamagui"

import CustomImage from "../../components/CustomImage"
import { Colors } from "../../constants/colors"
import { api } from "../../utils/api"
import { HealthVitalsCard } from "../../components/healthVitalsCard"


const Profile = () => {
    const router = useRouter()

   
    const { data: profileData, isLoading } = api.auth.getProfile.useQuery()




    const goToTopUp = () => {
        router.push("/profile/plans")
    }

    const goToSettings = () => {
        router.push("/profile/settings")
    }


    if (isLoading) {
        return (
            <View px={"$4"} py={"$3"} flex={1}>
                <Skeleton colorMode="light" height={"100%"} width={"100%"} />
            </View>
        )
    }

    const goBack = () => router.back()


    return (
        <>
            {profileData && (
                <View flex={1} px={"$4"} mt={"$4"}>
                    <XStack justifyContent="space-between" alignItems="center">
                    <TouchableOpacity   style={[styles.btn, styles.configBtn]}
                            onPress={goBack} >
                            <FontAwesomIcon size={20} name="chevron-left" color={Colors.light.primary} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.btn, styles.configBtn]}
                            onPress={goToSettings}
                        >
                            <Octicons name="gear" size={24}  color={Colors.light.primary} />
                        </TouchableOpacity>
                        
                    </XStack>
                    <View alignSelf="center">
                        <Text
                            fontSize={"$5"}
                            fontWeight={"bold"}
                        >{`${profileData.firstname}   ${profileData.lastname}`}</Text>
                    </View>
                    <XStack alignItems="center" gap={"$3"}>
                        <YStack gap="$1" px={"$1"}>
                            <Avatar circular size="$6">
                                <Avatar.Image
                                    accessibilityLabel="Cam"
                                    src={profileData?.imageUrl as string}
                                />
                                <Avatar.Fallback backgroundColor="$blue10" />
                            </Avatar>
                        </YStack>

                        <YStack gap="$1" px={"$1"} alignItems="center">
                            <Text fontWeight={"bold"} fontSize={20}>
                                {" "}
                                {profileData.wallet?.point}{" "}
                            </Text>
                            <Text fontWeight={"bold"} fontSize={13}>
                                Points
                            </Text>
                        </YStack>
                        <YStack gap="$1" px={"$1"} alignItems="center">
                            <Text fontWeight={"bold"} fontSize={20}>
                                5{" "}
                            </Text>
                            <Text fontWeight={"bold"} fontSize={13}>
                                Achievments
                            </Text>
                        </YStack>
                        <YStack gap="$1" px={"$1"} alignItems="center">
                            <Octicons name="verified" size={24} color="black" />
                            <Text
                                fontWeight={"bold"}
                                wordWrap="break-word"
                                fontSize={13}
                            >
                                Verified
                            </Text>
                        </YStack>
                    </XStack>
                    {/* <XStack mt={"$3"} gap={"$2"} width={"100%"}>
                        <Button
                            width={"100%"}
                            bg="black"
                            onPress={goToTopUp}
                            color={"white"}
                            style={styles.btn}
                        >
                            My Plans
                        </Button>
                    </XStack> */}
                    <Card mt={"$3"}>
                        <CardHeader>
                            <Text fontWeight={"bold"} fontSize={"$6"}>
                                {" "}
                                Your Vitals
                            </Text>

                        </CardHeader>
                        <HealthVitalsCard onVitalsData={function (vitals: { [key: string]: any }): void {
                            throw new Error("Function not implemented.")
                        } } />
                    </Card>

                  
                </View>
            )}
        </>
    )
}

export default Profile

export const ResourceItem = ({
    resource,
    ...rest
}: { resource: any } & ViewStyle) => {
    const openWebView = async () => {
        const url = resource.url
        const isSupported = await Linking.canOpenURL(url)
        if (isSupported) {
            await Linking.openURL(url)
        }
    }
    return (
        <View borderWidth="$0" mr={"$3"} py={"$1"} {...rest}>
            <TouchableOpacity onPress={openWebView}>
                <CustomImage
                    src={buildFileUrl(resource.image.repo, resource.image.key)}
                    resizeMode="cover"
                    height={120}
                    style={{ borderRadius: 10 }}
                    width={"100%"}
                    alt={resource.title}
                />
                <View py={"$4"}>
                    <Text
                        fontSize={"$5"}
                        color={Colors.light.text}
                        fontWeight={"500"}
                    >
                        {resource.title}
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    btn: {
        height: 40,
    },
    configBtn: {
        alignContent: "center",
        justifyContent: "center",
        paddingHorizontal: 10,
    },
})
