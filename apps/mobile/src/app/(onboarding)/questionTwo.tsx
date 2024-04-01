

import { useRouter } from "expo-router"
import { View } from "@tamagui/core"
import { usePref } from "../../context/usePref"
import Questionnaire from "../../components/questionaire"


export const FITNESS_LEVEL_QUESTION = 'What is your current fitness level?'

const preference = {
    question: {
        options: [
            { label: "Beginner" },
            { label: "Intermediate" },
            { label: "Advanced" },
        ],
        question: FITNESS_LEVEL_QUESTION,
    },
    route: "(onboarding)/questionThree",
}

function QuestionTwoScreen() {
    const { update , data } = usePref()
    const router = useRouter()

    const handleOnSelect = (answer: string | string[]) => {
        const question = preference.question.question
        update({ fitness: { ...data.fitness,  quetionTwo: { question, answer: answer } }})
        router.replace(preference.route)
    }
    return (
          <View flex={1}>
            <Questionnaire {...preference} onSave={handleOnSelect}  />
          </View>
            
     
    )
}

export default QuestionTwoScreen;