


import { useRouter } from "expo-router"
import { View } from "@tamagui/core"
import { usePref } from "../../context/usePref"
import { useEffect } from "react"
import { useState } from "react"
import { CustomSaveAreaView } from "../../components/CustomSaveAreaView"
import { Button, H3, YStack } from "tamagui"
import TagInput from "../../components/tagInput"




export const FITNESS_HEALTH_CONDITION_QUE = 'Do you have any health conditions or injuries?'

function QuestionFourScreen() {
    const { data,update } = usePref()
    const [tags, setTags] = useState<string[]>([])
    const router = useRouter();
  


    useEffect(() => {
        console.log({ data: JSON.stringify(data) })
          if (data.fitness && data.fitness.questionFour?.answer){
            const initialTags = data.fitness.questionFour.answer as string [];
            setTags(initialTags)   
          }
        
    }, [])

     const handleNext = () => {
        update({ fitness: { ...data.fitness,  quetionFour: { question: FITNESS_HEALTH_CONDITION_QUE, answer: tags }}})
        router.replace('(onboarding)/questionFive')
     }


     const handleSkip = () => {
        update({ fitness: { ...data.fitness,  quetionFour: { question: FITNESS_HEALTH_CONDITION_QUE, answer: [] }}})
        router.replace('(onboarding)/questionFive')
     }



    return (
     <CustomSaveAreaView>
           <View flex={1}>
            <View flex={1} mt={20} mb={"$6"} px="$3" justifyContent="space-between">
                <YStack space={5}  mb={15} >
                <H3 fontSize={"$8"} fontWeight={"$15"}>
                    {FITNESS_HEALTH_CONDITION_QUE}
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

export default QuestionFourScreen;