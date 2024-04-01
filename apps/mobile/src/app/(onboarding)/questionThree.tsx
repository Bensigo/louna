


import { useRouter } from "expo-router"
import { View } from "@tamagui/core"
import { usePref } from "../../context/usePref"
import Questionnaire from "../../components/questionaire"


export const FITNESS_GOAL_QUE = 'What are your fitness goals?'

const preference = {
    question: {
        options: [
            { label: "Weight loss" },
            { label: "Muscle tone" },
            { label: "Endurance improvement" },
            { label: "Stress relief" },
        ],
        question: FITNESS_GOAL_QUE,
    },
    route: "(onboarding)/questionFour",
}

function QuestionThreeScreen() {
    const { update , data } = usePref()
    const router = useRouter()

    const handleOnSelect = (answer: string | string[]) => {
        const question = preference.question.question
        update({ fitness: {  ...data.fitness, quetionThree: { question, answer: answer } }})
        router.replace(preference.route)
    }
    return (
          <View flex={1}>
            <Questionnaire isMultiSelect {...preference} onSave={handleOnSelect} submitButtonText="Next"  />
          </View>
            
     
    )
}

export default QuestionThreeScreen;