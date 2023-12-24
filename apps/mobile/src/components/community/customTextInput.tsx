import Ionicons from "@expo/vector-icons/Ionicons"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { useWindowDimensions,type  NativeSyntheticEvent, type TextInputContentSizeChangeEventData, TouchableHighlight } from "react-native"
import { XStack, Input } from "tamagui"
import { z } from "zod"

const PostFormSchema = z.object({
    text: z.string(),
})

type FormInputType = z.infer<typeof PostFormSchema>

export const CustomTextInput = ({ onPostText }: { onPostText: (text: string) => void }) => {
    const { width } = useWindowDimensions()
    const [height, setHeight] = useState(0)

    const { handleSubmit, control, setValue } = useForm<FormInputType>({
        resolver: zodResolver(PostFormSchema),
    })

    const handleChangeInputHeight = (
        e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>,
    ) => {
        setHeight(e.nativeEvent.contentSize.height)
    }

    const submitPost = (data: FormInputType) => {
        console.log("called")
        onPostText(data.text)
        setValue("text", "")
    }

    return (
        <XStack
            backgroundColor={"$gray7"}
            alignItems="center"
            alignSelf="center"
            space="$2"
            style={{
                paddingVertical: 10,
                paddingHorizontal: 22,
                bottom: 0,
                left: 0,
                right: 0,
                width: "100%",
            }}
        >
            <Controller
                name="text"
                control={control}
                render={({ field: { onChange, value } }) => (
                    <Input
                        width={width * 0.8}
                        placeholder="Type your message..."
                        value={value}
                        onChangeText={(text) => onChange(text)}
                        multiline
                        onContentSizeChange={handleChangeInputHeight}
                        borderWidth={0}
                        height={Math.max(50, height)}
                        borderColor={"#000000"}
                    />
                )}
            />
            <TouchableHighlight
                style={{
                    width: 40,
                    backgroundColor: "black",
                    padding: 10,
                    borderRadius: 100,
                }}
                underlayColor={"inherit"}
                onPress={handleSubmit(submitPost)}
            >
                <Ionicons name="send-outline" size={20} color={"white"} />
            </TouchableHighlight>
        </XStack>
    )
}