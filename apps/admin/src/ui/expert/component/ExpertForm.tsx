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
import { InstructorSchema, type InstructorType } from "../schema/instructor"

type ExpertFormType = {
    onSubmit: (data: InstructorType) => void
    isSubmiting: boolean
    btnText?: string
    instructor?: any
}

// const subCategories = ["", "8 ingredients", "Easy to prepare", "Meal prep", "On budget", "Family friendly"];


const ExpertForm: React.FC<ExpertFormType> = ({
    onSubmit,
    isSubmiting,
    btnText,
    instructor
   
}) => {

    const [subCategories, setSubCategories ] = useState<string[]>()

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        control,
    } = useForm<InstructorType>({
        resolver: zodResolver(InstructorSchema),
        ...(instructor ? {
            defaultValues: {
                ...instructor,
                image: {
                    key: instructor.imageKey,
                    repo: instructor.repo
                }
            }
        }:{})
       
    })


 

    const imageWatch = useWatch({ name: "image", control })
    const selectedSubCategories = useWatch({ name: "subCategories", control }) || []
    const selectedCategory = useWatch({ name: "category", control }) || []
   

    useEffect(() => {
        if (selectedCategory === 'Fitness') {
            const categories = ['Pylo', 'HIIT', 'Pilates', 'Cardio', 'Calisthenic', 'Yoga']
            setSubCategories(categories)
        }else {
            const categories = ['Meditation', 'Sound healing', 'Sleeping']
            setSubCategories(categories)
        }
    }, [selectedCategory])

    const toggleCategory = (category: string) => {
        const currentSubCategories = selectedSubCategories.includes(category)
          ? selectedSubCategories.filter((c) => c !== category)
          : [...selectedSubCategories, category];
        setValue("subCategories", currentSubCategories);
      };
    
    
    const handleRemoveIngriedentImg = (key: string) => {
        console.log({ key })
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        setValue("image", {})
    }

    const handleAddNewIngredientImage = React.useCallback(
        (key: string) => {
            setValue("image", { key, repo: "profiles" })
        },
        [setValue],
    )


  

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <FormControl
                    display="flex"
                    mt={4}
                    isInvalid={!!errors.image}
                    my={5}
                    justifyContent={"center"}
                >
                    <Box
                        borderRadius={20}
                        borderStyle={'dashed'}
                        justifyContent={"center"}
                        alignItems={"center"}
                        display={"flex"}
                        height={"200px"}
                        width={"150px"}
                        justifySelf={"center"}
                    >
                        <MemoV2FileUplaod
                            isRounded
                            alt={`profile-image`}
                            file={
                                imageWatch?.key && `profiles/${imageWatch.key}`
                            }
                            repo={"profiles"}
                            onRemove={handleRemoveIngriedentImg}
                            onUpload={handleAddNewIngredientImage}
                        />
                    </Box>
                </FormControl>
                <HStack spacing={2}>
                    <FormControl isInvalid={!!errors.firstname}>
                        <FormLabel fontSize={"sm"}>Firstname</FormLabel>
                        <Input {...register("firstname")} />
                        <FormErrorMessage>
                            {errors.firstname?.message}
                        </FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.lastname}>
                        <FormLabel fontSize={"sm"}>Lastname</FormLabel>
                        <Input {...register("lastname")} />
                        <FormErrorMessage>
                            {errors.lastname?.message}
                        </FormErrorMessage>
                    </FormControl>
                </HStack>
                <HStack spacing={2}>
                    <FormControl isInvalid={!!errors.title}>
                        <FormLabel fontSize={"sm"}>title</FormLabel>
                        <Input {...register("title")} />
                        <FormErrorMessage>
                            {errors.title?.message}
                        </FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.calenderUrl}>
                        <FormLabel fontSize={"sm"}>calender Url</FormLabel>
                        <Input {...register("calenderUrl")} />
                        <FormErrorMessage>
                            {errors.calenderUrl?.message}
                        </FormErrorMessage>
                    </FormControl>
                </HStack>
                <HStack>
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
                <FormControl mt={4} isInvalid={!!errors.isActive}>
                    <FormLabel fontSize={'small'}>Status </FormLabel>
                    <Select
                        placeholder="Select Profile state"
                        {...register("isActive")}
                    >
                        <option value="active">active</option>
                        <option value="inactive">inactive</option>
                        
                    </Select>
                    <FormErrorMessage>
                        {errors.category?.message}
                    </FormErrorMessage>
                </FormControl>
                </HStack>
                <FormControl isInvalid={!!errors.bio}>
                    <FormLabel fontSize={"sm"}>Bio</FormLabel>
                    <Textarea {...register("bio")} />
                    <FormErrorMessage>{errors.bio?.message}</FormErrorMessage>
                </FormControl>

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
                <Button
                    mt={10}
                    isLoading={isSubmiting}
                    colorScheme="green"
                    leftIcon={<BiSave />}
                    type="submit"
                >
                 {   btnText ?? 'Create'}
                </Button>
            </form>
        </>
    )
}

export { ExpertForm }
