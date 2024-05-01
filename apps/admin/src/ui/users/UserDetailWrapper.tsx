import { useRouter } from "next/router"
import { Box, Button, Skeleton, Text } from "@chakra-ui/react"
import { BiArrowBack } from "react-icons/bi"

import { api } from "~/utils/api"
import { UserInfo } from "./components/UserInfo"

const UserDetailWrapper = () => {
    const { query, back } = useRouter()
    const id = query.id as string

    const { data, isFetched, isLoading } = api.user.get.useQuery({ id })

    const goBack = () => back()

    return (
        <>
            <Box>
                {isLoading && !isFetched && (
                    <Skeleton minH={400} mt={2} width={"100%"} />
                )}
                {isFetched && data && (
                    <Box>
                        <Button onClick={goBack} leftIcon={<BiArrowBack />}>
                            Back
                        </Button>
                        <UserInfo user={data} />
                        <Text>Health Stats</Text>
                         steps
                         hrv
                         suggested calories intakes
                         activites booking
                         create report 
                    </Box>
                )}
            </Box>
        </>
    )
}

export { UserDetailWrapper }
