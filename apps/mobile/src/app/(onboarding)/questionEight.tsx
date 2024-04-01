


import { useRouter } from "expo-router"
import { View } from "@tamagui/core"
import { usePref } from "../../context/usePref"
import Questionnaire from "../../components/questionaire"


const preference = {
    question: {
        options: [
            { label: "Quick" },
            { label: "Simple" },
            { label: "Affordable" },
            { label: "Family-friendly" },
            { label: "Meal prep" },
         
        ],
        question: `What kind of recipes do you want?`,
    },
    route: "(onboarding)/questionNine",
}

function QuestionEightScreen() {
    const { update , data } = usePref()
    const router = useRouter()

    const handleOnSelect = (answer: string | string[]) => {
        const question = preference.question.question
        update({...data, dietary: {  ...data.dietary, questionEight: { question, answer: answer } }})
        router.replace(preference.route)
    }
    return (
          <View flex={1}>
            <Questionnaire isMultiSelect {...preference} onSave={handleOnSelect} submitButtonText="Next"  />
          </View>
            
     
    )
}

export default QuestionEightScreen;