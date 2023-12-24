

import { useRouter } from "expo-router"
import Questionnaire from "../../../../components/questionaire"
import { useRecipePref } from "../../../../context/receipePref"
import { View } from "@tamagui/core"
import { api } from "../../../../utils/api"
import { useAsyncStorage } from "@react-native-async-storage/async-storage"
import { RECIPE_PREFRENCE_KEY } from "../_layout"


const preference = {
    question: {
        options: [
            { label: "Lunch and dinner" },
            { label: "Breakfast, lunch and dinner" },
            { label: "3 meals and a snack (best)" },
            { label: "3 meals and 2 snacks" },
            { label: "Single meal" },
            
        ],
        question: `How many meals do you have per day?`,
    },
   route: '' 
   
}

function StepFour() {
    const { updateRecipePrefData, recipePrefData } = useRecipePref();
    const { setItem } = useAsyncStorage(RECIPE_PREFRENCE_KEY);
    const router = useRouter();
    const { mutate, isLoading } = api.preference.createPreference.useMutation()

    const handleOnSelect = (answer: string | string[]) => {
        const question = preference.question.question
        updateRecipePrefData({ stepFour: { question, answer } })
        const config =  transfromRecipePref({...recipePrefData,  stepFour: { question, answer } })
        mutate({
            type: 'RECIPE',
            config
        }, {
            async onSuccess(){
                await setItem("true", (err) => {

                    if(err){
                        console.log("failed :", err);
                    }
                   
                })
                router.replace("recipes")
            }
        })
       
    }


    return (
          <View flex={1}>
            <Questionnaire {...preference} onSave={handleOnSelect} isLoading={isLoading}  />
          </View>
            
     
    )
}


const transfromRecipePref = (data: any) => {
    return {
        mealPerDay: data.stepFour?.answer,
        diet: data.stepOne?.answer,
        recipeType: data.stepThree?.answer,
        dislikes: data.stepTwo?.answer
    }
}

export default StepFour;