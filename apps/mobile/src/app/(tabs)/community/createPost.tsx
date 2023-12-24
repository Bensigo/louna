import { useRouter } from "expo-router"
import { useState } from "react"
import { KeyboardAvoidingView, StyleSheet, TextInput, TouchableHighlight } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import {
    Avatar,
    Button,
    Text,
    View,
    XStack,
} from "tamagui"
import { api } from "../../../utils/api"

const CreatePost = () => {
    const insets = useSafeAreaInsets()
    const router = useRouter()
    const [text, setText] = useState('')
    const [textCounter, setTextCounter] = useState(300)

    const { mutate: createPost } = api.post.createPost.useMutation()

    const goBack = () => {
        router.replace("community")
    }

    const handleTextChange = (newText: string) => {
        if (textCounter > 0){
            const remainingChars = Math.max(300 - newText.length, 0);
            setText(newText);
            setTextCounter(remainingChars);
        }
      
    }

    const handleCreatePost = () => {
        if(text.length <= 300){
            createPost({ text: text.trim() }, {
                onSuccess: () => {
                    router.push("community")
                }
            })
        }
    }




    return (
        <KeyboardAvoidingView
            keyboardVerticalOffset={47 + insets.top}
            style={{ flex: 1, bottom: 0 }}
            behavior="padding"
        >
            <View flex={1} mt={insets.top + 10}>
                <XStack
                    paddingHorizontal={"$4"}
                    justifyContent="space-between"
                    alignItems="center"
                >
                    <TouchableHighlight onPress={goBack} underlayColor="transparent">
                        <Text fontSize={"$4"}>Cancel</Text>
                    </TouchableHighlight>
                    <Button
                        borderRadius={20}
                        height={40}
                        disabled={text.length === 0}
                        onPress={handleCreatePost}
                        bg={"black"}
                        color={"white"}
                    >
                        Inspire
                    </Button>
                </XStack>
                <XStack paddingHorizontal={"$4"}  my={8}>
                    <Text color={textCounter  < 10 ? '$red8' : '$gray10'}>{textCounter} characters left</Text>
                </XStack>
                <View style={styles.container}>
                    <View style={styles.avatarContainer}>
                        <Avatar circular size="$3">
                            <Avatar.Image src="http://placekitten.com/200/300" />
                            <Avatar.Fallback bc="gray" />
                        </Avatar>
                    </View>
                    <TextInput
                        style={styles.input}
                        value={text}
                        autoFocus
                        onChangeText={handleTextChange}
                        multiline
                        placeholder="Tell your story..."
                        underlineColorAndroid="transparent"
                    />
                </View>
                
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        marginTop: 5,
        marginBottom: 5, // Add margin bottom for spacing
        width: '100%',
      },
      avatarContainer: {
        marginRight: 5, 
      },
      input: {
        flex: 1,
        backgroundColor: 'inherit',
        minHeight: 200,
        borderWidth: 0,
        padding: 10, 
      },
})


export default CreatePost
