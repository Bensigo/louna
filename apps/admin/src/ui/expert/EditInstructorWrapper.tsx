import { useRouter } from "next/router"
import { Box, Button, Heading, Skeleton, useToast } from "@chakra-ui/react"
import { BiArrowBack } from "react-icons/bi"

import { api } from "~/utils/api"
import { ExpertForm } from "./component/ExpertForm"
import {type  InstructorType } from "./schema/instructor"

const EditExpertWrapper = () => {
    const { query, back, replace } = useRouter()
    const id = query.id as string
    const toast = useToast()

    const { data: instructor, isLoading,  } = api.instructor.get.useQuery({ id })
    const { mutate: update, isLoading: isSubmiting } = api.instructor.edit.useMutation()

    const handleSsubmitForm = (data: InstructorType) => {
        update({
            id,
            ...data
        }, {
            onSuccess: () => {
                toast({
                    title: "Updated",
                    description: 'Instructor Updated',
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                })
                replace("/dashboard/solu-instructor")
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
                {instructor && (
                    <>
                        <Heading>Edit Instructor</Heading>
                        <Box my={3} maxW={800} py={5}>
                            <ExpertForm
                                onSubmit={handleSsubmitForm}
                                instructor={instructor}
                                isSubmiting={isSubmiting}
                                btnText="Save"
                            />
                        </Box>
                    </>
                )}
            </Skeleton>
        </>
    )
}

export { EditExpertWrapper }
