import { H2, ScrollView, SizableText, Tabs, View } from "tamagui"

import { WorkOutView } from "../../../components/workoutView"
import { api } from "../../../utils/api"

const Home = () => {
    const { isLoading, data: profile } = api.auth.getProfile.useQuery()
  
    return (
        <View flex={1} mt="$4" marginHorizontal="$2">
            <H2 fontSize={"$9"} fontWeight={"$15"}>
                Workouts
            </H2>
            <View mt="$4">
                <Tabs defaultValue="For You" flexDirection="column" mt="$2">
                    <Tabs.List space="$1" mb="$2">
                        <Tabs.Tab value="For You">
                            <SizableText fontSize={"$3"}>For You</SizableText>
                        </Tabs.Tab>
                        <Tabs.Tab value="Guidance">
                            <SizableText fontSize={"$3"}>Guidance</SizableText>
                        </Tabs.Tab>
                        <Tabs.Tab value="Personal Trainer">
                            <SizableText fontSize={"$3"}>
                                Personal Trainer
                            </SizableText>
                        </Tabs.Tab>
                    </Tabs.List>
                    <Tabs.Content value="For You">
                        
                            <WorkOutView />
                        
                    </Tabs.Content>
                    <Tabs.Content value="Guidance">
                        <H2>Guide</H2>
                    </Tabs.Content>
                    <Tabs.Content value="Personal Trainer">
                        <H2>PT</H2>
                    </Tabs.Content>
                </Tabs>
            </View>
        </View>
    )
}

export default Home