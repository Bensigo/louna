import Ionicons from "@expo/vector-icons/Ionicons";
import {  useState } from "react";
import { TouchableOpacity } from "react-native";
import { Input, Text, View, XStack } from "tamagui";

const TagInput = ({  tags, setTags }: {  tags: string[], setTags:  (t: string []) => void }) => {

    const [text, setText] = useState('')
    const [tagIndex, setTagIndex] = useState<number | null>(null)


    const addTag = () => {
        if(text.trim() !== ''){
            if(tagIndex !== null){

                const newTags = [...tags];
                newTags[tagIndex] = text.trim()
                setTags(newTags)
                setTagIndex(null)
        

            }else {
                setTags([...tags, text.trim()])
               
            }
            setText('')
           
        }
    }

    const removeTag = (index: number) => {
        const newTags = [...tags]; 
        newTags.splice(index, 1); 
        setTags(newTags);
       

    }

    const editTag = (index: number) => { 
        const tagToEdit = tags[index]; 
        if(tagToEdit){
            setText(tagToEdit); 
            setTagIndex(index); 
            
        }
    };

    return (
        <View mb={10}>
        
            <View flexDirection="row" flexWrap="wrap" marginBottom={10}>
                {tags.map((tag, index) => (
                    <XStack borderRadius={10} height={40} padding={'$2'} bg={'$green5'} space={5} key={index}  alignItems="center" mr={5}  marginVertical={5}>
                        <TouchableOpacity onPress={() => editTag(index)}>
                            <Text fontWeight={'$8'} color={'$green7Dark'}>{tag}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => removeTag(index)}>
                            <Ionicons color={'red'} name="close" />
                        </TouchableOpacity>
                    </XStack>
                ))}
            </View>
            <View>
                <Input 
                    value={text}
                    onEndEditing={addTag}
                    onChangeText={setText}
                />
                <Text color={'$gray11'} fontSize={'$1'}>press return key to add item</Text>
            </View>
    
        </View>
    )
}

export default TagInput;