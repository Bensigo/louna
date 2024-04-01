import { api } from "~/utils/api"
import { type CreatePartnerType, PartnerForm } from "./components/PartnerForm"
import { useToast, Skeleton, Button, Heading, Box } from "@chakra-ui/react"

import { useRouter } from "next/router"
import { BiArrowBack } from "react-icons/bi"


const EditPartnerProfileWrapper = () => {
    const { query, replace, back } = useRouter()
    const id = query.id as string
    // const pathname = usePathname()
    const toast = useToast()

    const { data: partner, isLoading} = api.partner.get.useQuery({ id })

    const { mutate: update, isLoading: isSubmiting } = api.partner.update.useMutation()

    const handleSubmit = (data: CreatePartnerType) => {
        update({
            id,
            ...data
        }, {
            onSuccess: () => {
                toast({
        
                    description: 'Partner Profile Updated',
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                })
                replace("/dashboard/partners")
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
                {partner && (
                    <>
                        <Heading>Edit Partner profile</Heading>
                        <Box my={3} maxW={800} py={5}>
                            <PartnerForm onSubmit={handleSubmit} isSubmiting={isSubmiting} partner={partner} />
                        </Box>
                    </>
                )}
            </Skeleton>
        </>
    )
}

export { EditPartnerProfileWrapper }