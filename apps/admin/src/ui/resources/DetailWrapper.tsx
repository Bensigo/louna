import Link from "next/link"
import { usePathname } from "next/navigation"
import { useRouter } from "next/router"
import {
    AspectRatio,
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
import { BiArrowBack, BiLink } from "react-icons/bi"

import { api } from "~/utils/api"
import { buildFileUrlV2 } from "~/utils/getFileurl"
import CustomImage from "~/shared/CustomImage"
import CustomVideo from "~/shared/CustomVideo"

export const DetailResourcesWrapper = () => {
    const { query, replace } = useRouter()
    const id = query.id as string
    const pathname = usePathname()
    const toast = useToast()

    const { data: resource, isLoading } = api.resource.get.useQuery({ id })
    const { mutate: publish, isLoading: isSubmiting } =
        api.resource.publish.useMutation()
    const ctx = api.useUtils()

    const handleEdit = () => {
        replace(`${pathname}/edit`)
    }

    const handlePublish = () => {
        if (id) {
            publish(
                {
                    ids: [id],
                    type: resource?.isPublish ? "unPublish" : "Publish",
                },
                {
                    onSuccess: () => {
                        toast({
                            title: "Success",
                            description: !resource?.isPublish
                                ? "Resource Publish"
                                : "Resource Unpublish",
                            status: "success",
                            duration: 9000,
                            isClosable: true,
                        })
                        ctx.resource.get.invalidate()
                    },
                },
            )
        }
    }

    const goBack = () => replace("/dashboard/resources")

    return (
        <>
            <Skeleton isLoaded={!isLoading}>
                {resource && (
                    <>
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
                                <Stack
                                    display={"flex"}
                                    direction={"row"}
                                    alignItems={"center"}
                                >
                                    <Button
                                        onClick={handlePublish}
                                        isLoading={isSubmiting}
                                        variant={"outline"}
                                    >
                                        {resource.isPublish
                                            ? "Unpublish"
                                            : "Publish"}
                                    </Button>
                                    <Button
                                        size="sm"
                                        colorScheme="aplhaBalck"
                                        variant={"outline"}
                                        onClick={handleEdit}
                                    >
                                        Edit
                                    </Button>
                                </Stack>
                            </Box>
                            <AspectRatio width={"100%"} ratio={16 / 9}>
                                <CustomImage
                                    src={buildFileUrlV2(
                                        `${resource.image.repo}/${resource.image.key}`,
                                    )}
                                    alt={resource.title}
                                    width={"100%"}
                                    height={"100%"}
                                />
                            </AspectRatio>
                            <Heading fontSize="2xl" mt={3}>
                                {resource.title}
                            </Heading>
                           {resource.contentType === 'Video' && (
                            <>
                                 <Text my={2}>{resource.description}</Text>
                                 <AspectRatio width={'100%'} ratio={16 / 9}>
                                <CustomVideo
                                    src={buildFileUrlV2(resource.videoUrl)}
                                    alt={resource.title}
                                    width={"400px"}
                                    height={'200px'}
                                />
                            </AspectRatio>
                            </>
                           )}
                            <HStack spacing={1} my={3}>
                                {resource.tags.map((tag, index) => (
                                    <Tag key={index} colorScheme="blue">
                                        {tag}
                                    </Tag>
                                ))}
                            </HStack>
                            {resource.contentType === "Link" && (
                                <Tag colorScheme="green">
                                    <BiLink />
                                    <Link href={resource.url} target="_blank">
                                        {resource.url}
                                    </Link>
                                </Tag>
                            )}
                        </Container>
                    </>
                )}
            </Skeleton>
        </>
    )
}
