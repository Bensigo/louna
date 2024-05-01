import { useToast, Button , Box, Text } from "@chakra-ui/react"

import { useRouter } from "next/router"
import { BiArrowBack } from "react-icons/bi"
import { api } from "~/utils/api"
import  { type SessionType, SessionForm } from "./components/form"



const CreateSessionWrapper = () => {
    const {  replace } = useRouter()

    
    const goBack = () => replace(`/dashboard/sessions`)
    const toast = useToast()

    const { mutate: create, isLoading } = api.session.create.useMutation()

    const handleSubmit = (data: SessionType) => {
     
        create({
            ...data,
            description: String(data.description),
        }, {
            onSuccess: () => {
                toast({
                    title: "Created",
                    description: 'Session created',
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                })
                replace(`/dashboard/sessions`)
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
                     <SessionForm onSubmit={handleSubmit} isSubmitting={isLoading}  />
                </Box>
            </Box>
        </>
    )
}

export { CreateSessionWrapper }