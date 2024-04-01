import { Box , Text, useToast } from "@chakra-ui/react"
import { type CreatePartnerType, PartnerForm } from "./components/PartnerForm"
import { api } from "~/utils/api"
import { useRouter } from "next/router"


const CreatePartnerWrapper = () => {


    const { isLoading, mutate: createPartner } = api.partner.create.useMutation()
    const toast = useToast()
    const {replace}  = useRouter()

    const handleSubmitPartner = (data: CreatePartnerType) => {
      
        createPartner(data, {
            onSuccess: () => {
                toast({
                    title: "Created",
                    description: 'Partner created',
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                })
                replace('/dashboard/partners')
            },
            onError: (err) => {
                
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
             <Text  my={3} fontWeight={'bold'} fontSize={'x-large'}>Create Partner Profile</Text>
            <PartnerForm onSubmit={handleSubmitPartner} isSubmiting={isLoading} />
         </Box>
        </>
    )
}


export { CreatePartnerWrapper }