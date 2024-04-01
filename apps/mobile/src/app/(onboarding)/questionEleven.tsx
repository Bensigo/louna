import { useRouter } from "expo-router"
import { View } from "@tamagui/core"

import Questionnaire from "../../components/questionaire"
import { usePref } from "../../context/usePref"
import { api } from "../../utils/api"
import { FITNESS_GOAL_DIFFCULTY_QUE } from "./questionFive"
import { FITNESS_HEALTH_CONDITION_QUE } from "./questionFour"
import { MEAL_FREQUENCY_QUESTION } from "./questionNine"
import { FITNESS_AGE_QUE } from "./questionOne"
import { FOOD_DISLIKE_QUESTION } from "./questionSeven"
import { DIET_TYPE_QUESTION } from "./questionSix"
import { FITNESS_GOAL_QUE } from "./questionThree"
import { FITNESS_LEVEL_QUESTION } from "./questionTwo"
import { STRESS_LEVEL_QUE } from "./questionTen"

interface QuestionAnswer {
    question: string
    answer: any
}

type KeyValueAny = {
    [key: string]: any
}

const STRESS_MANAGEMENT_METHOD_QUE = 'How do you currently manage stress?'

const extractQuestionAnswer = (data: any): KeyValueAny => {
    const categories: QuestionAnswer = Object.values(data)
    let result = {}
    for (const item of categories) {
        result[item.question] = item.answer
    }
    return result
}

const getUserDietaryPref = (dietary: KeyValueAny) => {
    const dietOnboading = extractQuestionAnswer(dietary)

    const dislikes = dietOnboading[FOOD_DISLIKE_QUESTION] || []
    const frequency = dietOnboading[MEAL_FREQUENCY_QUESTION]
    const diet = dietOnboading[DIET_TYPE_QUESTION]
    const prefs = Object.keys(dietOnboading)
        .filter(
            (question) =>
                ![
                    DIET_TYPE_QUESTION,
                    MEAL_FREQUENCY_QUESTION,
                    FOOD_DISLIKE_QUESTION,
                ].includes(question),
        )
        .flatMap((question) => dietOnboading[question])

    return { dislikes, prefs, frequency, diet }
}

const getUserFitnessPref = (fitnessData: KeyValueAny) => {
    const fitnessOnboading = extractQuestionAnswer(fitnessData)
    const age = fitnessOnboading[FITNESS_AGE_QUE]
    const fitnessLevel = fitnessOnboading[FITNESS_LEVEL_QUESTION]
    const healthConditions = fitnessOnboading[FITNESS_HEALTH_CONDITION_QUE]
    const fitnesGoal = fitnessOnboading[FITNESS_GOAL_QUE]
    const fitnessDiffculty = fitnessOnboading[FITNESS_GOAL_DIFFCULTY_QUE]

    return { age, fitnessLevel, fitnesGoal, fitnessDiffculty, healthConditions }
}

const  getWellnessPref = (wellness: KeyValueAny) => {
    const stressOnboading = extractQuestionAnswer(wellness)
    const stressLevel = stressOnboading[STRESS_LEVEL_QUE]
    const stressManagement = stressOnboading[STRESS_MANAGEMENT_METHOD_QUE]
    return { stressLevel, stressManagement }
}




const preference = {
    question: {
        options: [
            { label: "Exercise" },
            { label: "Meditation" },
            { label: "Breathing exercises" },
            { label: "Time in nature" },
            { label: "Others" },
        ],
        question: STRESS_MANAGEMENT_METHOD_QUE,
    },
    route: "",
}

function QuestionElevenScreen() {
    const { update, data } = usePref()
    const router = useRouter()

    const { mutate, isLoading } = api.preference.upsert.useMutation()
    const ctx = api.useUtils()

    const toArrayObj = (obj: any) => {
        const result = []
        for (let [key, value] of Object.entries(obj)) {
            const curr = { question: key, answer: value }
            result.push(curr)
        }
        return result
    }

    const handleOnSelect = (answer: string | string[]) => {
        const question = preference.question.question
        const currentUpdate = {
            ...data,
            wellness: {
                ...data.wellness,
                questionEleven: { question, answer: answer },
            },
        }
        update(currentUpdate)
        // router.replace(preference.route)

        const { fitness, wellness, dietary } = currentUpdate

        const {
            dislikes: foodDislike,
            diet,
            prefs: dietPref,
            frequency: mealFrequency,
        } = getUserDietaryPref(dietary)
        const {
            age,
            fitnesGoal,
            fitnessDiffculty,
            fitnessLevel,
            healthConditions,
        } = getUserFitnessPref(fitness)

        const { stressLevel, stressManagement} = getWellnessPref(wellness)

        mutate({
            fitness: {
                age,
                fitnesGoal,
                fitnessDiffculty,
                fitnessLevel,
                healthConditions,
            },
            wellness: {
                stressLevel,
                stressManagement
            },
            diet: {
                foodDislike,
                diet,
                dietPref,
                mealFrequency,
            }
        }, {
            onSuccess: () => {
                ctx.auth.getProfile.invalidate()
                router.push("/community")
            }
        })
    }

    return (
        <View flex={1}>
            <Questionnaire
                isLoading={isLoading}
                isMultiSelect
                {...preference}
                onSave={handleOnSelect}
                submitButtonText="Finish"
            />
        </View>
    )
}

export default QuestionElevenScreen
