import { useToast, Button, Skeleton, Box, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { BiArrowBack } from "react-icons/bi";
import { api } from "~/utils/api";
import { type SessionType, SessionForm } from "./components/form";

const UpdateSessionWrapper = () => {
    const { query, replace  } = useRouter()
    const { id, } = query;

    const toast = useToast()


    const goBack = () => replace(`/dashboard/sessions`)

    const { mutate: updateSession , isLoading } = api.session.update.useMutation()
    const { data: session, isFetched } = api.session.get.useQuery({ id: id as string })
    const handleSubmit = (data: SessionType) => {
        updateSession({
            ...data,
            id: id as string,
        
        }, {
            onSuccess: () => {
                toast({
                    title: "Updated",
                    description: 'Session Updated',
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                })
                replace(`/dashboard/sessions`)
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
         <Button justifySelf={'flex-start'} my={4} onClick={goBack} leftIcon={<BiArrowBack />}>Back</Button>
         <Skeleton isLoaded={isFetched}>
             <Text  my={3} fontWeight={'bold'} fontSize={'x-large'}>Update Session</Text>
             {session &&  <SessionForm onSubmit={handleSubmit} isSubmitting={isLoading} session={session}  />}
             </Skeleton>
         </Box>
        </>
    )
}

export { UpdateSessionWrapper }