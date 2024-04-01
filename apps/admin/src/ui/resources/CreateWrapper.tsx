import { useToast, Heading, Box } from "@chakra-ui/react"

import { useRouter } from "next/router"
import { api } from "~/utils/api"
import Form from "./components/Form"
import { type CreateResourceFormSchemaType } from "./schema"


export const CreateResourcesWrapper = () => {
    const { replace } = useRouter()
    const toast = useToast()
    const { isLoading: isSubmiting, mutate: create} = api.resource.create.useMutation()

    const handleSubmit = (data: CreateResourceFormSchemaType) => {
       create(data, {
        onSuccess: () => {
            toast({
                title: "Created",
                description: 'smw created',
                status: "success",
                duration: 9000,
                isClosable: true,
            })
            replace('/dashboard/resources')
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
                <Heading color="gray.700">Add New Resource</Heading>
                <Box my={3} maxW={800} py={5}></Box>
                <Form onSubmit={handleSubmit} isSubmiting={isSubmiting} />
            </Box>
        </>
    )
}
