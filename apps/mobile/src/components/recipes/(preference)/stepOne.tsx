import { useRouter } from "expo-router"
import Questionnaire from "../../questionaire"
import { useRecipePref } from "../../../context/receipePref"
import { View } from "@tamagui/core"


const preference = {
    question: {
        options: [
            { label: "Standard" },
            { label: "Vegetarian" },
            { label: "Vegan" },
            { label: "Paleo" },
        ],
        question: `What is your diet type?`,
    },
    route: "recipes/stepTwo",
}

function StepOne() {
    const { updateRecipePrefData } = useRecipePref()
    const router = useRouter()

    const handleOnSelect = (answer: string | string[]) => {
        const question = preference.question.question
        updateRecipePrefData({ stepOne: { question, answer } })
        router.replace(preference.route)
    }
    return (
          <View flex={1}>
            <Questionnaire {...preference} onSave={handleOnSelect}  />
          </View>
            
     
    )
}

export default StepOne;