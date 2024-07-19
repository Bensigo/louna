import { Buffer } from "buffer"
import { useState } from "react"
import {
    KeyboardAvoidingView,
    StyleSheet,
    TextInput,
    TouchableHighlight,
    TouchableOpacity,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import * as FileSystem from "expo-file-system"
import * as ImagePicker from "expo-image-picker"
import { useRouter } from "expo-router"
import Ionicons from "@expo/vector-icons/Ionicons"
import { Avatar, Button, Image, Text, View } from "tamagui"


import { Colors } from "../../../constants/colors"
import { api } from "../../../utils/api"


function generateUUIDv6(): string {
    // Get the current timestamp in milliseconds
    const now = Date.now();
  
    // Convert timestamp to hexadecimal
    const hexTimestamp = now.toString(16).padStart(12, '0');
  
    // Generate random values
    function getRandomHex(size: number): string {
      let hex = '';
      for (let i = 0; i < size; i++) {
        const randomValue = Math.floor(Math.random() * 256);
        hex += randomValue.toString(16).padStart(2, '0');
      }
      return hex;
    }
  
    const hexRandom = getRandomHex(10);
  
    // Format the UUIDv6
    const uuidv6 = `${hexTimestamp.slice(0, 8)}-${hexTimestamp.slice(8, 12)}-6${hexRandom.slice(0, 3)}-${(parseInt(hexRandom.slice(3, 5), 16) & 0x3f | 0x80).toString(16).padStart(2, '0')}-${hexRandom.slice(5, 15)}`;
  
    return uuidv6;
}

const getBlob = async (fileUri: string) => {
    const resp = await fetch(fileUri)
    const imageBody = await resp.blob()
    return imageBody
}

const CreatePost = () => {
    const insets = useSafeAreaInsets()
    const router = useRouter()

    const [imgs, setImgs] = useState<string[]>([])
    const [baseKey, setBaseKey] = useState<string>()
    const [text, setText] = useState("")
    const [textCounter, setTextCounter] = useState(300)
    const [selectedImages, setSelectedImages] = useState<
        ImagePicker.ImagePickerAsset[]
    >([])

    const { mutate: createPost } = api.post.createPost.useMutation()
    const { data: user, isLoading } = api.auth.getProfile.useQuery()
    const { mutateAsync: getPreSignedUrls, isLoading: isUploading } =
        api.s3.presigned.useMutation()

    const goBack = () => {
        // Navigation logic to go back
        router.push("/community")
    }

    const handleTextChange = (newText: string) => {
        if (textCounter > 0) {
            const remainingChars = Math.max(300 - newText.length, 0)
            setText(newText)
            setTextCounter(remainingChars)
        }
    }

    const handleCreatePost = async () => {
        if (text.length <= 300) {
            console.log({ imgs })
            createPost(
                { text: text.trim(), images: imgs, baseKey },
                {
                    onSuccess: () => {
                        // Navigation logic after creating post
                        router.replace("/community")
                    },
                },
            )
        }
    }

    const handleImageSelect = async () => {
        console.log("-------- got here 3--------------")
        const result: ImagePicker.ImagePickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            aspect: [4, 3],
            quality: 0.5,
            allowsMultipleSelection: true,
            base64: true,
            selectionLimit: 2,
        }) 
        console.log({ result }, "======= result from image picker ======")
        const { canceled, assets } = result

        if (!canceled && !!assets.length) {
            console.log("pass =========== 111")
            const baseKey =  generateUUIDv6()
            if (assets && assets.length > 0) {
                setSelectedImages(assets)

                try {
                    const presignedUrls = await getPreSignedUrls({
                        fileNames: assets.map((file) => file.fileName),
                        repo: "post",
                        expiration: "50000",
                        contentType: "image/jpg",
                        baseKey,
                    })
                    console.log({ presignedUrls }, "---------got here ------")
                    const images = []
                    await Promise.all(
                        presignedUrls.map(
                            async (
                                presignedUrl: { url: string; fields: any },
                                index,
                            ) => {
                                const file = assets[index]

                                if (file) {
                                    const formData = new FormData()
                                    const { fields, url } = presignedUrl

                                    // Append required fields
                                    const { uri } = file
                                    const imageExt = uri.split(".").pop()

                                    const fileData = {
                                        ...fields,
                                        "Content-Type": `image/${imageExt}`,
                                    }

                                    // Append file data
                                    for (const name in fileData) {
                                        // add images to image arr
                                        if (name === "key") {
                                            images.push(fileData[name])
                                        }
                                        formData.append(name, fileData[name])
                                    }
                                    // @ts-ignore
                                    formData.append("file", file)
                                    const { ok } = await fetch(url, {
                                        method: "POST",
                                        body: formData,
                                    })
                                    if (!ok) {
                                        throw new Error(
                                            `Failed to upload image ${file.fileName}`,
                                        )
                                    }
                                }
                            },
                        ),
                    )
                    setImgs(images)
                    setBaseKey(baseKey)
                    // console.log("All images uploaded successfully!");
                } catch (error) {
                    console.error("Error uploading images:", error)
                }
            }
        }
    }

    return (
        <KeyboardAvoidingView
            keyboardVerticalOffset={47 + insets.top}
            style={{ flex: 1, bottom: 0 }}
            behavior="padding"
        >
            <View flex={1} mt={insets.top + 10}>
                <View style={styles.buttonContainer}>
                    <TouchableHighlight
                        onPress={goBack}
                        underlayColor="transparent"
                    >
                        <Text fontSize={"$4"} color={Colors.light.primary}>
                            Cancel
                        </Text>
                    </TouchableHighlight>
                    <Button
                        borderRadius={20}
                        height={40}
                        disabled={text.length === 0}
                        onPress={handleCreatePost}
                        bg={Colors.light.secondray}
                        color={Colors.light.primary}
                    >
                        Post
                    </Button>
                </View>
                <View style={styles.container}>
                    <Text color={textCounter < 10 ? "$red8" : "$gray10"}>
                        {textCounter} characters left
                    </Text>
                </View>
                <View style={styles.inputContainer}>
                    <View style={styles.avatarContainer}>
                        <Avatar circular size="$3">
                            <Avatar.Image src={user?.imageUrl} />
                            <Avatar.Fallback bc="gray" />
                        </Avatar>
                    </View>

                    <TextInput
                        style={styles.input}
                        value={text}
                        onChangeText={handleTextChange}
                        multiline
                        placeholder="Tell your story..."
                        underlineColorAndroid="transparent"
                    />
                </View>
                <View style={styles.container} alignSelf="flex-end">
                    <TouchableOpacity onPress={handleImageSelect}>
                        <Ionicons name="image" size={25} />
                    </TouchableOpacity>
                </View>
                {selectedImages.length > 0 && (
                    <View style={styles.imageContainer} flexDirection="row">
                        {selectedImages.map((image, i) => (
                            <Image
                                resizeMode="contain"
                                key={i}
                                source={{ uri: image.uri }}
                                alt="image-upload"
                                style={styles.image}
                            />
                        ))}
                    </View>
                )}
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
    },
    container: {
        paddingHorizontal: 20,
        marginTop: 8,
    },
    inputContainer: {
        flexDirection: "row",
        paddingHorizontal: 20,
        marginTop: 8,
    },
    avatarContainer: {
        marginRight: 5,
    },
    input: {
        flex: 1,
        minHeight: 30,
        padding: 10,
    },
    imageContainer: {
        flexDirection: "row",
        paddingHorizontal: 20,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 8,
    },
    image: {
        height: 200,
        width: "50%",
        marginRight: 10,
    },
})

export default CreatePost
