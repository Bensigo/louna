import { useEffect, useState } from "react"
import { Linking } from "react-native"
import { useLocalSearchParams, usePathname, useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { Skeleton } from "moti/skeleton"
import {
    Button,
    Card,
    H3,
    H4,
    H6,
    ScrollView,
    Text,
    useWindowDimensions,
    View,
    XStack,
    YStack,
} from "tamagui"

import Carousel from "../../../../../components/carousel"
import { api } from "../../../../../utils/api"
import MapWithInfo from "../../../../../components/mapview"
import { useCustomTabbar } from "../../../../../context/useCustomTabbar"
import ReadMoreCollapsible from "../../../../../components/collapable"



const PartnerDetail = () => {
    const router = useRouter()
    const pathname = usePathname()
    const { id, date } = useLocalSearchParams()
    const { width: SCREEN_WIDTH } = useWindowDimensions()

    const { hideTabBar, showTabBar } = useCustomTabbar()

    useEffect(() => {
        hideTabBar()
        return () => {
            showTabBar()
        }
    }, [hideTabBar, showTabBar])


  
    const { data: partner, isLoading } = api.partner.get.useQuery({ id: id as string , date: new Date(date) })


    if (isLoading) {
        return <Skeleton height={"100%"} width={"100%"} colorMode="light" />
    }

    const goBack = () => {
        router.back()
    }

    const opentel = async () => {
        if (partner){
            const isSupported = await Linking.canOpenURL(
                `tel:${partner.phone}`,
            )
            if (isSupported) {
                await Linking.openURL(`tel:${partner.phone}`)
            }
        }
     
    }

    const openUrl = async (url: string) => {
        const isSupported = await Linking.canOpenURL(url)
      
        if (isSupported) {
            await Linking.openURL(url)
        }
    }

    const goToSession = () => {
        router.push({
            pathname: `/bookings/list/${id}/sessions`,
            params: {
                date
            }
        })
    }
  

    

    return (
        <View flex={1}>
            {partner && (
                <ScrollView py={3} showsVerticalScrollIndicator={false}>
                    <Carousel
                        data={partner.images}
                        width={SCREEN_WIDTH}
                        isLike={false}
                        height={300}
                        onBackPress={goBack}
                        onLike={() => {}}
                        isLikePress={false}
                    />
                    <View px={'$4'}>
                        <H3 >{partner.name}</H3>
                        {/* <Text  color={'$gray10'} fontSize={'$5'}>{session.title}</Text> */}
                        <Card py={"$3"}>
                            <H4>About</H4>
                            <ReadMoreCollapsible text={partner.bio} />
                            <Card
                                borderWidth={"$0.25"}
                                my={"$2"}
                                py={"$4"}
                                px={'$2'}
                                borderColor={"$gray10"}
                            >
                                <H6 fontWeight={"bold"}>Amenities</H6>
                                <View
                                    flexWrap="wrap"
                                    flexDirection="row"
                                    flex={1}
                                >
                                    {partner.amenities.map(
                                        (item, i) => (
                                            <XStack key={i} mr={"$9"} py={"$2"}>
                                                <Ionicons name="checkmark" />
                                                <Text ml={"$1"}>{item}</Text>
                                            </XStack>
                                        ),
                                    )}
                                </View>
                            </Card>
                        </Card>
                        <Card py={"$3"} >
                            <H4>Contact</H4>
                            <XStack
                                justifyContent="space-between"
                                my="$2"
                                onPress={opentel}
                            >
                                <Text fontSize={"$5"}>
                                    {partner.phone}
                                </Text>
                                <Ionicons size={20} name="call-outline" />
                            </XStack>
                            <XStack
                                justifyContent="space-between"
                                my="$2"
                                onPress={() =>
                                    openUrl(
                                        partner.socials?.filter(
                                            (item) =>
                                                item.name.toLowerCase() ===
                                                "instagram",
                                        )[0].url,
                                    )
                                }
                            >
                                <Text fontSize={"$5"}>Instagram</Text>
                                <Ionicons size={20} name="logo-instagram" />
                            </XStack>
                        </Card>
                    </View>
                    <Card px={'$4'} >
                        <MapWithInfo latitude={partner.addresses[0].lat} longitude={partner.addresses[0].lng} info={partner.addresses[0].name} />
                    </Card>
                </ScrollView>
            )}
            {partner && (
                <Button mx={'$3'} my={'$1'} bg={'black'} onPress={goToSession} >
                    <Text color={'white'}>View Sessions</Text>
                </Button>
            )}
        </View>
    )
}

export default PartnerDetail
