import React, { useEffect, useState } from "react"
import {
    Box,
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    HStack,
    Input,
    Select,
    Stack,
    Tag,
    Textarea,
} from "@chakra-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"
import { BiSave } from "react-icons/bi"

import { MemoV2FileUplaod } from "~/shared/V2FileUpload"
import VideoUpload from "~/shared/VideoUpload"
import { CreateSMWFormSchema, type CreateSMWFormSchemaType } from "../schema"
import SearchInstructorInput from "./SearchInstructorInput"

type SMWFormType = {
    onSubmit: (data: CreateSMWFormSchemaType) => void
    isSubmiting: boolean
    btnText?: string
    smw?: any
}


const categories = [
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
    "51-above"
  ];

const SMWForm: React.FC<SMWFormType> = ({
    smw,
    onSubmit,
    isSubmiting,
    btnText,
}) => {
    const {
        control,
        register,
        setValue,
        formState: { errors },
        handleSubmit,
    } = useForm<CreateSMWFormSchemaType>({
        resolver: zodResolver(CreateSMWFormSchema),
        ...(smw
            ? {
                  defaultValues: {
                    ...smw,
                    instructorId: smw.instructorId,
                    video: {
                        key: smw.videoKey,
                        repo: smw.videoRepo
                    },
                    thumbnail: {
                        key: smw.thumbnailKey,
                        repo: smw.thumbnailRepo 
                    },
                    
                  },
              }
            : {}),
    })

    const [subCategories, setSubCategories ] = useState<string[]>(categories)
  

    const thumbnail = useWatch({ name: "thumbnail", control })
    const video = useWatch({ name: "video", control })
    const title = useWatch({ name: "title", control })

    const selectedSubCategories = useWatch({ name: "subCategories", control }) || []
    const selectedCategory = useWatch({ name: "category", control }) || []
   


    const toggleCategory = (category: string) => {
        const currentSubCategories = selectedSubCategories.includes(category)
          ? selectedSubCategories.filter((c) => c !== category)
          : [...selectedSubCategories, category];
        setValue("subCategories", currentSubCategories);
      };

    const handleSelectedInstructor = (instructor: any) => {
        setValue("instructorId", instructor.id as string)
    }

    const handleRemoveThumbnailImg = (key: string) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        setValue("thumbnail", {})
    }

    const handleAddNewThumbnailImage = React.useCallback(
        (key: string) => {
            setValue("thumbnail", { key, repo: "smwThumbnail" })
        },
        [setValue],
    )

    const handleRemoveVideo = (key: string) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        setValue("video", {})
    }

    const handleAddNewVideo = React.useCallback(
        (key: string) => {
            setValue("video", { key, repo: "smwVideos" })
        },
        [setValue],
    )

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3}>
                <FormControl isInvalid={!!errors.title}>
                    <FormLabel fontSize={"sm"}>Title</FormLabel>
                    <Input {...register("title")} />
                    <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
                </FormControl>
               
               <HStack spacing={2}>
               <FormControl mt={4} isInvalid={!!errors.category}>
                    <FormLabel fontSize={'small'}>Category </FormLabel>
                    <Select
                        placeholder="Select Category type"
                        {...register("category")}
                    >
                        <option value="Fitness">Fitness</option>
                        <option value="Wellness">Wellness</option>
                        
                    </Select>
                    <FormErrorMessage>
                        {errors.category?.message}
                    </FormErrorMessage>
                </FormControl>
                <FormControl mt={4} isInvalid={!!errors.contentType}>
                    <FormLabel fontSize={'small'}>Content type </FormLabel>
                    <Select
                        placeholder="Select Content type"
                        {...register("contentType")}
                    >
                        <option value="Freemium">Freemium</option>
                        <option value="Premium">Premium</option>
                        
                    </Select>
                    <FormErrorMessage>
                        {errors.category?.message}
                    </FormErrorMessage>
                </FormControl>
               </HStack>
                {selectedCategory && <FormControl mt={4} isInvalid={!!errors.subCategories}>
                    <FormLabel fontSize={'sm'}>Categories</FormLabel>
                    <Stack spacing={2} direction="row" flexWrap="wrap">
                        {subCategories?.map((category) => (
                        <Tag
                            key={category}
                            size="lg"
                            variant="solid"
                            colorScheme={
                            selectedSubCategories.includes(category) ? "green" : "gray"
                            }
                            cursor="pointer"
                            onClick={() => toggleCategory(category)}
                        >
                            {category}
                        </Tag>
                        ))}
                    </Stack>
                    <FormErrorMessage>
                        {errors.subCategories?.message}
                    </FormErrorMessage>
                </FormControl>}
                <FormControl isInvalid={!!errors.description}>
                    <FormLabel fontSize={"sm"}>Description</FormLabel>
                    <Textarea {...register("description")} />
                    <FormErrorMessage>
                        {errors.description?.message}
                    </FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!errors.instructorId}>
                    <SearchInstructorInput
                        onSelectInstructor={handleSelectedInstructor}
                        instructor={smw?.instructor && smw.instructor}
                    />
                    <FormErrorMessage>
                        {errors.instructorId?.message}
                    </FormErrorMessage>
                </FormControl>
                <FormControl mt={4} isInvalid={!!errors.thumbnail} my={5}>
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
                            file={
                                thumbnail?.key &&
                                `${thumbnail.repo}/${thumbnail.key}`
                            }
                            repo={"smwThumbnail"}
                            onRemove={handleRemoveThumbnailImg}
                            onUpload={handleAddNewThumbnailImage}
                        />
                    </Box>
                    <FormErrorMessage>
                        {errors.thumbnail?.message}
                    </FormErrorMessage>
                </FormControl>

                <FormControl mt={4} isInvalid={!!errors.video} my={5}>
                    <FormLabel fontSize={"sm"}>Video</FormLabel>

                    <Box
                    

                        mt={5}
                        height={"400px"}
                        width={"450px"}
                    >
                        <VideoUpload
                            title={title}
                            video={
                                video?.key && `${video.repo}/${video.key}`
                            }
                            repo={"smwVideos"}
                            onRemove={handleRemoveVideo}
                            onUpload={handleAddNewVideo}
                        />
                    </Box>
                    <FormErrorMessage>
                        {errors.video?.message}
                    </FormErrorMessage>
                </FormControl>
            </Stack>
            <Button
                mt={10}
                isLoading={isSubmiting}
                colorScheme="green"
                leftIcon={<BiSave />}
                type="submit"
            >
                {btnText ?? "Create"}
            </Button>
        </form>
    )
}

export { SMWForm }
