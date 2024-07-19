import React, { useEffect, useRef, useState } from "react"
import {  ResizeMode, Video } from "expo-av"
import { FontAwesome5 } from "@expo/vector-icons"
import { View as AnimationView } from "moti"
import { Skeleton } from "moti/skeleton"
import { useLocalSearchParams } from "expo-router";
import { View, Text, YStack, H4, ScrollView } from "tamagui";

import { api } from "../../../../../utils/api";
import { buildFileUrlV2 } from "../../../../../utils/buildUrl"
import { useCustomTabbar } from "../../../../../context/useCustomTabbar"
import ReadMoreCollapsible from "../../../../../components/collapable"
import { Colors } from "../../../../../constants/colors"


const ResourceDetailScreen = () => {
    const { id } = useLocalSearchParams()
    const { hideTabBar, showTabBar } = useCustomTabbar()
    const [videoDuration, setVideoDuration] = useState<number>(0)

  
    const [shouldPlay, setShouldPlay] = useState(false)

    useEffect(() => {
        hideTabBar()
        return () => {
            showTabBar()
        }
    }, [])


    const {data, isLoading } = api.resource.get.useQuery({
        id
    })

    const handleStart = () => {
        setShouldPlay(true)
    }

    if (isLoading) {
        return (
            <View flex={1} px={"$4"}>
                <Skeleton height={300} colorMode="light" width={"100%"} />
                <View mt={"$2"} px={"$4"} mb={"$2"}>
                    <Skeleton height={24} colorMode="light" width={"100%"} />
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
            
                <View flex={1}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        flex={1}
                        pb={"$4"}
                    >
                        <CustomVideo
                            src={buildFileUrlV2(
                                `${data?.videoUrl}`,
                            )}
                            autoPlay={shouldPlay}
                            onDurationChange={setVideoDuration}
                        />
                        <View mt={"$2"} px={"$4"} mb={"$2"}>
                            <H4 fontSize={"$7"}>{data?.title}</H4>
                            <YStack gap={"$3"} mt={"$3"}>
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
               
                </View>
         
   
       </View>
    )
}

export default ResourceDetailScreen;










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
                    
                    useNativeControls={true}
                    focusable
                />
            </AnimationView>
        )
    }

    return null
}