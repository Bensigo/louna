import { Box } from "@chakra-ui/layout"
import { Button, Text, useToast } from "@chakra-ui/react"
import { useRouter } from "next/router"
import { BiArrowBack } from "react-icons/bi"
import { SessionForm, type SessionType } from "./components/SessionForm"
import { api } from "~/utils/api"




const CreateSessionWrapper = () => {
    const { query, replace } = useRouter()
    const { id } = query
    
    const goBack = () => replace(`/dashboard/partners/${id}/sessions`)
    const toast = useToast()

    const { mutate: create, isLoading } = api.session.create.useMutation()

    const handleSubmit = (data: SessionType) => {
     
        create({
            ...data,
            description: String(data.description),
            partnerId: id as string,
        }, {
            onSuccess: () => {
                toast({
                    title: "Created",
                    description: 'Session created',
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                })
                replace(`/dashboard/partners/${id}/sessions`)
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
                <Button justifySelf={'flex-start'} my={4} onClick={goBack} leftIcon={<BiArrowBack />}>Back</Button>
                <Text  fontWeight={"bold"} fontSize={"x-large"}>
                    Create New Session
                </Text>
                <Box py={3}>
                   {id &&  <SessionForm onSubmit={handleSubmit} isSubmitting={isLoading} partnerId={id as string}  />}
                </Box>
            </Box>
        </>
    )
}

export { CreateSessionWrapper }
