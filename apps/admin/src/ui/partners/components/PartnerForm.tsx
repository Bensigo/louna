import React from "react"
import {
    Box,
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    HStack,
    IconButton,
    Input,
    Select,
    Stack,
    Tag,
    Textarea,
} from "@chakra-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm, useWatch } from "react-hook-form"
import { BiPlus, BiTrash } from "react-icons/bi"
import { type z } from "zod"

import { CreatePartnerSchema } from "../schema"
import { MemoV2FileUplaod } from "~/shared/V2FileUpload"

export type CreatePartnerType = z.infer<typeof CreatePartnerSchema>

const subCategories = [
    "stress relief",
    "fat loss",
    "muscle gain",
    "group activities",
    "therapy",
    "mobility improvement",
    "endurance improvement",
]
const amenities = [
    "Bathroom",
    "Towels",
    "Locker",
    "Shower",
    "WiFi",
    "Sauna",
    "Parking",
]

type PartnerForm = {
    onSubmit: (data: CreatePartnerType) => void
    isSubmiting: boolean
    btnText?: string
    partner?: any
}

const PartnerForm: React.FC<PartnerForm> = ({
    onSubmit,
    partner,
    isSubmiting,
    btnText,
}) => {
    
    const {
        handleSubmit,
        control,
        register,
        setValue,
        formState: { errors },
    } = useForm<CreatePartnerType>({
        resolver: zodResolver(CreatePartnerSchema),
        ...(partner ? {
            defaultValues: {
                ...partner
            }
        }: {})
    })

    const {
        fields: socialFields,
        append: appendSocial,
        remove: removeSocial,
    } = useFieldArray({
        control,
        name: "socials",
    })

    const {
        fields: imageFields,
        append: appendImage,
        remove: removeImage,
        update: updateImage,
    } = useFieldArray({
        control,
        name: "images",
    })

    const selectedAmenities = useWatch({ control, name: "amenities" }) || []
    const selectedSubCategories = useWatch({ control, name: "subCategories" }) || []

    const toggleAmenities = (amenity: string) => {
        const currentAmenities = selectedAmenities.includes(amenity)
            ? selectedAmenities.filter((c) => c !== amenity)
            : [...selectedAmenities, amenity]
        setValue("amenities", currentAmenities)
    }
    

    const toggleSubcategories = (category: string) => {
        const currentSubCategories = selectedSubCategories.includes(category)
            ? selectedSubCategories.filter((c) => c !== category)
            : [...selectedSubCategories, category]
        setValue("subCategories", currentSubCategories)
    }





    const handleAddImage = (key: string, index: number) => {
        updateImage(index, { key, repo: 'partner'})
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl isInvalid={!!errors.name}>
                    <FormLabel fontSize={"sm"}>Title</FormLabel>
                    <Input {...register("name")} />
                    <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
                </FormControl>
                <HStack spacing={2}>
                    <FormControl mt={4} isInvalid={!!errors.category}>
                        <FormLabel fontSize={"small"}>Category </FormLabel>
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
                    <FormControl mt={4} isInvalid={!!errors.phone}>
                        <FormLabel fontSize={"small"}>Phone number</FormLabel>
                        <Input {...register("phone")} />
                        <FormErrorMessage>
                            {errors.phone?.message}
                        </FormErrorMessage>
                    </FormControl>
                </HStack>
                <FormControl mt={4} isInvalid={!!errors.amenities}>
                    <FormLabel fontSize={"sm"}>Amenities</FormLabel>
                    <Stack spacing={2} direction="row" flexWrap="wrap">
                        {amenities?.map((amenity) => (
                            <Tag
                                key={amenity}
                                size="lg"
                                variant="solid"
                                colorScheme={
                                    selectedAmenities.includes(amenity)
                                        ? "green"
                                        : "gray"
                                }
                                cursor="pointer"
                                onClick={() => toggleAmenities(amenity)}
                            >
                                {amenity}
                            </Tag>
                        ))}
                    </Stack>
                    <FormErrorMessage>
                        {errors.amenities?.message}
                    </FormErrorMessage>
                </FormControl>
             
                <FormControl mt={4} isInvalid={!!errors.subCategories}>
                    <FormLabel fontSize={"sm"}>SubCategories</FormLabel>
                    <Stack spacing={2} direction="row" flexWrap="wrap">
                        {subCategories?.map((category) => (
                            <Tag
                                key={category}
                                size="lg"
                                variant="solid"
                                colorScheme={
                                    selectedSubCategories.includes(category)
                                        ? "green"
                                        : "gray"
                                }
                                cursor="pointer"
                                onClick={() => toggleSubcategories(category)}
                            >
                                {category}
                            </Tag>
                        ))}
                    </Stack>
                    <FormErrorMessage>
                        {errors.subCategories?.message}
                    </FormErrorMessage>
                </FormControl>

                <FormControl mt={4} isInvalid={!!errors.socials}>
                    <FormLabel fontSize={"small"}>Socials</FormLabel>
                    {socialFields.map((social, index) => (
                        <HStack   key={social.id} spacing={3}>
                        <Stack
                          
                            maxW={250}
                            mt={4}
                            spacing={2}
                            alignItems={"center"}
                        >

                            <FormControl>
                            <FormLabel fontSize={"x-small"}>Name</FormLabel>
                            <Select
                
                                {...register(`socials.${index}.name` as const)}
                                defaultValue="Instagram"
                            >
                                <option value="Instagram">Instagram</option>
                                <option value="Twitter">Twitter</option>
                                <option value="TikTok">TikTok</option>
                                <option value="Facebook">Facebook</option>
                                
                            </Select>
                            </FormControl>
                            <FormControl>
                            <FormLabel fontSize={"x-small"}>Url</FormLabel>
                            <Input
                                {...register(`socials.${index}.url` as const)}
                                defaultValue={social.url}
                            />
                            </FormControl>
                        </Stack>
                             <IconButton
                                aria-label="remove"
                                icon={<BiTrash />}
                                type="button"
                                onClick={() => removeSocial(index)}
                                colorScheme="red"
                                size="sm"
                            />
                        </HStack>
                    ))}
                    <Button
                        mt={5}
                        type="button"
                        rightIcon={<BiPlus />}
                        onClick={() => appendSocial({})}
                        colorScheme="green"
                        size="sm"
                    >
                        Add Social
                    </Button>
                    <FormErrorMessage>
                        {errors.socials?.message}
                    </FormErrorMessage>
                </FormControl>
                <FormControl mt={4} isInvalid={!!errors.bio}>
                    <FormLabel fontSize={"small"}>info </FormLabel>
                    <Textarea {...register("bio")} />
                    <FormErrorMessage>{errors.bio?.message}</FormErrorMessage>
                </FormControl>
                <FormControl mt={4} isInvalid={!!errors.images} >
                            <FormLabel>Images</FormLabel>
                            <HStack spacing={3} overscrollX={'auto'}>
                                {imageFields.map((image, index) => (
                          
                                       <Box
                                        key={index}
                                        maxH={"200px"}
                                        height={"200px"}
                                        width={"230px"}
                                    >
                                        <MemoV2FileUplaod
                                             isRounded={false}
                                            alt={`partner-${index}`}
                                            file={
                                                image.key
                                                    ? `partner/${image.key}`
                                                    : undefined
                                            }
                                            repo={"partner"}
                                            onRemove={() => {
                                                removeImage(index)
                                            }}
                                            onUpload={(key) => {
                                                handleAddImage(key, index)
                                            }}
                                        />
                                    </Box>
                            
                            
                                ))}
                            </HStack>
                            <Button
                                mt={5}
                                type="button"
                                rightIcon={<BiPlus />}
                                onClick={() =>
                                    appendImage({  })
                                }
                                colorScheme="green"
                                size="sm"
                            >
                                Add Image
                            </Button>
                            <FormErrorMessage>
                                {errors.images?.message}
                            </FormErrorMessage>
                        </FormControl>
                <Button
                    mt={20}
                    colorScheme="green"
                    isLoading={isSubmiting}               
                    type="submit"
                    w={200}
                >
                    { btnText ?? 'Submit'}
                </Button>
            </form>
        </>
    )
}

export { PartnerForm }
