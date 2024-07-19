import { useLocalSearchParams } from "expo-router"
import { View } from "tamagui"
import { EditGoalCard } from "../../../../components/editGoalCard"


const BreathingDetailScreen = () => {
    const { breathCount, stressLevel, maxBreathCount } = useLocalSearchParams()
    
    const getValPercent = (() => {
        const val = Number(breathCount)
        const maxVal = Number(maxBreathCount ?? 0)
        if (maxVal === 0) {
            throw new Error("maxValue cannot be zero");
        }
        return (val / maxVal) * 100;
    })()


    return (
        <View padding={10} mt={'$5'}>
           <EditGoalCard message=""  name="breathing" currentValue={Number(breathCount)} goal={Number(maxBreathCount)} valPercent={getValPercent} /> 
        </View>
    )
}

export default BreathingDetailScreen
