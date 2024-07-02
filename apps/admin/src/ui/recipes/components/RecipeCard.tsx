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
import { BiTrash } from "react-icons/bi"

import { api } from "~/utils/api"
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
        id,
        name,
        duration,
        calories,
        description,
        isApproved,
        images,
        mealType,
        dietType,
        categories,
    } = recipe

    const { replace } = useRouter()
    const pathname = usePathname()

    const toast = useToast()
    const { mutate: Delete, isLoading: isDeleteing } =
        api.recipe.delete.useMutation()
    const ctx = api.useUtils()

    const handleDelete = () => {
        Delete(
            {
                id,
            },
            {
                onSuccess: () => {
                    toast({
                        title: "Deleted",
                        description: "Recipe Deleted",
                        status: "success",
                        duration: 9000,
                        isClosable: true,
                    })
                    ctx.recipe.list.refetch()
                },
                onError: (err) => {
                    toast({
                        title: "Error",
                        description: err.message,
                        status: "error",
                        duration: 9000,
                        isClosable: true,
                    })
                },
            },
        )
    }

    const goToDetail = () => {
        replace(`${pathname}/${id}`)
    }

    return (
        <Box
            boxShadow={"sm"}
            borderRadius="lg"
            overflow="hidden"
            pb={2}
            height={420}
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
                        <Badge
                            colorScheme={isApproved ? "green" : "red"}
                            borderRadius="md"
                            px={2}
                            py={1}
                            fontSize={"x-small"}
                        >
                            Approved: {String(isApproved)}
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
                <Button variant={"outline"} onClick={goToDetail} w={"80%"}>
                    View
                </Button>
                <IconButton
                    size={"sm"}
                    isLoading={isDeleteing}
                    onClick={handleDelete}
                    icon={<BiTrash />}
                    colorScheme="red"
                    aria-label={"delete-btn"}
                />
            </Box>
        </Box>
    )
}

export default RecipeCard
