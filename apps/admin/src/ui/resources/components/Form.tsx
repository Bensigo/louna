import React, { useState } from "react"
import {
    Box,
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    Select,
    Stack,
    Tag,
    Textarea,
} from "@chakra-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"
import { BiSave } from "react-icons/bi"
import { z } from "zod"

import { MemoV2FileUplaod } from "~/shared/V2FileUpload"
import VideoUpload from "~/shared/VideoUpload"

const ResourceSchema = z.object({
    url: z.string().optional(),
    contentType: z.enum(["Link", "Video"]),
    title: z.string(),
    image: z.object({
        key: z.string(),
        repo: z.string(),
    }),
    tags: z.array(z.string()),
    description: z.string().optional(),
    videoUrl: z.string().optional(),
})

type ResourceType = z.infer<typeof ResourceSchema>

type ResourceFormProps = {
    onSubmit: (data: ResourceType) => void
    isSubmitting: boolean
    resource?: ResourceType & { id: string }
}

const resourceTags = [
    "low-stress",
    "moderate-stress",
    "high-stress",
    "meditation",
    "breathing-exercise",
    "time in nature",
    "exercise",
    "weight loss",
    "muscle tone",
    "endurance improvement",
    "stress relief",
    "mobility",
    "beginner",
    "intermediate",
    "advance",
    "no-time",
    "group-support",
    "18-25",
    "26-32",
    "33-37",
    "38-42",
    "43-51",
    "51-above",
]

const ResourceForm: React.FC<ResourceFormProps> = ({
    onSubmit,
    isSubmitting,
    resource,
}) => {
    const {
        handleSubmit,
        control,
        register,
        formState: { errors },
        setValue,
    } = useForm<ResourceType>({
        resolver: zodResolver(ResourceSchema),
        ...(resource ? { defaultValues: {...resource, contentType: resource.contentType} } : {}),
    })

    const [tags, setTags] = useState<string[]>(resourceTags)

    const image = useWatch({ name: "image", control })
    const contentType = useWatch({
        name: "contentType",
        control,
        defaultValue: resource?.contentType ?? "Link",
    })
    const seletedTags = useWatch({ name: "tags", control }) || []
    const title = useWatch({ name: "title", control })

   
    console.log({ contentType })

    const toggleTags = (category: string) => {
        const currentSubCategories = seletedTags.includes(category)
            ? seletedTags.filter((c) => c !== category)
            : [...seletedTags, category]
        setValue("tags", currentSubCategories)
    }

    const handleSubmitResource = (data: ResourceType) => {
        onSubmit(data)
    }

    const handleRemoveThumbnailImg = (key: string) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        setValue("image", {})
    }

    const handleAddNewThumbnailImage = React.useCallback(
        (key: string) => {
            setValue("image", { key, repo: "resource" })
        },
        [setValue],
    )

    const handleRemoveVideo = (key: string) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        setValue("videoUrl", null)
    }

    const handleAddNewVideo = React.useCallback(
        (key: string) => {
            setValue("videoUrl", `resources/${key}`)
        },
        [setValue],
    )

    return (
        <form onSubmit={handleSubmit(handleSubmitResource)}>
            <Stack spacing={3} width={"100%"} maxW={650} px={"auto"}>
                <FormControl isInvalid={!!errors.title}>
                    <FormLabel fontSize={"small"}>Title</FormLabel>
                    <Input {...register("title")} />
                    <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
                </FormControl>
                <FormControl>
                    <FormLabel fontSize={"x-small"}>Content type</FormLabel>
                    <Select
                        {...register("contentType")}
                        defaultValue={contentType}
                    >
                        <option value="Link">Link</option>
                        <option value="Video">Video</option>
                    </Select>
                </FormControl>
                {contentType === "Link" && (
                    <FormControl isInvalid={!!errors.url}>
                        <FormLabel fontSize={"small"}>URL</FormLabel>
                        <Input {...register("url")} />
                        <FormErrorMessage>
                            {errors.url?.message}
                        </FormErrorMessage>
                    </FormControl>
                )}

                {contentType === "Video" && (
                    <>
                        <FormControl isInvalid={!!errors.description}>
                            <FormLabel fontSize={"small"}>
                                Description
                            </FormLabel>
                            <Textarea {...register("description")} />
                            <FormErrorMessage>
                                {errors.description?.message}
                            </FormErrorMessage>
                        </FormControl>
                        <FormControl
                            mt={4}
                            isInvalid={!!errors.videoUrl}
                            my={5}
                        >
                            <FormLabel fontSize={"sm"}>Video</FormLabel>

                            <Box mt={5} height={"400px"} width={"450px"}>
                                <VideoUpload
                                    title={title}
                                    video={
                                        resource?.videoUrl && resource?.videoUrl
                                    }
                                    repo={"resources"}
                                    onRemove={handleRemoveVideo}
                                    onUpload={handleAddNewVideo}
                                />
                            </Box>
                            <FormErrorMessage>
                                {errors.videoUrl?.message}
                            </FormErrorMessage>
                        </FormControl>
                    </>
                )}

                {tags && (
                    <FormControl mt={4} isInvalid={!!errors.tags}>
                        <FormLabel fontSize={"sm"}>Categories</FormLabel>
                        <Stack spacing={2} direction="row" flexWrap="wrap">
                            {tags?.map((tag) => (
                                <Tag
                                    key={tag}
                                    size="lg"
                                    variant="solid"
                                    colorScheme={
                                        seletedTags.includes(tag)
                                            ? "green"
                                            : "gray"
                                    }
                                    cursor="pointer"
                                    onClick={() => toggleTags(tag)}
                                >
                                    {tag}
                                </Tag>
                            ))}
                        </Stack>
                        <FormErrorMessage>
                            {errors.tags?.message}
                        </FormErrorMessage>
                    </FormControl>
                )}
                <FormControl mt={4} isInvalid={!!errors.image} my={5}>
                    <FormLabel fontSize={"sm"}>Thumbnail</FormLabel>

                    <Box
                        borderRadius={20}
                        mt={5}
                        py={3}
                        height={"200px"}
                        width={"150px"}
                    >
                        <MemoV2FileUplaod
                            isRounded
                            alt={`thumbnail-image`}
                            file={image?.key && `${image.repo}/${image.key}`}
                            repo={"resource"}
                            onRemove={handleRemoveThumbnailImg}
                            onUpload={handleAddNewThumbnailImage}
                        />
                    </Box>
                    <FormErrorMessage>{errors.image?.message}</FormErrorMessage>
                </FormControl>

                <Button
                    mt={4}
                    type="submit"
                    isLoading={isSubmitting}
                    leftIcon={<BiSave />}
                    colorScheme="blue"
                    justifySelf={"flex-start"}
                >
                    Save
                </Button>
            </Stack>
        </form>
    )
}

export default ResourceForm
