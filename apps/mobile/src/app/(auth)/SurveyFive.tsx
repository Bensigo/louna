import { useRouter } from "expo-router"

import Questionnaire from "../../components/questionaire"
import { useSurvey } from "../../context/survey"

const survey = {
    question: {
        options: [
            { label: "🔥 Weight Loss" },
            { label: "Maintain Weight" },
            { label: "Gain Weight" },
            { label: "Build muscle" },
        ],
        question: `What's is your main goal 5?`,
    },
    isMultiSelect: true,
    submitButtonText: "Finish",
    route: "login",
}

function SurveyFive() {
    const { surveyData, updateSurveyData } = useSurvey()
    const router = useRouter()
    console.log({ surveyData })

    const handleSave = (answer: string | string[]) => {
        const question = survey.question.question
        console.log({ h: "1223344" })
        updateSurveyData({ surveyFive: { question, answer } })
        // TODO: send survey data to API before route
        router.replace("login")
    }

    return <Questionnaire {...survey} onSave={handleSave} />
}

export default SurveyFive
