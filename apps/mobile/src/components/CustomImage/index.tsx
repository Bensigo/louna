import React, { useEffect, useState } from "react"
import { Skeleton } from "moti/skeleton"
import { Image, View } from "tamagui"
import type {   ImageResizeMode, ImageStyle } from "react-native"

type CustomImageProps = {
    src: string
    alt: string
    style?: ImageStyle
    width: number | string
    height: number | string
    resizeMode?: ImageResizeMode
} 

const CustomImage: React.FC<CustomImageProps> = ({

    alt,
    width,
    height,
    src,
    resizeMode,
    style
}) => {
    const [isLoading, setIsLoading] = useState(true)
    const [imageSrc, setImageSrc] = useState<string | null>(null)

    useEffect(() => {
        const  getImgUrl = async () => {
            try {
                const response = await fetch(src)
              
                if (response.ok){
                    const img: string = await response.json()
                    setImageSrc(img)
              
                }
               
            } catch (error) {
                console.error("Error loading image:", error)
            }finally {
                setIsLoading(false)
            }

        }

        getImgUrl()
        return () => {}
    }, [src])



    if (isLoading ) {
        return <Skeleton height={height} width={width} />
    }



    return (
        // <View height={height} style={style}>
        <>
            {imageSrc && (
                  <Image
                  source={{ uri: imageSrc }}
                  alt={alt}
                  style={[{ width: width, height: height }, style]}
                  resizeMode={resizeMode ?? 'cover'}
                  
               
              />
            )}
            </>
        // </View>
    )
}


export default CustomImage
