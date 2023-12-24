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
        question: `What's is your main Purpose 2?`,
    },
    isMultiSelect: true,
    submitButtonText: "Next",
    route: "SurveyThree",
}

function SurveyTwo() {
    const { updateSurveyData } = useSurvey()
    const router = useRouter()
    const handleNext = (answer: string | string[]) => {
        const question = survey.question.question
        updateSurveyData({ surveyTwo: { question, answer } })
        router.replace("SurveyThree")
    }
    return <Questionnaire {...survey} onSave={handleNext} />
}

export default SurveyTwo
