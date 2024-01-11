import React, { useCallback, useMemo, useState } from "react"
import {
    FlatList,
    KeyboardAvoidingView,
    StyleSheet,
    TouchableHighlight,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { api } from "../../../utils/api"
import { PostWithMemo as Post , Comments } from "../../../components/community"
import Ionicons from "@expo/vector-icons/Ionicons"
import { useRouter } from "expo-router"

const image =
    "https://frommybowl.com/wp-content/uploads/2020/01/One_Pot_Pasta_Vegetables_Vegan_FromMyBowl-10.jpg"


export default function CommunityForum() {
    const insets = useSafeAreaInsets()
    const [showCommentSheet, setShowCommentSheet] = useState(false)
    const router = useRouter();

    const ctx = api.useUtils()
    const  [limit, setLimit] = useState(100)
   
    const { data: posts, isLoading: isLoadingPost, refetch } =
        api.post.listPost.useQuery({ limit })


    console.log({ posts })    
    
    const [postId, setPostId] = useState()

    const { mutate: likePost } = api.post.likePost.useMutation()


    const transformedPosts = useMemo(() => {
    
        return posts?.map((item) => item);
    }, [posts]);

    transformedPosts?.push({
        id: '43656872498093',
        metadata: {},
        createdAt: new Date(),
        updatedAt: new Date,
        text: 'Hello world',
        type: 'TEXT',
        mediaUri: image,
        deleted: false,
        likes: [],
        Comments: [],
        trendScore: 0,
        userId: "dksjdsufhekf",
        user: {
            id: 'jdhgfsofujdigfdf',
            imageUri: '',
            firstname: 'Sarah',
            lastname: 'Ahmed'
        }
    })

    const handleRefeshData = useCallback(() => {
        setLimit((prev) => prev + 10)
        refetch()
    }, [])

    const handleLike = (postId: string) => {
            likePost(
                {
                    postId,
                },
                {
                    onSuccess: () => {
                     
                        ctx.post.listPost.reset({ limit }) // fix this later
                    },
                },
            )
    
    }
    const handleGtoCreatePost = () => {
        router.replace("community/createPost")
    }
    return (
        <KeyboardAvoidingView
            keyboardVerticalOffset={47 + insets.top}
            style={{ flex: 1, bottom: 0 , marginTop: 10}}
            behavior="padding"
        >
                <FlatList
                    data={transformedPosts}
                    
                    scrollEnabled
                    renderItem={({ item }) => (
                        <Post
                            post={{ ...item }}
                            isLoading={isLoadingPost}
                            onLike={handleLike}
                            onShowCommentSheet={(postId) => {
                                setPostId(postId)
                                setShowCommentSheet(true)
                            }}
                        
                        
                        />
                    )}
                    keyExtractor={(item) => item.id}
                    initialNumToRender={100}
                    windowSize={100}
                    // onEndReachedThreshold={0.1}
                    // onEndReached={handleRefeshData}
                />
               <TouchableHighlight style={styles.createPostBtn} onPress={handleGtoCreatePost}>
                    <Ionicons size={25}  name="pencil-outline" color={'white'} />
               </TouchableHighlight>
            {postId && <Comments onShowComment={setShowCommentSheet} showComment={showCommentSheet} postId={postId}  />}
        </KeyboardAvoidingView>
    )
}


const styles = StyleSheet.create({
    createPostBtn: {
        borderRadius: 25,
        height: 50,
        width: 50,
        position:'absolute',
        zIndex: 100,
        alignItems: 'center',
        justifyContent: 'center',
        bottom: 60,
        right: 25,
        backgroundColor: 'black'
    }
})

