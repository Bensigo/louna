import {
    type GetServerSidePropsContext,
    type InferGetServerSidePropsType,
} from "next"
import {
    Box,
    Container,
    Heading,
    HStack,
    Stack,
    Tag,
    Text,
} from "@chakra-ui/react"
import { createServerSideHelpers } from "@trpc/react-query/server"
import { format } from "date-fns"
import superjson from "superjson"

import { appRouter, type RouterOutputs } from "@solu/api"
import { prisma } from "@solu/db"

import { buildFileUrl } from "~/utils/getFileurl"
import Footer from "~/components/Footer"
import Navbar from "~/components/Navbar"
import SEO from "~/components/SEO"
import SoluAd from "~/components/SoluAd"
import CustomImage from "~/shared/CustomImage"

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { params } = context
    const slug = params?.slug as string

    const helper = createServerSideHelpers({
        router: appRouter,
        ctx: {
            prisma,
            headers: {
                'x-secret': process.env.X_SECRET
              }
        },
        transformer: superjson,
    })

    const data = await helper.recipe.getBySlug.fetch({ slug })
    if (data) {
        const serializedRecipe = {
            ...data,
            createdAt: data.createdAt.toISOString(),
            updatedAt: data.updatedAt.toISOString(),
            likes: data.likes.map((like) => ({
                ...like,
                createdAt: like.createdAt.toISOString(),
                updatedAt: like.updatedAt.toISOString(),
            })),
        }

        const seoData = {
            title: `Recipe - ${data?.name}`,
            description: data?.description,
            keywords: `recipes, food, cooking, ${data?.ingredients
                .join(", ")
                .toLowerCase()},${data?.dietType.toLowerCase()}`,
            author: "Solu",
            ogTitle: `Recipes for ${data.name}`,
            ogDescription: `Discover our best recipes for ${data?.dietType.toLowerCase()}.`,
            ogImage: "https://example.com/default-recipe-image.jpg",
            ogUrl: `https://solu.ae/recipes/${slug}`,
            twitterCard: "summary_large_image",
            twitterTitle: `Recipes for ${data?.name}`,
            twitterDescription: `Find the best recipes for ${data?.dietType.toLowerCase()}.`,
            twitterImage: "https://example.com/default-recipe-image.jpg",
            twitterSite: "@solu",
        }

        return {
            props: {
                slug,
                seoData,
                recipe: serializedRecipe,
            },
        }
    }

    return {
        props: {
            slug,
        },
    }
}

type Props = InferGetServerSidePropsType<typeof getServerSideProps>
export type Recipe = NonNullable<RouterOutputs["recipe"]["getRecipe"]>

const Recipe: React.FC<Props> = ({ seoData, recipe }) => {

    if (!recipe){
        return (
            <>
                <Container>
                    <Text>Recipe not found</Text>
                </Container>
            </>
        )
    }

    return (
        <>
            <SEO {...seoData} />
            <Navbar />
            <Container maxW="container.xl" p={{ base: 4, md: 8 }}>
                <Stack spacing={6}>
                    <HStack justifyContent={"space-between"} flexWrap={{ base: "wrap", md: "nowrap" }}>
                        <HStack>
                            <Heading color="#dda044" fontSize={{ base: "x-large", md: 'xx-large'}}>{recipe?.name}</Heading>
                        </HStack>
                    </HStack>
                    <HStack mt={4} flexWrap={{ base: "wrap", md: "nowrap" }}>
                        <Text fontWeight={500} color={"gray.600"}>
                            Created at:{" "}
                            {format(new Date(recipe?.createdAt), "dd-MM-yy hh:mm")}{" "}
                        </Text>
                        <Text fontWeight={500} color="gray.600">
                            Updated at:{" "}
                            {format(new Date(recipe?.updatedAt) , "dd-MM-yy hh:mm")}{" "}
                        </Text>
                    </HStack>
                    <HStack spacing={1} overflowX={"auto"}>
                        {recipe?.images.map((image, index) => (
                            <CustomImage
                                key={index}
                                src={buildFileUrl(image.repo, image.key)}
                                alt={recipe?.images[0].key}
                                width="250px"
                                height="250px"
                            />
                        ))}
                    </HStack>

                    <Box>
                        <HStack align="center" spacing={2} flexWrap={{ base: "wrap", md: "nowrap" }}>
                            <Tag colorScheme="orange" mr={2}>
                                {recipe?.mealType}
                            </Tag>
                            <Tag colorScheme="orange">{recipe?.dietType}</Tag>
                            <Tag colorScheme="orange">
                                {recipe?.calories} Kal
                            </Tag>
                            <Tag colorScheme="orange">
                                {recipe?.duration} mins
                            </Tag>
                            <Tag colorScheme="orange">{recipe?.cuisine}</Tag>
                            <Tag colorScheme="orange">{recipe?.difficulty}</Tag>
                        </HStack>

                        <Box my={4}>
                            <HStack spacing={4} flexWrap={{ base: "wrap", md: "nowrap" }}>
                                {recipe?.nutrients.map((nutrient, index) => (
                                    <Box
                                        py={1}
                                        px={2}
                                        width={100}
                                        key={index}
                                        bg="orange.100"
                                        color="orange.700"
                                        borderRadius={"md"}
                                        shadow={"sm"}
                                        mb={{ base: 2, md: 0 }}
                                    >
                                        <Stack
                                            alignItems={"center"}
                                            spacing={0}
                                        >
                                            <Text
                                                fontSize={"md"}
                                                fontWeight={"bold"}
                                            >
                                                {" "}
                                                {nutrient?.value}{" "}
                                                {nutrient.unit}
                                            </Text>
                                            <Text fontSize={"small"}>
                                                {" "}
                                                {nutrient?.name}
                                            </Text>
                                        </Stack>
                                    </Box>
                                ))}
                            </HStack>

                            <Stack mt={4}>
                                <Heading fontSize="md">Categories:</Heading>
                                <HStack spacing={1} flexWrap={{ base: "wrap", md: "nowrap" }}>
                                    {recipe?.categories.map(
                                        (category, index) => (
                                            <Tag
                                                key={index}
                                                colorScheme="blue"
                                                wordBreak={"break-word"}
                                            >
                                                {category}
                                            </Tag>
                                        ),
                                    )}
                                </HStack>
                            </Stack>
                        </Box>

                        <Stack mt={4}>
                            <Heading fontSize="md">Ingredients:</Heading>
                            <HStack spacing={5} flexWrap={"wrap"}>
                                {recipe?.ingredients.length &&
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
                                                alignItems={"center"}
                                                justifyContent={"center"}
                                                key={index}
                                            >
                                                <Box>
                                                    <CustomImage
                                                        alt="heh"
                                                        height={"40px"}
                                                        width={"40px"}
                                                        src={buildFileUrl(
                                                            ingredient?.image
                                                                .repo,
                                                            ingredient?.image
                                                                .key,
                                                        )}
                                                    />
                                                    <Text
                                                        textAlign={"center"}
                                                        fontSize={"small"}
                                                        color={"orange.700"}
                                                    >
                                                        {ingredient?.name}
                                                    </Text>
                                                </Box>
                                            </Box>
                                        ),
                                    )}
                            </HStack>
                        </Stack>
                    </Box>
                    <Box my={4}>
                        <Heading fontSize="md" color="#dda044">Description:</Heading>
                        <Text fontSize="md">{recipe?.description}</Text>
                    </Box>
                    <Stack mt={6}>
                        <Heading fontSize="md" color="#dda044">Steps:</Heading>
                        <Stack spacing={2} pl={4}>
                            {recipe?.steps.map((step, index) => (
                                <Box key={index}>
                                    <Text fontSize={"lg"} fontWeight={"bold"} color="#dda044">
                                        Step {index + 1}
                                    </Text>
                                    <Text fontWeight={500}>{step}</Text>
                                </Box>
                            ))}
                        </Stack>
                    </Stack>
                </Stack>
                <Box py={8}>
                    <SoluAd />
                </Box>
            </Container>

            <Footer />
        </>
    )
}

export default Recipe
