import { Ionicons } from "@expo/vector-icons"
import { useLocalSearchParams } from "expo-router"
import { TouchableOpacity } from "react-native"
import { View, Text, Card, XStack } from "tamagui"
import { EditGoalCard } from "../../../../components/editGoalCard"
import { Colors } from "../../../../constants/colors"


const GoalDetailScreen = () => {
    const { maxStepsCount, stepsCount  } = useLocalSearchParams()
    

    const getValPercent = (() => {
        const val = Number(stepsCount)
        const maxVal = Number(maxStepsCount ?? 0)
        if (maxVal === 0) {
            throw new Error("maxValue cannot be zero");
        }
        return (val / maxVal) * 100;
    })()

    const handleSyncData = ()=> {
        // handle sync data
    }

    return (
        <View  padding={10} mt={'$4'}>
           <EditGoalCard message=""  name="steps" currentValue={Number(stepsCount)} goal={Number(maxStepsCount)} valPercent={getValPercent} /> 

           <Card padding="$4" backgroundColor={'white'} mt="$3">
            <Text color={Colors.light.tint} fontSize={'$4'}> Sync  data </Text>
              <XStack justifyContent="space-between" mt="$2">
                <XStack alignItems="center">
                    <Ionicons name="heart" color={'red'} size={25}/>
                    <Text> Health app </Text>
                </XStack>
                <TouchableOpacity onPress={handleSyncData}>
                    <Ionicons name="refresh" size={25} color={Colors.light.primary} />
                </TouchableOpacity>
              </XStack>
           </Card>
        </View>
    )
}

export default GoalDetailScreen