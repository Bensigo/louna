import { Box, Heading, useToast } from "@chakra-ui/react"

import { SMWForm } from "./components/SmwForm"
import { type CreateSMWFormSchemaType } from "./schema"
import { api } from "~/utils/api"
import { useRouter } from "next/router"

const CreateSmwWrapper = () => {
    const { replace } = useRouter()
    const toast = useToast()
    const { isLoading: isSubmiting, mutate: create} = api.smw.create.useMutation()

    const handleSubmit = (data: CreateSMWFormSchemaType) => {
       create(data, {
        onSuccess: () => {
            toast({
                title: "Created",
                description: 'smw created',
                status: "success",
                duration: 9000,
                isClosable: true,
            })
            replace('/dashboard/smw')
        },
        onError:  err => {
             
            toast({
                title: "Error",
                description: err.message,
                status: "error",
                duration: 9000,
                isClosable: true,
            })
        }
       })
    }

    return (
        <>
            <Box>
                <Heading color="gray.700">Add New SMW</Heading>
                <Box my={3} maxW={800} py={5}></Box>
                <SMWForm onSubmit={handleSubmit} isSubmiting={isSubmiting} />
            </Box>
        </>
    )
}

export { CreateSmwWrapper }
