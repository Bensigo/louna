import { Box, Button, Heading, Skeleton, useToast } from "@chakra-ui/react"
import { usePathname } from "next/navigation"
import { api } from "~/utils/api"
import { SMWForm } from "./components/SmwForm"
import { BiArrowBack } from "react-icons/bi"
import { type CreateSMWFormSchemaType } from "./schema"
import { useRouter } from "next/router"



const EditSMWWrapper = () => {
    const { query, replace, back } = useRouter()
    const id = query.id as string
    // const pathname = usePathname()
    const toast = useToast()

    const { data: smw, isLoading,  } = api.smw.get.useQuery({ id })
    const { mutate: update, isLoading: isSubmiting } = api.smw.edit.useMutation()

    const handleSubmitForm = (data: CreateSMWFormSchemaType) => {
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
                replace("/dashboard/smw")
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
                {smw && (
                    <>
                        <Heading>Edit SMW</Heading>
                        <Box my={3} maxW={800} py={5}>
                            <SMWForm
                                onSubmit={handleSubmitForm}
                                smw={smw}
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


export {EditSMWWrapper}