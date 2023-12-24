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
        question: `What's is your main goal 3?`,
    },
    isMultiSelect: true,
    submitButtonText: "Next",
    route: "SurveyFour",
}

function SurveyThree() {
    const router = useRouter()
    const { updateSurveyData } = useSurvey()

    const handleNext = (answer: string | string[]) => {
        const question = survey.question.question
        updateSurveyData({ surveyThree: { question, answer } })
        router.replace("SurveyFour")
    }

    return <Questionnaire {...survey} onSave={handleNext} />
}

export default SurveyThree
