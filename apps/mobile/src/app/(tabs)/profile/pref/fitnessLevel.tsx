import { View } from "@tamagui/core"
import Questionnaire from "../../../../components/questionaire"
import { LeftBackButton } from "../../../../app/_layout"

import { api } from "../../../../utils/api"
import { Alert } from "react-native"
import { useRouter } from "expo-router"


export const FITNESS_GOAL_QUE = 'What is your current fitness level?'

const preference = {
    question: {
        options: [
                { label: "Beginner" },
                { label: "Intermediate" },
                { label: "Advanced" },
  
        ],
        question: FITNESS_GOAL_QUE,
        
    },
    route: "/profile/prefrence",
}

function QuestionThreeScreen() {
    const router = useRouter()

    const { mutate, isLoading } =  api.preference.update.useMutation()

    const handleOnSelect = (answer: string | string[]) => {
        mutate({
            fitnessLevel: answer[0]
        }, {
            onError: (err) => {
                Alert.alert("Error", err.message, [
                    {
                        text: "Ok",
                        onPress: () => {
                            console.log("close")
                        }
                    }
                ])
            },
            onSuccess: () => {
                router.push("/profile/preference")
            }
        })
    }
    
    return (
          <View flex={1}>
            <View px={'$4'} mb="$2">
            <LeftBackButton route="/profile/preference" bg="black" />
            </View>
            <Questionnaire isMannualCtrl isLoading={isLoading}  {...preference} onSave={handleOnSelect} submitButtonText="Save"  />
          </View>
            
     
    )
}

export default QuestionThreeScreen;