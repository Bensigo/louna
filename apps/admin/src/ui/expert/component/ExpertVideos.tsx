import { Box, HStack, Skeleton, Text } from "@chakra-ui/react"

import { SMWCard } from "~/ui/smw/components/SMWCard"

type ExpertVideoType = {
    isLoading: boolean
    smws: any[]
}

const ExpertVideos: React.FC<ExpertVideoType> = ({
    smws,
    isLoading,
}) => {
    console.log({ smws })

    return (
        <>
            {smws && smws.length ? (
                <HStack spacing={5} flexFlow={"wrap"} width={"inherit"} mb={5}>
                    {smws.map((smw) => (
                        <Skeleton isLoaded={!isLoading} key={smw.id}>
                            <SMWCard smw={smw}  path={`/dashboard/smw/${smw.id}`}/>
                        </Skeleton>
                    ))}
                </HStack>
            ) : (
                <Box>
                    <Text>No videos found</Text>
                </Box>
            )}
        </>
    )
}
export { ExpertVideos }
