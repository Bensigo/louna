import { Box, Button, Tab, TabList, TabPanel, TabPanels, Tabs } from "@chakra-ui/react"
import { useRouter } from "next/router"
import { ExpertProfile } from "./component/ExpertProfile"
import { ExpertVideos } from "./component/ExpertVideos"
import { BiArrowBack } from "react-icons/bi"
import { api } from "~/utils/api"



const ExpertDetailWrapper = () => {
    const { query, back } = useRouter()
    const id = query.id as string

    const { isLoading, data: profile } = api.instructor.get.useQuery({ id })
    
    return(
        <Box>
              <Button onClick={back} my={2} leftIcon={<BiArrowBack />} >Back</Button>
            <Tabs variant={"soft-rounded"} colorScheme="orange" isLazy>
                <TabList>
                    <Tab>Profile</Tab>
                    <Tab>Videos</Tab>
                </TabList>
                <TabPanels >
                    <TabPanel>
                        <ExpertProfile profile={profile} isLoading={isLoading} />
                    </TabPanel>
                    <TabPanel>
                    <ExpertVideos  smws={profile?.smw} isLoading={isLoading}  />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Box>
    )
}

export { ExpertDetailWrapper }