


import { useRouter } from "expo-router"
import { View } from "@tamagui/core"
import { usePref } from "../../context/usePref"
import { useEffect } from "react"
import { useState } from "react"
import { CustomSaveAreaView } from "../../components/CustomSaveAreaView"
import { Button, H3, YStack } from "tamagui"
import TagInput from "../../components/tagInput"




export const FOOD_DISLIKE_QUESTION = 'Foods you dislike?'

function QuestionSevenScreen() {
    const { data,update } = usePref()
    const [tags, setTags] = useState<string[]>([])
    const router = useRouter();
  


    useEffect(() => {
        console.log({ data: JSON.stringify(data) })
          if (data.dietary && data.dietary.quetionSevn?.answer){
            const initialTags = data.dietary.quetionSevn.answer as string [];
            setTags(initialTags)   
          }
        
    }, [])

     const handleNext = () => {
        update({ ...data, dietary: { ...data.dietary,  quetionSevn: { question: FOOD_DISLIKE_QUESTION, answer: tags }}})
        router.replace('(onboarding)/questionEight')
     }

     const handleSkip = () => {
        update({ ...data, dietary: { ...data.dietary,  quetionSevn: { question: FOOD_DISLIKE_QUESTION, answer: [] }}})
        router.replace('(onboarding)/questionEight')
     }

    return (
     <CustomSaveAreaView>
        
           <View flex={1}>
            <View flex={1} mt={20} mb={"$6"} px="$3" justifyContent="space-between">
                <YStack space={5}  mb={15}>
                <H3 fontSize={"$8"} fontWeight={"$15"}>
                    {FOOD_DISLIKE_QUESTION}
                </H3>
                <TagInput  tags={tags} setTags={setTags} />
                </YStack>
                <YStack space="$2">
                <Button variant="outlined" onPress={handleSkip}>Skip</Button>
                {tags?.length > 0 && (
                      <Button color={'whitesmoke'} bg={'$green8'} onPress={handleNext}>
                      Next
                    </Button>
                )}
                </YStack>
              
                
            </View>
            
        </View>
     </CustomSaveAreaView>
    )
}

export default QuestionSevenScreen;