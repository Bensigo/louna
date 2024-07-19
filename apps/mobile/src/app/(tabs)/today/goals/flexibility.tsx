
import { useLocalSearchParams } from "expo-router"
import { View } from "tamagui"
import { EditGoalCard } from "../../../../components/editGoalCard"


const StretchingDetailScreen = () => {
    const { maxFlexibilityCount, flexibilityCount  } = useLocalSearchParams()
   

    const getValPercent = (() => {
        const val = Number(flexibilityCount)
        const maxVal = Number(maxFlexibilityCount ?? 0)
        if (maxVal === 0) {
            throw new Error("maxValue cannot be zero");
        }
        return (val / maxVal) * 100;
    })()


    return (
        <View padding={10} mt={'$5'}>
           <EditGoalCard message=""  name="flexibility" currentValue={Number(flexibilityCount)} goal={Number(maxFlexibilityCount)} valPercent={getValPercent} /> 
        </View>
    )
}

export default StretchingDetailScreen