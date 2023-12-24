import { H3, Progress, View, YStack , Text, Button} from "tamagui"

import { useRecipePref } from "../../../../context/receipePref"
import { CustomSaveAreaView } from "../../../../components/CustomSaveAreaView"
import TagInput from "../../../../components/tagInput"
import { useRouter } from "expo-router"
import { useEffect, useState } from "react"

const StepTwo = () => {
    const { recipePrefData, updateRecipePrefData } = useRecipePref()
    const [tags, setTags] = useState<string[]>([])
    const router = useRouter();
    console.log({ recipePrefData, tags })


    useEffect(() => {
        if(recipePrefData.stepTwo){
            const initialTags = recipePrefData.stepTwo.answer as string [];
            setTags(initialTags)
        }
      
    }, [])

     const handleNext = () => {
        updateRecipePrefData({ stepTwo: { question: 'Foods you dislike?', answer: tags } })
        router.replace('recipes/stepThree')
     }



    return (
     <CustomSaveAreaView>
           <View flex={1}>
            <View flex={1} mt={20} mb={"$1"} px="$3">
                <YStack space={5}  mb={15}>
                <H3 fontSize={"$8"} fontWeight={"$15"}>
                  Foods you dislike?
                </H3>
                 <Text color="$gray11" fontWeight={'$7'} fontSize={'$5'}>Items you don&apos;t want to see in your food</Text>
                </YStack>
                <TagInput  tags={tags} setTags={setTags} />
                {tags?.length > 0 && (
                      <Button color={'whitesmoke'} bg={'$green8'} onPress={handleNext}>
                      Next
                    </Button>
                )} 
                
            </View>
            
        </View>
     </CustomSaveAreaView>
    )
}

export default StepTwo
