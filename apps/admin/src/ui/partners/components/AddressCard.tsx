import React, { useRef } from "react"
import {
    Box,
    Button,
    Flex,
    IconButton,
    Modal,
    ModalContent,
    ModalOverlay,
    Text,
    useDisclosure,
    useToast,
} from "@chakra-ui/react"
import { add } from "date-fns"
import { BiBullseye, BiTrash } from "react-icons/bi"

import { api } from "~/utils/api"
import AddressForm, { AddressData } from "./AddressForm"

interface Address {
    id: string
    name: string
    building: string
    floor: string
    street?: string
    city: string
    country: string
}

interface AddressCardProps {
    address: Address
    onDelete?: (id: string) => void
    isDeleting?: boolean
    isViewOnly?: boolean
    onRemove?: () => void
}

const AddressCard: React.FC<AddressCardProps> = ({
    address,
    onDelete,
    isDeleting,
    isViewOnly = flase,
    onRemove,
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const addressModalRef = useRef(null)

    const { mutate: update, isLoading: isUpdating } =
        api.address.update.useMutation()
    const ctx = api.useUtils()

    const toast = useToast()

    const handleDelete = () => {
        if (!isViewOnly) {
            onDelete(address.id)
        }
    }

    const handleUpdateAddress = (data: AddressData) => {
        update(
            { id: address.id, ...data },
            {
                onSuccess: () => {
                    toast({
                        title: "Address updated successfully",
                        status: "success",
                        duration: 3000,
                        isClosable: true,
                    })
                    ctx.address.list.refetch()
                },
                onError: (err) => {
                    toast({
                        title: err.message,
                        status: "error",
                        duration: 3000,
                        isClosable: true,
                    })
                },
            },
        )

        onClose()
    }

    return (
        <>
            <Box borderWidth="1px" borderRadius="md" p={4} mb={4} w={350}>
                <Text fontWeight="bold" mb={2}>
                    {address.building}, {address.floor}
                </Text>
                <Text fontWeight="400" mb={2} fontSize={"small"}>
                    {address.name}
                </Text>
                {address.street && (
                    <Text fontWeight="400" mb={2} fontSize={"small"}>
                        {address.street}
                    </Text>
                )}
                <Text
                    fontWeight="400"
                    mb={2}
                    fontSize={"small"}
                >{`${address.city}, ${address.country}`}</Text>
                {!isViewOnly && (
                    <Flex justify="flex-end" mt={2}>
                        <Button
                            aria-label="view address"
                            onClick={onOpen}
                            size="sm"
                            mr={3}
                        >
                            View{" "}
                        </Button>
                        <IconButton
                            aria-label="Delete address"
                            icon={<BiTrash />}
                            onClick={handleDelete}
                            isLoading={isDeleting}
                            size="sm"
                            colorScheme="red"
                        />
                    </Flex>
                )}
                {isViewOnly && (
                      <IconButton
                      aria-label="Delete address"
                      icon={<BiTrash />}
                      onClick={onRemove}
                      size="sm"
                      colorScheme="red"
                  />
                )}
            </Box>
            <Modal
                finalFocusRef={addressModalRef}
                isOpen={isOpen}
                isCentered
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent px={4} py={6}>
                    <Text fontWeight="bold" fontSize={"large"}>
                        Update Address
                    </Text>
                    <AddressForm
                        onSubmit={handleUpdateAddress}
                        isSubmiting={isUpdating}
                        address={address}
                    />
                </ModalContent>
            </Modal>
        </>
    )
}

export default AddressCard
