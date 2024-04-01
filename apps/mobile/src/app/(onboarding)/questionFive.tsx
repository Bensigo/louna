import { useRouter } from "expo-router"
import { View } from "@tamagui/core"
import { usePref } from "../../context/usePref"
import Questionnaire from "../../components/questionaire"


export const FITNESS_GOAL_DIFFCULTY_QUE = 'What has prevented you from reaching these goals in the past?' 

const preference = {
    question: {
        options: [
            { label: "Lack of time" },
            { label: "Lack of motivation" },
            { label: "No idea how to start" },
            { label: "Lack of support" },
        ],
        question: FITNESS_GOAL_DIFFCULTY_QUE ,
    },
    route: "(onboarding)/recipeWelcome",
}

function QuestionFiveScreen() {
    const { update , data } = usePref()
    const router = useRouter()

    const handleOnSelect = (answer: string | string[]) => {
        const question = preference.question.question
        update({ fitness: {  ...data.fitness, quetionFive: { question, answer: answer } }})
        router.replace(preference.route)
    }
    return (
          <View flex={1}>
            <Questionnaire isMultiSelect {...preference} onSave={handleOnSelect} submitButtonText="Next"  />
          </View>
            
     
    )
}

export default QuestionFiveScreen;