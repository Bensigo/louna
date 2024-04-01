

import { useRouter } from "expo-router"
import { View } from "@tamagui/core"
import { usePref } from "../../context/usePref"
import Questionnaire from "../../components/questionaire"

export const MEAL_FREQUENCY_QUESTION = 'How many meals do you have per day?'
const preference = {
    question: {
        options: [
            { label: "1 with a snack" },
            { label: "2 with a snack" },
            { label: "3 with a snack" },
            { label: "more than 3" },
        ],
        question: MEAL_FREQUENCY_QUESTION,
    },
    route: "(onboarding)/wellnessWelcome",
}

function QuestionNineScreen() {
    const { update , data } = usePref()
    const router = useRouter()

    const handleOnSelect = (answer: string | string[]) => {
        const question = preference.question.question
        update({ ...data, dietary: { ...data.dietary,  questionNine: { question, answer: answer } }})
        router.replace(preference.route)
    }
    return (
          <View flex={1}>
            <Questionnaire {...preference} onSave={handleOnSelect}  />
          </View>
            
     
    )
}

export default QuestionNineScreen;