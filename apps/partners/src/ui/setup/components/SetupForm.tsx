import React, { useEffect, useState } from "react"
import {
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    Select,
    Stack,
    Tag,
    TagCloseButton,
    TagLabel,
    Text,
    Textarea,
} from "@chakra-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

const soluActivities = {
    WELLNESS: ["Meditation", "Yoga", "Breath work", "Aromatherapy", "Sound Healing"],
    FITNESS: [
        "Cycling",
        "Pilates",
        "CrossFit",
        "Kick Boxing",
        "Dance Fitness",
        "Running",
        "Pole Dancing",
        "Boxing",
    ],
}

export const SetupFormSchema = z.object({
    bio: z.string().min(100),
    businessType: z.enum(["FITNESS", "WELLNESS"]),
    activities: z.array(z.string()).min(1),
    title: z.string().min(5),
})

export type SetupSchemaType = z.infer<typeof SetupFormSchema>

function SetupForm({
    onSubmit,
    isLoading
}: {
    onSubmit: (data: SetupSchemaType ) => void,
    isLoading: boolean
}) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        getValues,
        setValue,
        watch,
    } = useForm<SetupSchemaType>({
        resolver: zodResolver(SetupFormSchema),
        defaultValues: {
            bio: "",
            businessType: "FITNESS",
            activities: [],
            title: "",
        },
    })

    const [selectedActivities, setSelectedActivities] = useState<string[]>([])
    //   const [] = useState()

    watch("businessType")
    console.log({ errors  })

    useEffect(() => {
        setValue("activities", selectedActivities)
    }, [selectedActivities])

    useEffect(() => {
        // Clear selected activities when business type changes
        setSelectedActivities([])
        // Clear the 'activities' field in the form data
        setValue("activities", [])
    }, [getValues("businessType"), setValue])

    const addActivity = (activity: string) => {
        setSelectedActivities((prev) => [...prev, activity])
    }

    const removeActivity = (activity: string) => {
        setSelectedActivities((prev) => prev.filter((a) => a !== activity))
    }

    const handleSubmitSetup: (data: SetupSchemaType) => void = (data) => {
        // Use selected activities directly from state
        onSubmit({ ...getValues(), activities: selectedActivities })
    }

    return (
        <Stack
            spacing={5}
            dir="column"
            maxW={700}
            as={"form"}
            onSubmit={handleSubmit(handleSubmitSetup)}
        >
            <FormControl isInvalid={!!errors.title}>
                <FormLabel htmlFor="title">Title</FormLabel>
                <Input {...register("title")} placeholder="Enter your title" />
                <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.businessType}>
                <FormLabel htmlFor="businessType">Business Type</FormLabel>
                <Select {...register("businessType")}>
                    <option value="FITNESS">Fitness</option>
                    <option value="WELLNESS">Wellness</option>
                </Select>
                <FormErrorMessage>
                    {errors.businessType?.message}
                </FormErrorMessage>
            </FormControl>

            <FormControl>
                <FormLabel htmlFor="activities">Activities</FormLabel>
                <Text mb={2} fontSize={'sm'} color='red.400'>{errors.activities && 'A min of one activity must be selected'}</Text>

                <Stack
                    wrap="wrap"
                    width={"inherit"}
                    direction="row"
                    spacing={1}
                    mb={4}
                >
                    {soluActivities[getValues("businessType")].map(
                        (activity) => (
                            <Tag
                                key={activity}
                                {...register('activities')}
                                px={4}
                                minW={100}
                                size={"lg"}
                                py={2}
                                colorScheme={
                                    selectedActivities.includes(activity)
                                        ? "teal"
                                        : "gray"
                                }
                                cursor="pointer"
                                onClick={() =>
                                    selectedActivities.includes(activity)
                                        ? removeActivity(activity)
                                        : addActivity(activity)
                                }
                            >
                                <TagLabel
                                    noOfLines={3}
                                    width={"100%"}
                                    fontSize={"small"}
                                    textOverflow={"revert-layer"}
                                >
                                    {activity}
                                </TagLabel>
                                {selectedActivities.includes(activity) && (
                                    <TagCloseButton
                                        onClick={() => removeActivity(activity)}
                                    />
                                )}
                            </Tag>
                        ),
                    )}
                </Stack>
                
                <FormErrorMessage>
                    {errors.activities?.message}
                </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.bio}>
                <FormLabel htmlFor="bio">Bio</FormLabel>
                <Textarea
                    {...register("bio")}
                    placeholder="Write a brief bio..."
                />
                <FormErrorMessage>{errors.bio?.message}</FormErrorMessage>
            </FormControl>

            <Button type="submit" colorScheme="teal" isLoading={isLoading}>
                Submit
            </Button>
        </Stack>
    )
}

export default SetupForm
