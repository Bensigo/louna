import { useEffect, useState } from "react"
import { AspectRatio, Box, Skeleton } from "@chakra-ui/react"
import axios from "axios"

const CustomVideo = ({
    src,
    alt,
    width,
    height,
}: {
    src: string
    alt: string
    isRounded?: boolean
    width: number | string
    height: number | string
}) => {
    const [isLoading, setIsLoading] = useState(true)
    const [videoSrc, setVideoSrc] = useState("")

    useEffect(() => {
        const loadVideo = async () => {
            try {
                const response = await axios.get(src)
                console.log({ response })
                setVideoSrc(response.data)
            } catch (error) {
                console.error("Error loading video:", error)
            } finally {
                setIsLoading(false)
            }
        }

        loadVideo()
    }, [src])

    return (
        <Skeleton isLoaded={!isLoading} height={height} width={width}>
            {/* <AspectRatio  maxW="100%" position={'relative'} > */}
                <iframe
                    title={alt}
                    src={videoSrc}
                    width="100%"
                    height="100%"
                    allowFullScreen
                    
                />
            {/* </AspectRatio> */}
        </Skeleton>
    )
}

export default CustomVideo

