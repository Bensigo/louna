

import { useRouter } from "expo-router"
import { View } from "@tamagui/core"
import { usePref } from "../../context/usePref"
import Questionnaire from "../../components/questionaire"


export const STRESS_LEVEL_QUE = 'How would you rate your current stress level?'

const preference = {
    question: {
        options: [
            { label: "Low" },
            { label: "Moderate" },
            { label: "High" },
        
        ],
        question: STRESS_LEVEL_QUE,
    },
    route: "(onboarding)/questionEleven",
}

function QuestionTenScreen() {
    const { update , data } = usePref()
    const router = useRouter()

    const handleOnSelect = (answer: string | string[]) => {
        const question = preference.question.question
        update({ ...data, wellness: { ...data.wellness,  questionTen: { question, answer: answer } }})
        router.replace(preference.route)
    }
    return (
          <View flex={1}>
            <Questionnaire {...preference} onSave={handleOnSelect}  />
          </View>
            
     
    )
}

export default QuestionTenScreen;