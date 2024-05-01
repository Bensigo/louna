import React, { useEffect, useRef, useState } from "react"
import { AVPlaybackStatus, ResizeMode, Video } from "expo-av"
import { useLocalSearchParams, usePathname, useRouter } from "expo-router"
import { FontAwesome5 } from "@expo/vector-icons"
import { View as AnimationView } from "moti"
import { Skeleton } from "moti/skeleton"
import { Button, H1, H4, ScrollView, Text, View, XStack, YStack } from "tamagui"

import ReadMoreCollapsible from "../../../collapable"
import CustomImage from "../../../CustomImage"
import { useCustomTabbar } from "../../../../context/useCustomTabbar"
import { api } from "../../../../utils/api"
import { buildFileUrlV2 } from "../../../../utils/buildUrl"

type CustomVidProps = {
    src: string
    autoPlay?: boolean
    onDurationChange?: (duration: number) => void
}

const CustomVideo: React.FC<CustomVidProps> = ({
    src,
    autoPlay,
    onDurationChange,
}) => {
    const [isLoading, setIsLoading] = useState(true)
    const [vidSrc, setVidSrc] = useState<string | null>(null)

    const videoRef = useRef<Video>()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        const getVidUrl = async () => {
            try {
                const response = await fetch(src)

                if (response.ok) {
                    const videoUrl: string = await response.json()
                    setVidSrc(videoUrl)
                }
            } catch (error) {
                console.error("Error loading video:", error)
            } finally {
                setIsLoading(false)
            }
        }

        getVidUrl()
        return () => {}
    }, [src])

  

    if (isLoading) {
        return  <Skeleton height={300} colorMode="light" width={"100%"} />
    }

    if (vidSrc) {
        return (
            <AnimationView
                style={{ flex: 1 }}
                from={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ type: "timing", duration: 700 }}
            >
                <Video
                    source={{ uri: vidSrc }}
                    ref={videoRef}
                    style={{ height: 300 }}
                    resizeMode={ResizeMode.CONTAIN}
                    shouldPlay={autoPlay ? true : false} // Start playing the video
                    onLoad={() => {
                        if (autoPlay) {
                            videoRef?.current?.presentFullscreenPlayer()
                        }
                    }}
                    onPlaybackStatusUpdate={(status) => {
                        const durationInMinutes = Math.floor(
                            status?.durationMillis / 60000,
                        )
                        if (durationInMinutes && onDurationChange) {
                            onDurationChange(durationInMinutes)
                        }
                    }}
                    useNativeControls={autoPlay ? true : false}
                    focusable
                />
            </AnimationView>
        )
    }

    return null
}

const SmwDetail = () => {
    const { id } = useLocalSearchParams()
    const { hideTabBar, showTabBar } = useCustomTabbar()
    const [videoDuration, setVideoDuration] = useState<number>(0)

    const [countdown, setCountdown] = useState(3)
    const [start, setStart] = useState(false)
    const [shouldPlay, setShouldPlay] = useState(false)

    useEffect(() => {
        hideTabBar()
        return () => {
            showTabBar()
        }
    }, [])

    useEffect(() => {
        if (countdown === 0) {
            setStart(false)
            setShouldPlay(true)
        }
    }, [countdown])

    const { isLoading, data } = api.smw.get.useQuery({
        id,
    })

    const handleStart = () => {
        setStart(true)
        let timer = setInterval(() => {
            setCountdown((prevCount) => prevCount - 1)
        }, 1000)
        setTimeout(() => {
            clearInterval(timer)
        }, 4000) // Set the countdown duration
    }

    if (isLoading) {
        return (
            <View flex={1} px={"$4"}>
                <Skeleton height={300} colorMode="light" width={"100%"} />
                <View mt={"$2"} px={"$4"} mb={"$2"}>
                    <Skeleton height={24} colorMode="light" width={"100%"} />
                    <View
                        flexDirection="row"
                        alignItems="center"
                        my={"$2"}
                        gap={"$2"}
                    >
                        <Skeleton
                            radius="round"
                            height={40}
                            colorMode="light"
                            width={"100%"}
                        />
                        <Skeleton
                            radius="square"
                            height={20}
                            colorMode="light"
                            width={"100%"}
                        />
                    </View>
                    <YStack gap={"$3"} mt={"$3"}>
                        <View
                            flexDirection="row"
                            alignItems="center"
                            gap={"$3"}
                        >
                            <Skeleton
                                radius="round"
                                height={20}
                                colorMode="light"
                                width={"100%"}
                            />

                            <Skeleton
                                radius="square"
                                height={20}
                                colorMode="light"
                                width={"100%"}
                            />
                        </View>
                        <View
                            flexDirection="row"
                            alignItems="center"
                            gap={"$3"}
                        >
                            <Skeleton
                                radius="round"
                                height={20}
                                colorMode="light"
                                width={"100%"}
                            />

                            <Skeleton
                                radius="square"
                                height={20}
                                colorMode="light"
                                width={"100%"}
                            />
                        </View>
                        <Skeleton
                            radius="square"
                            height={70}
                            colorMode="light"
                            width={"100%"}
                        />
                    </YStack>
                </View>
            </View>
        )
    }

    return (
        <View style={{ flex: 1 }}>
            {!start && (
                <View flex={1}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        flex={1}
                        pb={"$4"}
                    >
                        <CustomVideo
                            src={buildFileUrlV2(
                                `${data?.videoRepo}/${data?.videoKey}`,
                            )}
                            autoPlay={shouldPlay}
                            onDurationChange={setVideoDuration}
                        />
                        <View mt={"$2"} px={"$4"} mb={"$2"}>
                            <H4 fontSize={"$7"}>{data?.title}</H4>
                            <View
                                flexDirection="row"
                                alignItems="center"
                                my={"$2"}
                                gap={"$2"}
                            >
                                <CustomImage
                                    src={buildFileUrlV2(
                                        `${data?.instructor.repo}/${data?.instructor.imageKey}`,
                                    )}
                                    alt={"profile"}
                                    width={40}
                                    height={40}
                                    style={{ borderRadius: 25 }}
                                />
                                <Text>{`${data?.instructor.firstname} ${data?.instructor.lastname}`}</Text>
                            </View>
                            <YStack gap={"$3"} mt={"$3"}>
                                <View
                                    flexDirection="row"
                                    alignItems="center"
                                    gap={"$3"}
                                >
                                    <FontAwesome5 size={16} name="running" />

                                    <Text>{data?.category}</Text>
                                </View>
                                <View
                                    flexDirection="row"
                                    alignItems="center"
                                    gap={"$3"}
                                >
                                    <FontAwesome5 size={16} name="clock" />

                                    <Text>{videoDuration} mins</Text>
                                </View>
                                <ReadMoreCollapsible
                                    text={data?.description}
                                    len={280}
                                />
                            </YStack>
                        </View>
                    </ScrollView>
                    <Button
                        bg="black"
                        color="white"
                        bottom="$0"
                        right="$1"
                        left="$1"
                        marginHorizontal="$4"
                        onPress={handleStart}
                        style={{ position: "absolute" }}
                    >
                        Start
                    </Button>
                </View>
            )}
            {start && (
                <View
                    style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <H1 fontSize={40} color="black">
                        {countdown}
                    </H1>
                </View>
            )}
        </View>
    )
}

export default SmwDetail
