import React, { useEffect, useRef, useState } from "react"
import {
    Box,
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    HStack,
    Input,
    Select,
    useToast,
    VStack,
} from "@chakra-ui/react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, useWatch } from "react-hook-form"
import { z } from "zod"

import AddressSerachInput, {
    type LocationSearchInput,
} from "./AddressSerachForm"

const CreateAddressSchema = z.object({
    name: z.string().min(3),
    building: z.string().min(3),
    floor: z.string().min(1),
    city: z.string().min(3),
    street: z.string().optional(),
    country: z.string().min(3),
    lng: z.string().min(2),
    lat: z.string().min(2),
})

export type AddressData = z.infer<typeof CreateAddressSchema>

interface AddressFormProps {
    onSubmit: (data: AddressData) => void,
    isSubmiting: boolean
    address?: AddressData & { id: string, createdAt: Date, updatedAt:  Date }
}

const AddressForm: React.FC<AddressFormProps> = ({ onSubmit, isSubmiting, address }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control,
        setValue,
    } = useForm<AddressData>({
        resolver: zodResolver(CreateAddressSchema),
        defaultValues: address
    })


    const name = useWatch({ control, name: 'name'})
    const lat = useWatch({ control, name: 'lat'})
    const lng = useWatch({ control, name: 'lng'})

    const handleFormSubmit = (data: AddressData) => {
      onSubmit(data)
      reset()
    }

    const handleSelect = (location: LocationSearchInput) => {
        setValue("name", location.name)
        setValue("lat", location.latitude.toString())
        setValue("lng", location.longitude.toString())
    }

    const handleTextChange = (text: string) => {
        setValue("name", text)
    }

    const handleClearLocation = () => {
        setValue("name", "")
        setValue("lat", "")
        setValue("lng", "")
    }

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)}>
            <Box  px={2} py={4}>
                <FormControl isInvalid={!!errors.name}>
                    <FormLabel fontSize={"x-small"}>address</FormLabel>
                    <AddressSerachInput
                        onChange={handleTextChange}
                        onSelect={handleSelect}
                        onClear={handleClearLocation}
                        address={{ name, lat, lng , }}

                    />
                    <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!errors.street}>
                        <FormLabel fontSize={"x-small"}>
                             Street
                        </FormLabel>
                        <Input {...register("street")} />
                        <FormErrorMessage>
                            {errors.street?.message}
                        </FormErrorMessage>
                    </FormControl>
                <HStack spacing={3}>
                    <FormControl isInvalid={!!errors.building}>
                        <FormLabel fontSize={"x-small"}>
                            Building Name
                        </FormLabel>
                        <Input {...register("building")} />
                        <FormErrorMessage>
                            {errors.building?.message}
                        </FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.floor}>
                        <FormLabel fontSize={"x-small"}>Floor</FormLabel>
                        <Input {...register("floor")} />
                        <FormErrorMessage>
                            {errors.floor?.message}
                        </FormErrorMessage>
                    </FormControl>
                </HStack>       
                <HStack >
                    <FormControl isInvalid={!!errors.city} width={"100%"}>
                        <FormLabel fontSize={"x-small"}>City</FormLabel>
                        <Select placeholder="Select city" {...register("city")}>
                            <option value="Dubai">Dubai</option>
                            <option value="Abu Dhabi">Abu Dhabi</option>
                        </Select>
                        <FormErrorMessage>
                            {errors.city?.message}
                        </FormErrorMessage>
                    </FormControl>
                    <FormControl isInvalid={!!errors.country}>
                        <FormLabel fontSize={"x-small"}>Country</FormLabel>
                        <Select
                            w="100%"
                            placeholder="Select country"
                            {...register("country")}
                        >
                            <option value="United Arab Emirates">
                                United Arab Emirates
                            </option>
                        </Select>
                        <FormErrorMessage>
                            {errors.country?.message}
                        </FormErrorMessage>
                    </FormControl>
                </HStack>
                <Button isLoading={isSubmiting}  mt={3} colorScheme="blue" type="submit">
                    Save
                </Button>
            </Box>
        </form>
    )
}

export default AddressForm
