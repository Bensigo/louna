
import { View } from "@tamagui/core"
import Questionnaire from "../../../../components/questionaire"
import { LeftBackButton } from "../../../_layout"
import { api } from "../../../../utils/api"
import { Alert } from "react-native"
import { useRouter } from "expo-router"




export const QUE = 'What is your diet type?'

const preference = {
    question: {
        options: [
            { label: "Paleo" },
            { label: "Vegan" },
            { label: "Vegetarian" },
            { label: "Standard" },
            { label: "Pescetarian"},
            { label: "others"}
  
        ],
        question: QUE,
        
    },
    route: "/profile/prefrence",
}

function QuestionScreen() {
    const router = useRouter()

    const { mutate, isLoading } =  api.preference.update.useMutation()

    const handleOnSelect = (answer: string | string[]) => {
        mutate({
            dietPref: answer[0]
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
            <Questionnaire isMannualCtrl isLoading={isLoading}  {...preference} onSave={handleOnSelect} submitButtonText="Update"  />
          </View>
            
     
    )
}

export default QuestionScreen;