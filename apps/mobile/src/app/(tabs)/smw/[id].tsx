import { useEffect, useState } from "react"
import { ResizeMode, Video } from "expo-av"
import { useLocalSearchParams, useRouter } from "expo-router"
import { Skeleton } from "moti/skeleton"
import { Button, H4, H5, ScrollView, Text, View, XStack, YStack } from "tamagui"

import CustomImage from "~/components/CustomImage"
import { useCustomTabbar } from "~/context/useCustomTabbar"
import { api } from "../../../utils/api"
import { buildFileUrlV2 } from "../../../utils/buildUrl"
import { useWindowDimensions } from "react-native"
import ReadMoreCollapsible from "~/components/collapable"

type CustomVidProps = {
    src: string

    width: number | string
    height: number | string
}

const CustomVideo: React.FC<CustomVidProps> = ({ width, height, src }) => {
    const [isLoading, setIsLoading] = useState(true)
    const [vidSrc, setVidSrc] = useState<string | null>(null)

    useEffect(() => {
        const getImgUrl = async () => {
            try {
                const response = await fetch(src)

                if (response.ok) {
                    const img: string = await response.json()
                    setVidSrc(img)
                }
            } catch (error) {
                console.error("Error loading image:", error)
            } finally {
                setIsLoading(false)
            }
        }

        getImgUrl()
        return () => {}
    }, [src])

    if (isLoading) {
        return <Skeleton height={height} width={width} />
    }

    return (
        <View height={height}>
            <>
                {vidSrc && (
                    <Video
                        source={{ uri: vidSrc }}
                        style={[{ width: width, height: height }]}
                        resizeMode={ResizeMode.COVER}
                        shouldPlay={false}
                        useNativeControls
                    />
                )}
            </>
        </View>
    )
}

const SmwDetail = () => {
    const { id } = useLocalSearchParams()
    const { width: DEVICE_WIDTH } = useWindowDimensions()

    const router = useRouter()
    const { hideTabBar, showTabBar } = useCustomTabbar()

    useEffect(() => {
        hideTabBar()
        return () => {
            showTabBar()
        }
    }, [])

    const { isLoading, data } = api.smw.get.useQuery({
        id,
    })

    if (isLoading) {
        return <Skeleton height={400} colorMode="light" width={"100%"} />
    }

    return (
        <View flex={1}>
            <ScrollView showsVerticalScrollIndicator={false} flex={1}>
                <CustomVideo
                    height={250}
                    width={"100%"}
                    src={buildFileUrlV2(`${data?.videoRepo}/${data?.videoKey}`)}
                />
                <View mt={"$2"} px={"$4"} mb={'$2'}>
                    <H4 fontSize={"$7"}>{data?.title}</H4>

                    <View
                        width={80}
                        py={"$1.5"}
                        borderColor={"black"}
                        borderRadius={5}
                        borderWidth={1}
                    >
                        <Text alignSelf="center">{data?.category}</Text>
                    </View>
                    <ReadMoreCollapsible  text={data?.description} len={300}></ReadMoreCollapsible>
                    {/* <Text fontWeight={"$3"} lineHeight={"$3"}>
                        {data?.description}
                    </Text> */}

                    <View mt={"$4"}>
                        <H5>Coach</H5>
                        <YStack gap={"$2"} alignSelf="flex-start">
                            <CustomImage
                                src={buildFileUrlV2(
                                    `${data?.instructor.repo}/${data?.instructor.imageKey}`,
                                )}
                                alt={"profile"}
                                width={50}
                                height={50}
                                style={{ borderRadius:25 }}
                            />
                            <Text>
                                {data?.instructor.firstname}{" "}
                                {data?.instructor.lastname}
                            </Text>
                            
                            <ReadMoreCollapsible  text={data?.instructor.bio} len={70}></ReadMoreCollapsible>
                        </YStack>
                    </View>
                </View>
            </ScrollView>
           
            <Button
                bg="black"
                color="white"
                bottom="$1"
                right="$3"
                left="$3"
                marginHorizontal="$4"
                style={{
                    position: "absolute",
                   
                   
                }}
            >
                Finish
            </Button>
           
        </View>
    )
}

export default SmwDetail
