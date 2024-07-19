import { useEffect, useState } from "react"
import { format } from "date-fns"
import { ScrollView, Text, View, XStack, YStack } from "tamagui"

import { ActivityList } from "../../../components/RecommendedActivities"
import { StressCard } from "../../../components/breathingGoalCard"
import { StepCard } from "../../../components/stepsGoalCard"
import { StretchingCard } from "../../../components/flexibilityGoalCard"
import { api } from "../../../utils/api"

const TodayScreen = () => {
    const [transformedGoalData, setTransformedGoalsData] = useState<{[key: string]: number }>({})
    const { isLoading, data } = api.auth.getProfile.useQuery()


    const { isLoading: loadingGoals, data: goals} = api.goal.get.useQuery()

    useEffect(() => {
       if (goals && !!goals.length){
        const currData = goals.reduce((acc, item) => {
            acc[item.name] = Number(item.value);
            return acc;
        }, {});
        setTransformedGoalsData(currData)
       }
    }, [goals])



    const getDayAndMonth = (() => {
        const today = new Date()
        const formattedDate = format(today, "dd MMMM")
        return formattedDate
    })()

    return (
        <View flex={1} mt="$4" px={"$4"}>
            <View mt="$4" flex={1}>
                <XStack
                    justifyContent="space-between"
                    alignItems="center"
                    mb={"$4"}
                >
                    <XStack alignItems="flex-end" gap="$2.5">
                        <Text
                            fontSize={"$10"}
                            fontWeight={"$15"}
                            color={"#689f38"}
                        >
                            Today
                        </Text>
                        <Text
                            fontSize={"$7"}
                            fontWeight={"$13"}
                            color={"#689f38"}
                        >
                            {getDayAndMonth}
                        </Text>
                    </XStack>
                </XStack>
                {/* <TabsScreen /> */}
                <ScrollView
                    flex={1}
                    showsHorizontalScrollIndicator={false}
                    horizontal={false}
                    style={{ paddingTop: 20 }}
                >
                    {!isLoading && !loadingGoals && !!Object.keys(transformedGoalData).length && (
                        <>
                            <ActivityList />
                            <YStack>
                                <Text
                                    fontSize="$5"
                                    fontWeight="bold"
                                    color="#333"
                                >
                                    Daily Goal
                                </Text>
                                <StepCard user={data} maxSteps={transformedGoalData['steps']} />

                                <StressCard maxValue={transformedGoalData['breathing']} />
                                <StretchingCard maxValue={transformedGoalData['flexibility']} />
                            </YStack>
                        </>
                    )}
                </ScrollView>
            </View>
        </View>
    )
}

export default TodayScreen
