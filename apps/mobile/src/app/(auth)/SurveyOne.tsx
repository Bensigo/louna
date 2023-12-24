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
        question: `What's is your main goal?`,
    },
    route: "SurveyTwo",
}

function SurveyOne() {
    const { updateSurveyData } = useSurvey()
    const router = useRouter()

    const handleOnSelect = (answer: string | string[]) => {
        const question = survey.question.question
        updateSurveyData({ surveyOne: { question, answer } })
        router.replace("SurveyTwo")
    }
    return <Questionnaire {...survey} onSave={handleOnSelect} />
}

export default SurveyOne
