import React, { useEffect, useState } from "react"
import {
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
import { type z } from "zod"

import { CreateSessionSchema } from "../schema"
import { SearchAddressInput, type Address } from "./AddressInput"

export type SessionType = z.infer<typeof CreateSessionSchema>


const categories = [
        'stress relief',
    'fat loss',
    'muscle gain',
     'group activities',
    'therapy',
     'mobility improvement',
    'endurance improvement',
    "18-25",
    "26-32",
    "33-37",
    "38-42",
    "43-51",
    "51-above"
];
  

type SessionFormProps = {
    onSubmit: (data: SessionType) => void
    isSubmitting: boolean
    partnerId: string
    session?: SessionType & { id: string; partner: any }
}

const SessionForm: React.FC<SessionFormProps> = ({
    onSubmit,
    isSubmitting,
    session,
    partnerId,
}) => {


    const dateForDateTimeInputValue = (val: string) => {
        const date = new Date(val)
        return new Date(date.getTime() + new Date().getTimezoneOffset() * -60 * 1000).toISOString().slice(0, 19)
    }



    const {
        handleSubmit,
        register,
        formState: { errors },
        control,
        setValue,
    } = useForm<SessionType>({
        resolver: zodResolver(CreateSessionSchema),
        ...(session
            ? {
                  defaultValues: {
                      ...session,
                      startTime: dateForDateTimeInputValue(session.startTime),
                      endTime: dateForDateTimeInputValue(session.endTime),
                  },
              }
            : {}),
    })
    const [subCategories, setSubCategories ] = useState<string[]>(categories)

    
    const capacity = useWatch({ control, name: "capacity" })
    const point = useWatch({ control, name: "point" })

    const selectedSubCategories = useWatch({ name: "subCategories", control }) || []
    const selectedCategory = useWatch({ name: "category", control, defaultValue: 'Fitness' }) 
   

    // useEffect(() => {
    //     if (selectedCategory === 'Fitness') {
    //         const categories = ['Pylo', 'HIIT', 'Pilates', 'Cardio', 'Calisthenic', 'Yoga']
    //         setSubCategories(categories)
    //     }else {
    //         const categories = ['Meditation', 'Sound healing', 'Sleeping']
    //         setSubCategories(categories)
    //     }
    // }, [selectedCategory])

    const toggleCategory = (category: string) => {
        const currentSubCategories = selectedSubCategories.includes(category)
          ? selectedSubCategories.filter((c) => c !== category)
          : [...selectedSubCategories, category];
        setValue("subCategories", currentSubCategories);
      };

    const handleSubmitSession = (data: SessionType) => {
        onSubmit(data)
    }

    const onselectAddress = (address: Address) => {
        setValue("addressId", address.id)
    }

    const onCapacityChange = (value: string) => {
        setValue("capacity", parseInt(value))
    }

    const onPointChange = (value: string) => {
      setValue("point", parseInt(value))
  }

    return (
        <form onSubmit={handleSubmit(handleSubmitSession)}>
            <Stack spacing={3} width={"100%"} maxW={650} px={"auto"}>
                <FormControl isInvalid={!!errors.title}>
                    <FormLabel fontSize={"small"}>Title</FormLabel>
                    <Input {...register("title")} />
                    <FormErrorMessage>{errors.title?.message}</FormErrorMessage>
                </FormControl>
                <HStack spacing={2}>
                    <FormControl isInvalid={!!errors.point}>
                        <FormLabel fontSize={"small"}>Point</FormLabel>
                        <Input
                        value={point}
                        onChange={(e) => onPointChange(e.target.value)}
                        type="number"  />
                        <FormErrorMessage>
                            {errors.point?.message}
                        </FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.capacity}>
                        <FormLabel fontSize={"small"}>Capacity</FormLabel>
                        <Input
                            onChange={(e) => onCapacityChange(e.target.value)}
                            type="number"
                            value={capacity}
                        />
                        <FormErrorMessage>
                            {errors.capacity?.message}
                        </FormErrorMessage>
                    </FormControl>
                </HStack>

                <HStack spacing={2}>
                    <FormControl isInvalid={!!errors.startTime}>
                        <FormLabel fontSize={"small"}>Start Time</FormLabel>
                        <Input type="datetime-local" {...register("startTime")} />
                        <FormErrorMessage>
                            {errors.startTime?.message}
                        </FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.endTime}>
                        <FormLabel fontSize={"small"}>End Time</FormLabel>
                        <Input type="datetime-local" {...register("endTime")} />
                        <FormErrorMessage>
                            {errors.endTime?.message}
                        </FormErrorMessage>
                    </FormControl>
                </HStack>

                <FormControl isInvalid={!!errors.category}>
                    <FormLabel fontSize={"small"}>Category</FormLabel>
                    <Select {...register("category")} defaultValue={"Fitness"}>
                        <option value="Fitness">Fitness</option>
                        <option value="Wellness">Wellness</option>
                    </Select>
                    <FormErrorMessage>
                        {errors.category?.message}
                    </FormErrorMessage>
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

                <FormControl isInvalid={!!errors.description}>
                    <FormLabel fontSize={"small"}>Description</FormLabel>
                    <Textarea {...register("description")} />
                    <FormErrorMessage>
                        {errors.description?.message}
                    </FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.addressId}>
                    <FormLabel fontSize={"small"}>Address </FormLabel>
                    <SearchAddressInput
                        address={session?.address || {}}
                        onSelectAddress={onselectAddress}
                        partnerId={partnerId}
                    />
                    <FormErrorMessage>
                        {errors.addressId?.message}
                    </FormErrorMessage>
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

export { SessionForm }
