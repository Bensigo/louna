import { Box, Heading, useToast } from "@chakra-ui/react"
import { ExpertForm } from "./component/ExpertForm"
import {type  InstructorType } from "./schema/instructor"
import { api } from "~/utils/api"
import { useRouter } from "next/router"


// const 

const CreateExpertWrapper = () => {

    const toast = useToast()
    const router = useRouter()
    const { mutate: create, isLoading } = api.instructor.create.useMutation()

    const handleSsubmitForm = (data: InstructorType) => {
        create(data, {
            onSuccess: () => {
                toast({
                    title: "Created",
                    description: 'Instructor created',
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                })
                router.push('/dashboard/solu-instructor')
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
        <Box>
            <Heading>Add New Instructor</Heading>
            <Box my={3} maxW={800} py={5}>
               <ExpertForm onSubmit={handleSsubmitForm} isSubmiting={isLoading} />
            </Box>
        </Box>
    )
}

export { CreateExpertWrapper }