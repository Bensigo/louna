import { usePathname } from "next/navigation"
import { useRouter } from "next/router"
import {
    Box,
    Button,
    Container,
    Heading,
    HStack,
    Skeleton,
    Stack,
    Tag,
    Text,
    useToast,
} from "@chakra-ui/react"
import { format } from "date-fns"
import { BiArrowBack } from "react-icons/bi"

import { api } from "~/utils/api"
import { buildFileUrl } from "~/utils/getFileurl"
import CustomImage from "~/shared/CustomImage"

const RecipeDetailWrapper = () => {
    const { query, replace } = useRouter()
    const pathname = usePathname()
    const id = query.id

    const { data: recipe, isLoading } = api.recipe.get.useQuery({ id })
    const toast = useToast()
    const { mutate: publish } = api.recipe.toggleApproval.useMutation()
    const ctx = api.useUtils()
    console.log({ recipe })

    const handleEdit = () => {
        replace(`${pathname}/edit`)
    }

    const handlePublishRecipe = () => {
        if (id) {
            publish(
                {
                    id,
                },
                {
                    onSuccess: () => {
                        toast({
                            title: "Success",
                            description: !recipe?.isApproved
                                ? "Recipe Publish"
                                : "Recipe Unpublish",
                            status: "success",
                            duration: 9000,
                            isClosable: true,
                        })
                        ctx.recipe.get.refetch({ id })
                    },
                },
            )
        }
    }

    const goBack = () => replace("/dashboard/recipes")
    return (
        <>
            <Box>
                <Skeleton isLoaded={!isLoading}>
                    {recipe && !isLoading && (
                        <Container maxW="container.lg" py={8}>
                            <Box
                                display={"flex"}
                                justifyContent={"space-between"}
                                py={4}
                            >
                                <Button
                                    onClick={goBack}
                                    leftIcon={<BiArrowBack />}
                                >
                                    Back
                                </Button>

                                <Button
                                    size="sm"
                                    colorScheme="aplhaBalck"
                                    variant={"outline"}
                                    onClick={handleEdit}
                                >
                                    Edit
                                </Button>
                            </Box>
                            <Stack spacing={6}>
                                <HStack justifyContent={"space-between"}>
                                    <HStack>
                                        <Heading fontSize="2xl">
                                            {recipe.name}
                                        </Heading>
                                        <Tag
                                            colorScheme={
                                                recipe.isApproved
                                                    ? "green"
                                                    : "red"
                                            }
                                        >
                                            Approved:{" "}
                                            {recipe.isApproved
                                                ? "true"
                                                : "false"}
                                        </Tag>
                                        <Tag colorScheme="green">{recipe.contentType}</Tag>
                                    </HStack>

                                    <Button onClick={handlePublishRecipe}>
                                        {recipe.isApproved
                                            ? "Unpublish"
                                            : "Publish"}
                                    </Button>
                                </HStack>

                                <HStack mt={4}>
                                    <Text fontWeight={500} color={"gray.600"}>
                                        Created at:{" "}
                                        {format(
                                            recipe.createdAt,
                                            "dd-MM-yy hh:mm",
                                        )}{" "}
                                    </Text>
                                    <Text fontWeight={500} color="gray.600">
                                        Updated at:{" "}
                                        {format(
                                            recipe.updatedAt,
                                            "dd-MM-yy hh:mm",
                                        )}{" "}
                                    </Text>
                                </HStack>
                                <HStack spacing={1} overflowX={"auto"}>
                                    {recipe.images.map((image, index) => (
                                        <CustomImage
                                            key={index}
                                            src={buildFileUrl(
                                                image.repo,
                                                image.key,
                                            )}
                                            alt={recipe.images[0].key}
                                            width="250px"
                                            height="250px"
                                        />
                                    ))}
                                </HStack>

                                <Box>
                                    <HStack align="center" spacing={2}>
                                        <Tag colorScheme="orange" mr={2}>
                                            {recipe.mealType}
                                        </Tag>
                                        <Tag colorScheme="orange">
                                            {recipe.dietType}
                                        </Tag>
                                        <Tag colorScheme="orange">
                                            {recipe.calories} Kal
                                        </Tag>
                                        <Tag colorScheme="orange">
                                            {recipe.duration} mins
                                        </Tag>
                                        <Tag colorScheme="orange">
                                            {recipe.cuisine} 
                                        </Tag>
                                        <Tag colorScheme="orange">
                                            {recipe.difficulty} 
                                        </Tag>
                                    </HStack>

                                    <Box my={4}>
                                       
                                        <HStack spacing={4} >
                                            {recipe.nutrients.map(
                                                (nutrient, index) => (
                                                    <Box
                                                        py={1}
                                                        px={2}
                                                        width={100}
                                                        key={index}
                                                        bg="orange.100"
                                                        color='orange.700'
                                                        borderRadius={'md'}
                                                        shadow={'sm'}
                                                    >
                                                       
                                                       <Stack alignItems={'center'} spacing={0}>
                                                        <Text  fontSize={'md'} fontWeight={'bold'} > {nutrient.value}  {nutrient.unit}</Text>
                                                        <Text fontSize={'small'} > {nutrient.name}</Text>
                                                       </Stack>
                                                      
                                                    </Box>
                                                ),
                                            )}
                                        </HStack>

                                        <Stack mt={4}>
                                            <Heading fontSize="md">
                                                Categories:
                                            </Heading>
                                            <HStack spacing={1} >
                                                {recipe.categories.map(
                                                    (category, index) => (
                                                        <Tag
                                                            key={index}
                                                            colorScheme="blue"
                                                        
                                                            wordBreak={'break-word'}
                                                        >
                                                            {category}
                                                        </Tag>
                                                    ),
                                                )}
                                            </HStack>
                                        </Stack>
                                    </Box>

                                   

                                    <Stack mt={4}>
                                        <Heading fontSize="md">
                                            Ingredients:
                                        </Heading>
                                        <HStack
                                            spacing={5}
                                     
                                            flexFlow={"wrap"}
                                        >
                                            {recipe.ingredients.length &&
                                                recipe?.ingredients?.map(
                                                    (ingredient, index) => (
                                                        <Box
                                                            width={"80px"}
                                                            height={"80px"}
                                                            bg={"orange.300"}
                                                            borderRadius={"md"}
                                                            my={3}
                                                            display="flex"
                                                            flexDir="column"
                                                            alignItems={
                                                                "center"
                                                            }
                                                            justifyContent={
                                                                "center"
                                                            }
                                                            key={index}
                                                        >
                                                            <Box>
                                                                <CustomImage
                                                                    alt="heh"
                                                                    height={
                                                                        "40px"
                                                                    }
                                                                    width={
                                                                        "40px"
                                                                    }
                                                                    src={buildFileUrl(
                                                                        ingredient
                                                                            .image
                                                                            .repo,
                                                                        ingredient
                                                                            .image
                                                                            .key,
                                                                    )}
                                                                />
                                                                <Text
                                                                    textAlign={
                                                                        "center"
                                                                    }
                                                                    fontSize={
                                                                        "small"
                                                                    }
                                                                    color={
                                                                        "orange.700"
                                                                    }
                                                                >
                                                                    {
                                                                        ingredient.name
                                                                    }
                                                                </Text>
                                                            </Box>
                                                        </Box>
                                                    ),
                                                )}
                                        </HStack>
                                    </Stack>
                                </Box>
                                <Box my={4}>
                                        <Heading fontSize="md">
                                            Description:
                                        </Heading>
                                        <Text fontSize="md">
                                            {recipe.description}
                                        </Text>
                                    </Box>
                                <Stack mt={6}>
                                    <Heading fontSize="md">Steps:</Heading>
                                    <Stack spacing={2} pl={4}>
                                        {recipe.steps.map((step, index) => (
                                            <Box key={index}>
                                                <Text
                                                    fontSize={"lg"}
                                                    fontWeight={"bold"}
                                                >
                                                    Step {index + 1}
                                                </Text>
                                                <Text fontWeight={500}>
                                                    {step}
                                                </Text>
                                            </Box>
                                        ))}
                                    </Stack>
                                </Stack>
                            </Stack>
                            <Stack mt={4}>
                                            <Heading fontSize="md">
                                                Tags:
                                            </Heading>
                                            <HStack spacing={1} >
                                                {recipe.tags.map(
                                                    (tag, index) => (
                                                        <Tag
                                                            key={index}
                                                            colorScheme="blue"
                                                            
                                                            wordBreak={'break-word'}
                                                        >
                                                            {tag}
                                                        </Tag>
                                                    ),
                                                )}
                                            </HStack>
                                        </Stack>
                        </Container>
                    )}
                </Skeleton>
            </Box>
        </>
    )
}

export { RecipeDetailWrapper }
