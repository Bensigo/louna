import { useRouter } from "expo-router"
import QuestionnaireV2 from "../../questionaire/v2"
import { useRecipePref } from "../../../context/receipePref"
import { View } from "@tamagui/core"


const preference = {
    question: {
        options: [
            { title: "Quick", subtitle: "Under 15 mins perparation" },
            { title: "simple", subtitle: "8 ingredients or less" },
            { title: "Affordable", subtitle: "Easy on your budget" },
            { title: "Family Friendly", subtitle: "Varied, ideal for families" },
            { title: "Meal prep", subtitle: "Container friendly" },
        ],
        question: `What kind of recipes do you want?`,
    },
    route: "recipes/stepFour",
}

function StepThree() {
    const { updateRecipePrefData } = useRecipePref()
    const router = useRouter()

    const handleOnSelect = (answer: string | string[]) => {
        const question = preference.question.question
        updateRecipePrefData({ stepThree: { question, answer } })
        router.replace(preference.route)
    }
    return (
          <View flex={1}>
            <QuestionnaireV2 isMultiSelect {...preference} onSave={handleOnSelect} submitButtonText="Next" />
          </View>
            
     
    )
}

export default StepThree;