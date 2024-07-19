import { View } from "@tamagui/core"
import Questionnaire from "../../../../components/questionaire"
import { LeftBackButton } from "../../../_layout"

import { api } from "../../../../utils/api"
import { Alert } from "react-native"
import { useRouter } from "expo-router"


export const QUE = 'which are any of your current health conditions or injuries?'

const preference = {
    question: {
        options: [
            { label: "Knee Issues" },
            { label: "Back pain" },
            { label: "Hip " },
            { label: "Shoulder" },
            { label: "Neck" },
            { label: "Feets" },
            { label: "Ankle" },
        ],
        question: QUE,
        
    },
    route: "/profile/prefrence",
}

function QuestionThreeScreen() {

  const router = useRouter()

  const { mutate, isLoading } =  api.preference.update.useMutation()

    const handleOnSelect = (answer: string | string[]) => {
      mutate({
        existingInjuries: answer as string[]
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
            <Questionnaire   isLoading={isLoading}  isMultiSelect {...preference} onSave={handleOnSelect} submitButtonText="Save"  />
          </View>
            
     
    )
}

export default QuestionThreeScreen;