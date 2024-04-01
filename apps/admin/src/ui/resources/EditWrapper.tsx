import { api } from "~/utils/api"
import Form from "./components/Form"
import { useRouter } from "next/router"
import { Box, Button, Heading, Skeleton, useToast } from "@chakra-ui/react"
import { type CreateResourceFormSchemaType } from "./schema"
import { BiArrowBack } from "react-icons/bi"



export const EditResourcesWrapper = () => {
    const { query, replace, back } = useRouter()
    const id = query.id as string
    // const pathname = usePathname()
    const toast = useToast()

    const { data: resource, isLoading,  } = api.resource.get.useQuery({ id })
    const { mutate: update, isLoading: isSubmiting } = api.resource.update.useMutation()

    const handleSubmitForm = (data:CreateResourceFormSchemaType ) => {
        update({
            id,
            ...data
        }, {
            onSuccess: () => {
                toast({
                    title: "Updated",
                    description: 'Resource Updated',
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                })
                replace("/dashboard/resources")
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
         <Skeleton isLoaded={!isLoading}>
                <Button onClick={back} my={2} leftIcon={<BiArrowBack />}>
                    Back
                </Button>
                {resource && (
                    <>
                        <Heading>Edit SMW</Heading>
                        <Box my={3} maxW={800} py={5}>
                        <Form onSubmit={handleSubmitForm} isSubmiting={isSubmiting} resource={resource} />
                        </Box>
                    </>
                )}
            </Skeleton>
        </>
    )
}
