
import React, { useState } from "react"
import {
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    HStack,
    Input,
    Select,
    Stack,
    Tag
} from "@chakra-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"
import { BiSave } from "react-icons/bi"
import { type z } from "zod"

import { CreateSessionSchema } from "../schema"
import { SearchAddressInput, type Address } from "../../partners/sessions/components/AddressInput"
import { type Partner, SearchPartnerInput } from "./partnerInput"

export type SessionType = z.infer<typeof CreateSessionSchema>


const mainTags = [
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
    session?: SessionType & { id: string; partner: any }
}

const SessionForm: React.FC<SessionFormProps> = ({
    onSubmit,
    isSubmitting,
    session
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
                      isPublish: session.isPublish ? 'publish': 'unpublish',
                      addressId: session.addressId || '',
                      partnerId: session.partnerId || '',
                      startTime: dateForDateTimeInputValue(session.startTime),
                      endTime: dateForDateTimeInputValue(session.endTime),
                  },
              }
            : {}),
    })
    const [tags, setTags ] = useState<string[]>(mainTags)

    
    const capacity = useWatch({ control, name: "capacity" })
    const point = useWatch({ control, name: "point" })
    const partnerId = useWatch({ control, name: "partnerId" })

    const selectedTags = useWatch({ name: "tags", control }) || []
    const selectedCategory = useWatch({ name: "category", control, defaultValue: 'Fitness' }) 
   



    const toggleCategory = (tag: string) => {
        const currentSubCategories = selectedTags.includes(tag)
          ? selectedTags.filter((c) => c !== tag)
          : [...selectedTags, tag];
        setValue("tags", currentSubCategories);
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


  const handleSelectedPartner = (partner: Partner) => {
    setValue("partnerId", partner.id)
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
                        <Input  type="datetime-local" {...register("startTime")} step={1800} />
                        <FormErrorMessage>
                            {errors.startTime?.message}
                        </FormErrorMessage>
                    </FormControl>

                    <FormControl isInvalid={!!errors.endTime}>
                        <FormLabel fontSize={"small"}>End Time</FormLabel>
                        <Input type="datetime-local" {...register("endTime")} step={1800} />
                        <FormErrorMessage>
                            {errors.endTime?.message}
                        </FormErrorMessage>
                    </FormControl>
                </HStack>

               <HStack>
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


                <FormControl isInvalid={!!errors.publish}>
                    <FormLabel fontSize={"small"}>publish</FormLabel>
                    <Select {...register("isPublish")} defaultValue={"unpublish"}>
                        <option value="publish">Publish</option>
                        <option value="unpublish">Unpublish</option>
                    </Select>
                    <FormErrorMessage>
                        {errors.publish?.message}
                    </FormErrorMessage>
                </FormControl>
               </HStack>

            
                <FormControl>

                <FormLabel fontSize={"small"}>Partner </FormLabel>
                  <SearchPartnerInput onSelectPartner={handleSelectedPartner}  partner={session?.partner} />
                <FormErrorMessage>
                        {errors.partnerId?.message}
                    </FormErrorMessage>
                </FormControl>

               {partnerId && <FormControl isInvalid={!!errors.addressId}>
                    <FormLabel fontSize={"small"}>Address </FormLabel>
                    <SearchAddressInput
                        address={session?.address}
                        onSelectAddress={onselectAddress}
                        partnerId={partnerId}
                    />
                    <FormErrorMessage>
                        {errors.addressId?.message}
                    </FormErrorMessage>
                </FormControl>}


                {selectedTags && <FormControl mt={4} isInvalid={!!errors.tags}>
                    <FormLabel fontSize={'sm'}>Tags</FormLabel>
                    <Stack spacing={2} direction="row" flexWrap="wrap">
                        {mainTags?.map((category) => (
                        <Tag
                            key={category}
                            size="lg"
                            variant="solid"
                            colorScheme={
                            selectedTags.includes(category) ? "green" : "gray"
                            }
                            cursor="pointer"
                            onClick={() => toggleCategory(category)}
                        >
                            {category}
                        </Tag>
                        ))}
                    </Stack>
                    <FormErrorMessage>
                        {errors.tags?.message}
                    </FormErrorMessage>
                </FormControl>}

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
