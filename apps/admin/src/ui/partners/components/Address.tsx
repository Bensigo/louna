import { useRef } from "react"
import {
    Button,
    HStack,
    Modal,
    ModalContent,
    ModalOverlay,
    Skeleton,
    Text,
    useDisclosure,
    useToast,
    VStack,
} from "@chakra-ui/react"
import { BiPlus } from "react-icons/bi"

import { api } from "~/utils/api"
import AddressCard from "./AddressCard"
import AddressForm, { type AddressData } from "./AddressForm"

const Address = ({ id }: { id: string }) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const addressModalRef = useRef(null)

    const toast = useToast()

    const ctx = api.useUtils()
    const { data: addresses, isLoading } = api.address.list.useQuery({ id })
    const { mutate: create , isLoading: isSubmiting } = api.address.create.useMutation()
    const { mutate: deleteAddress, isLoading: isDeleting } = api.address.delete.useMutation()

    const handleSubmitAddress = (data: AddressData) => {
        // handle create
        create({  partnerId: id, ...data }, {
            onSuccess: () => {
                toast({
                    title: "Address added successfully",
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
            }
        })
       
        onClose()
    }

    const handleDeleteAddress = (id: string) => {
        // handle delete

        deleteAddress({ id }, {
            onSuccess: () => {
                toast({
                    title: "Address deleted successfully",
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
            }
        })
    }

    return (
        <VStack align="start" spacing={4}>
            <HStack justifyContent={"space-between"} width={"100%"}>
                <Text fontWeight="bold">Addresses</Text>
                <Button leftIcon={<BiPlus />} onClick={onOpen}>
                    Add Address
                </Button>
            </HStack>
            <Modal
                finalFocusRef={addressModalRef}
                isOpen={isOpen}
                isCentered
                onClose={onClose}
            >
                <ModalOverlay />
                <ModalContent px={4} py={6}>
                    <Text fontWeight="bold" fontSize={"large"}>
                        Add new Address
                    </Text>
                    <AddressForm
                        onSubmit={handleSubmitAddress}
                        isSubmiting={isSubmiting}
                    />
                </ModalContent>
            </Modal>
            <Skeleton isLoaded={!isLoading}>
               <HStack wrap={'wrap'} spacing={2}>
               {addresses?.map((address, index) => (
                    <AddressCard
                        key={index}
                        address={address}
                        isViewOnly={false}
                        onDelete={handleDeleteAddress}
                        isDeleting={isDeleting}
                    />
                ))}
               </HStack>
            </Skeleton>
        </VStack>
    )
}

export { Address }
