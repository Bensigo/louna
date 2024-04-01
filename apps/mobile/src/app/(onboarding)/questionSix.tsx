

import { useRouter } from "expo-router"
import { View } from "@tamagui/core"
import { usePref } from "../../context/usePref"
import Questionnaire from "../../components/questionaire"

export const DIET_TYPE_QUESTION = 'What is your diet type?'
const preference = {
    question: {
        options: [
            { label: "Paleo" },
            { label: "Vegan" },
            { label: "Vegetarian" },
            { label: "Standard" },
            { label: "Pescetarian"},
            { label: "others"}
        ],
        question: DIET_TYPE_QUESTION,
    },
    route: "(onboarding)/questionSeven",
}

function QuestionSixScreen() {
    const { update , data } = usePref()
    const router = useRouter()

    const handleOnSelect = (answer: string | string[]) => {
        const question = preference.question.question
        update({ ...data, dietary: { ...data.dietary,  quetionSix: { question, answer: answer } }})
        router.replace(preference.route)
    }
    return (
          <View flex={1}>
            <Questionnaire {...preference} onSave={handleOnSelect}  />
          </View>
            
     
    )
}

export default QuestionSixScreen;