import React from "react"
import NextLink from "next/link"
import { usePathname } from "next/navigation"
import { useRouter } from "next/router"
import {
    Badge,
    Box,
    Button,
    HStack,
    IconButton,
    Image,
    Text,
    useToast,
    VStack,
} from "@chakra-ui/react"

import { buildFileUrl } from "~/utils/getFileurl"
import CustomImage from "~/shared/CustomImage"


interface Recipe {
    id: string
    name: string
    duration: number
    calories: number
    description: string
    images: { key: string; repo: string }[]
    mealType: string
    isApproved: boolean
    dietType: string
    categories: string[]
}

const RecipeCard: React.FC<{ recipe: Recipe }> = ({ recipe }) => {
    const {
        slug,
        name,
        duration,
        calories,
        description,
        images,
        mealType,
        dietType,
    } = recipe

    const { replace } = useRouter()
    const pathname = usePathname()



    const goToDetail = () => {
        replace(`${pathname}/${slug}`)
    }

    return (
        <Box
            boxShadow={"sm"}
            borderRadius="lg"
            overflow="hidden"
            pb={2}
            height={'100%'}
            width={250}
        >
            {images && images.length > 0 ? (
                <CustomImage
                    objectPosition={"center"}
                    src={buildFileUrl(images[0].repo, images[0].key)}
                    alt={images[0].key}
                    width={"100%"}
                    height={"150px"}
                />
            ) : (
                <Image
                    src={'/dummy-image-1.jpeg'}
                    alt="dummy-img"
                    width={'100%'}
                    height={'150px'}
                />
            )}
            <Box px={4}>
                <VStack mt={3} spacing={2} align="start">
                    <Text fontSize="lg" fontWeight="semibold">
                        {name}
                    </Text>
                    <HStack align="center" flexFlow={"wrap"} spacing={3}>
                        <Badge
                            colorScheme="orange"
                            borderRadius="md"
                            fontSize={"x-small"}
                            px={2}
                            py={1}
                        >
                            {mealType}
                        </Badge>
                        <Badge
                            colorScheme="orange"
                            borderRadius="md"
                            px={2}
                            py={1}
                            fontSize={"x-small"}
                        >
                            {dietType}
                        </Badge>
                    </HStack>
                    <Text fontSize="xs">{description.slice(0, 100)}...</Text>
                </VStack>

                <HStack mt={3} spacing={2}>
                    <Badge
                        colorScheme="green"
                        fontSize={"x-small"}
                        borderRadius="md"
                        px={2}
                        py={1}
                    >
                        {duration} mins
                    </Badge>
                    <Badge
                        colorScheme="green"
                        fontSize={"x-small"}
                        borderRadius="md"
                        px={2}
                        py={1}
                    >
                        {calories} Kcal
                    </Badge>
                </HStack>
            </Box>
            <Box
                my={2}
                px={4}
                display={"flex"}
                width={"100%"}
                alignItems={"center"}
                justifyContent={"space-between"}
            >
                <Button _hover={{
                     bg: '#dda044',
                     color: "white"
                }} variant={"outline"} onClick={goToDetail} color='#dda044' w={"100%"} borderColor={'#dda044'}>
                    View
                </Button>
            </Box>
        </Box>
    )
}

export default RecipeCard
