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
import { BiArrowBack } from "react-icons/bi"

import { api } from "~/utils/api"
import { buildFileUrlV2 } from "~/utils/getFileurl"
import CustomVideo from "~/shared/CustomVideo"
import CustomImage from "~/shared/CustomImage"

const SMWDetailWrapper = () => {
    const { query, replace } = useRouter()
    const id = query.id as string
    const pathname = usePathname()
    const toast = useToast()

    const { data: smw, isLoading } = api.smw.get.useQuery({ id })
    const { mutate: publish, isLoading: isSubmiting } =
        api.smw.publish.useMutation()
    const ctx = api.useUtils()

    const handleEdit = () => {
        replace(`${pathname}/edit`)
    }

    const handlePublishSmw = () => {
        if (id) {
            publish(
                {
                    id,
                },
                {
                    onSuccess: () => {
                        toast({
                            title: "Success",
                            description: !smw?.isPublished
                                ? "SMW Publish"
                                : "SMW Unpublish",
                            status: "success",
                            duration: 9000,
                            isClosable: true,
                        })
                        ctx.smw.get.refetch({ id })
                    },
                },
            )
        }
    }

    const goBack = () => replace("/dashboard/smw")
    const videoUrlBuild = `${smw?.videoRepo}/${smw?.videoKey}`

    return (
        <>
            <Skeleton isLoaded={!isLoading}>
                {smw && (
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

                                <Button
                                    size="sm"
                                    colorScheme="aplhaBalck"
                                    variant={"outline"}
                                    onClick={handleEdit}
                                >
                                    Edit
                                </Button>
                            </Box>
                            <AspectRatio width={'100%'} ratio={16 / 9}>
                                <CustomVideo
                                    src={buildFileUrlV2(videoUrlBuild)}
                                    alt={smw.title}
                                    width={"100%"}
                                    height={'100%'}
                                />
                            </AspectRatio>
                            <Heading fontSize="2xl" mt={3}>{smw.title}</Heading>
                            <Stack spacing={6} mt={4}>
                                <HStack>
                                   <HStack spacing={2}>
                                        <CustomImage
                                           height={50}
                                           width={50}
                                           alt={smw.instructor.firstname}
                                           rounded={'full'}
                                           src={buildFileUrlV2(`${smw.instructor.repo}/${smw.instructor.imageKey}`)}
                                        />
                                        <Stack>
                                        <Text fontSize={"sm"} color={"gray.700"}>
                                {smw.instructor.firstname}  {smw.instructor.lastname}
                            </Text>
                            <Tag colorScheme="green">
                                            {smw.instructor.category}
                                        </Tag>
                                        </Stack>
                                   </HStack>
                             
                                </HStack>
                                <HStack justifyContent={"space-between"}>
                                    <HStack>
                                        <Tag
                                            colorScheme={
                                                smw.isPublished
                                                    ? "green"
                                                    : "red"
                                            }
                                        >
                                            Published:{" "}
                                            {smw.isPublished ? "true" : "false"}
                                        </Tag>
                                        <Tag colorScheme="green">
                                            {smw.contentType}
                                        </Tag>
                                        <Tag colorScheme="green">
                                            {smw.category}
                                        </Tag>
                                    </HStack>

                                    <Button onClick={handlePublishSmw} isLoading={isSubmiting}>
                                        {smw.isPublished
                                            ? "Unpublish"
                                            : "Publish"}
                                    </Button>
                                </HStack>
                            </Stack>
                            <HStack spacing={1} my={3}>
                                {smw.subCategories.map((category, index) => (
                                    <Tag key={index} colorScheme="blue">
                                        {category}
                                    </Tag>
                                ))}
                            </HStack>
                            <Text fontSize={"md"} color={"gray.700"}>
                                {smw.description}
                            </Text>
                        </Container>
                    </>
                )}
            </Skeleton>
        </>
    )
}

export { SMWDetailWrapper }
