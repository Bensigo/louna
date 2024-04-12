import { View } from "@tamagui/core"
import { useState } from "react"
import { CustomSaveAreaView } from "../../../components/CustomSaveAreaView"
import { Button, H3, YStack } from "tamagui"
import TagInput from "../../../components/tagInput"
import { LeftBackButton } from "../../_layout";

import { api } from "../../../utils/api"
import { ActivityIndicator, Alert } from "react-native"
import { useRouter } from "expo-router"


export const FOOD_DISLIKE_QUESTION = 'Foods you dislike?'

function QuestionSevenScreen() {

    const router = useRouter()

    const { mutate, isLoading } =  api.preference.update.useMutation()
 
    const [tags, setTags] = useState<string[]>([])

  

    const handleSubmit = () => {
      if (tags.length){
        mutate({
            foodDislikes: tags
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
    }

    return (
     <CustomSaveAreaView>
           <View flex={1}  px="$4">
        <LeftBackButton route="/profile/preference" bg="black" />  
            <View flex={1} mt={20} mb={"$6"} justifyContent="space-between">
                <YStack gap={5}  mb={15}>
                <H3 fontSize={"$8"} fontWeight={"$15"}>
                    {FOOD_DISLIKE_QUESTION}
                </H3>
                <TagInput  tags={tags} setTags={setTags} />
                </YStack>
            
                {tags?.length > 0 && (
                      <Button color={'whitesmoke'} bg={'$green8'} onPress={handleSubmit}>
                         {isLoading ? <ActivityIndicator color="white" size="small" /> : 'Save'}
                    </Button>
                )}
         
              
                
            </View>
            
        </View>
     </CustomSaveAreaView>
    )
}

export default QuestionSevenScreen;