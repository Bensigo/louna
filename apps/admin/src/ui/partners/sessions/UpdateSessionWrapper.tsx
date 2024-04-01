import { useRouter } from "next/router"

import { Box, Button, useToast, Text, Skeleton } from "@chakra-ui/react";
import { SessionForm, type SessionType } from "./components/SessionForm";
import { api } from "~/utils/api";
import { BiArrowBack } from "react-icons/bi";


const UpdateSessionWrapper = () => {
    const { query, replace  } = useRouter()
    const { sessionId, id } = query;

    const toast = useToast()


    const goBack = () => replace(`/dashboard/partners/${id}/sessions`)

    const { mutate: updateSession , isLoading } = api.session.update.useMutation()
    const { data: session, isFetched } = api.session.get.useQuery({ id: sessionId as string })
    const handleSubmit = (data: SessionType) => {
        updateSession({
            ...data,
            id: sessionId as string,
            partnerId: id as string,
        }, {
            onSuccess: () => {
                toast({
                    title: "Updated",
                    description: 'Session Updated',
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                })
                replace(`/dashboard/partners/${id}/sessions`)
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
             {session &&  <SessionForm onSubmit={handleSubmit} isSubmitting={isLoading} session={session} partnerId={id as string}  />}
             </Skeleton>
         </Box>
        </>
    )
}

export { UpdateSessionWrapper }