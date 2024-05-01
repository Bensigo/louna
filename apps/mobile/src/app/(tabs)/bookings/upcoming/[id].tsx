import { useEffect, useState } from "react"
import { ActivityIndicator, Alert, Linking, useWindowDimensions } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { format } from "date-fns"
import { Skeleton } from "moti/skeleton"
import {
    Button,
    Card,
    Checkbox,
    H3,
    H4,
    H6,
    ScrollView,
    Sheet,
    Text,
    View,
    XStack,
    YStack,
} from "tamagui"

import MapWithInfo from "~/components/mapview"
import Carousel from "../../../../components/carousel"
import ReadMoreCollapsible from "../../../../components/collapable"
import { useCustomTabbar } from "../../../../context/useCustomTabbar"
import { api } from "../../../../utils/api"

const BookingDetailScreen = () => {
    const { id } = useLocalSearchParams()
    const { hideTabBar, showTabBar } = useCustomTabbar()
    const [showCancelSheet, setShowCancelSheet] = useState(false)
    const router = useRouter()
    const { width: SCREEN_WIDTH } = useWindowDimensions()
    const { data, isLoading } = api.booking.get.useQuery({ id })

    const { mutate: cancelBooking, isLoading: isCanceling } = api.booking.cancel.useMutation({})

    useEffect(() => {
        hideTabBar()
        return () => {
            showTabBar()
        }
    }, [hideTabBar, showTabBar])

    const goBack = () => {
        router.back()
    }

    const opentel = async () => {
        if (data?.session.partner) {
            const isSupported = await Linking.canOpenURL(
                `tel:${data.session.partner.phone}`,
            )
            if (isSupported) {
                await Linking.openURL(`tel:${data.session.partner.phone}`)
            }
        }
    }

    const openUrl = async (url: string) => {
        const isSupported = await Linking.canOpenURL(url)

        if (isSupported) {
            await Linking.openURL(url)
        }
    }

    const handleCancelSubmit = (reasons: string[]) => {
        // handle cancellation
        cancelBooking({
                id: id as string,
                reasons
        }, {
            onSuccess(){
                Alert.alert('Success', 'Booking cancelled', [
                    {
                        text: "Ok",
                        style: "default",
                        onPress: () => ( router.push('/bookings/upcoming')),
                    }
                ])
            },
            onError(err){
                Alert.alert('Error', err.message, [
                    {
                        text: "Cancel",
                        style: "cancel",
                        onPress: () => console.log('Cancel Pressed'),
                    }
                ])
            }
        })
    }

    

    return (
        <View flex={1}>
            {isLoading && (
                <View flex={1} px={"$4"} py={"$3"}>
                    <Skeleton
                        height={"100%"}
                        width={"100%"}
                        colorMode="light"
                    />
                </View>
            )}
            {data && (
                <ScrollView py={3} showsVerticalScrollIndicator={false}>
                    <Carousel
                        data={data.session.partner.images}
                        width={SCREEN_WIDTH}
                        isLike={false}
                        height={300}
                        onBackPress={goBack}
                        onLike={() => {}}
                        isLikePress={false}
                        showLike={false}
                    />
                    <View px={"$4"}>
                        <H3>{data.session.title}</H3>
                        <H3>
                            {format(data.session.startTime, "h:mm a")} -{" "}
                            {format(data.session.endTime, "h:mm a")}
                        </H3>
                        <Text color={"$gray10"} fontSize={"$5"}>
                            {" "}
                            {data.session.partner.name}
                        </Text>

                        <Card py={"$3"}>
                            <H4>About</H4>
                            <ReadMoreCollapsible
                                text={data.session.partner.bio}
                            />
                            <Card
                                borderWidth={"$0.25"}
                                my={"$2"}
                                py={"$4"}
                                px={"$2"}
                                borderColor={"$gray10"}
                            >
                                <H6 fontWeight={"bold"}>Amenities</H6>
                                <View
                                    flexWrap="wrap"
                                    flexDirection="row"
                                    flex={1}
                                >
                                    {data.session.partner.amenities.map(
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
                        <Card py={"$3"}>
                            <H4>Contact</H4>
                            <XStack
                                justifyContent="space-between"
                                my="$2"
                                onPress={opentel}
                            >
                                <Text fontSize={"$5"}>
                                    {data.session.partner.phone}
                                </Text>
                                <Ionicons size={20} name="call-outline" />
                            </XStack>
                            <XStack
                                justifyContent="space-between"
                                my="$2"
                                onPress={() =>
                                    openUrl(
                                        data.session.partner.socials?.filter(
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
                    <Card px={"$4"}>
                        {data.session.partner && data.session.partner.addresses.length > 0 && (
                            <MapWithInfo
                                latitude={data.session.partner.addresses[0].lat}
                                longitude={
                                    data.session.partner.addresses[0].lng
                                }
                                info={data.session.partner.addresses[0].name}
                            />
                        )}
                    </Card>
                </ScrollView>
            )}
            {data && (
                <Button
                    mx={"$3"}
                    my={"$1"}
                    bg={"black"}
                    onPress={() => setShowCancelSheet(true)}
                >
                    <Text color={"white"}>Cancel booking</Text>
                </Button>
            )}
            {showCancelSheet && (
                <CancelBookingSheet
                    onShow={setShowCancelSheet}
                    show={showCancelSheet}
                    isLoading={isCanceling}
                    onSubmit={handleCancelSubmit}
                />
            )}
        </View>
    )
}

export default BookingDetailScreen

const cancellationReasons = [
    "Too far from me",
    "Too expensive",
    "Something came up",
    "Saw something better",
    "Others",
]

const CancelBookingSheet = ({
    onShow,
    show,
    isLoading,
    onSubmit,
}: {
    onShow: (val: boolean) => void
    isLoading: boolean,
    show: boolean
    onSubmit: (reason: string[]) => void
}) => {
    const [selectedReasons, setSelectedReasons] = useState<string[]>([])

    const handleSubmit = () => {
        onSubmit(selectedReasons)
    }
    const toggleReason = (reason: string) => {
        setSelectedReasons((prev) => {
            if (prev.includes(reason)) {
                return prev.filter((item) => item !== reason)
            } else {
                return [...prev, reason]
            }
        })
    }

    return (
        <Sheet
            forceRemoveScrollEnabled={show}
            open={show}
            onOpenChange={onShow}
            dismissOnSnapToBottom
            snapPoints={[80, 50]}
            zIndex={100_000}
            animation="lazy"
        >
            <Sheet.Overlay
                animation="lazy"
                enterStyle={{ opacity: 0 }}
                exitStyle={{ opacity: 0 }}
            />
            <Sheet.Handle />
            <Sheet.Frame>
                <View flex={1} px={"$4"} py={"$3"}>
                    <Card px={"$3"} py="$2" bg={"$gray4"}>
                        <H4>Disclaimer</H4>
                        <Text>
                            Cancellation of booking can lead to loss of spent
                            credit.
                        </Text>
                        <View px="$2" py={"$2"}>
                            <Text fontSize={"$3"}>
                                1. Cancellation more than 24 hours get 100%
                                credit back
                            </Text>
                            <Text fontSize={"$3"}>
                                2. Cancellation 8 hours or more get 70% credit
                                back
                            </Text>
                            <Text fontSize={"$3"}>
                                3. Cancellation 2 hours or less get 0% credit
                                back
                            </Text>
                        </View>
                    </Card>
                    <View py="$2">
                        <H4>Cancellation Reason</H4>
                        <YStack gap={"$3"}>
                            {cancellationReasons.map((reason) => (
                                <View
                                    key={reason}
                                    flexDirection="row"
                                    alignItems="center"
                                >
                                    <Checkbox
                                        mr="$2"
                                        checked={selectedReasons.includes(
                                            reason,
                                        )}
                                        onPress={() => toggleReason(reason)}
                                    />
                                    <Text fontSize={"$4"}>{reason}</Text>
                                </View>
                            ))}
                        </YStack>
                    </View>
                    {selectedReasons.length > 0 && (
                        <Button my={"$1"} bg={"black"} onPress={handleSubmit}>
                           {isLoading ? 
                           <ActivityIndicator size={'small'}/>
                           : <Text color={"white"}>Cancel </Text>}
                        </Button>
                    )}
                </View>
            </Sheet.Frame>
        </Sheet>
    )
}
