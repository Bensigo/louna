import React, { useCallback, useEffect, useRef, useState } from "react"
import {
    FlatList,
    KeyboardAvoidingView,
    RefreshControl,
    StyleSheet,
    TouchableHighlight,
} from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import Ionicons from "@expo/vector-icons/Ionicons"
import { Text } from "tamagui"

import { Comments, PostWithMemo as Post } from "../../../components/community"
import { PostLoadingSekeleton } from "../../../components/community/post"
import { api } from "../../../utils/api"

const FETCH_BATCH = 10

export default function CommunityForum() {
    const insets = useSafeAreaInsets()
    const onEndReachedCalledDuringMomentum = useRef(true)
    const [showCommentSheet, setShowCommentSheet] = useState(false)
    const router = useRouter()
    const postRef = useRef()
    const [postId, setPostId] = useState<string>()

    const ctx = api.useUtils()
    const [limit, setLimit] = useState(FETCH_BATCH)

    const [transformedPosts, setTransformedPosts] = useState([])

    const { data: user } = api.auth.getProfile.useQuery()

    const {
        data: posts,
        isLoading: isLoadingPost,
        refetch,
        isRefetching: postIsRefeching,
    } = api.post.listPost.useQuery({ limit })

    useEffect(() => {
        if (!!posts?.length) {
            setTransformedPosts(posts)
        }
        return () => {
            setTransformedPosts([])
        }
    }, [posts])

    const { mutate: likePost } = api.post.likePost.useMutation()

    const handleRefeshData = useCallback(() => {
        if (!onEndReachedCalledDuringMomentum.current) {
            setLimit((prev) => prev + 10)

            onEndReachedCalledDuringMomentum.current = true
        }
    }, [])

    const handleLike = (postId: string) => {
        // Optimistically update the post data
        const updatedPosts = transformedPosts.map((post) => {
            if (post.id === postId && !!user) {
                return {
                    ...post,
                    // Assuming the post data structure includes a likes array
                    likes: [...post.likes, { userId: user?.id }],
                }
            }
            return post
        })
        // Update the state with the optimistic changes
        setTransformedPosts(updatedPosts)

        // Make the actual API call to like the post
        likePost(
            {
                postId,
            },
            {
                onSuccess: () => {
                    // If the API call is successful, no action needed
                },
                onError: () => {
                    // If the API call fails, revert the optimistic update
                    setTransformedPosts(transformedPosts)
                },
            },
        )
    }

    const handleGtoCreatePost = () => {
        router.replace("community/createPost")
    }

    //   const scrollToItem = (index) => {
    //     postRef.current.scrollToIndex({ index: index, animated: false });
    //   };

    const renderItem = ({ item }) => (
        <Post
            post={item}
            isLoading={isLoadingPost}
            isRefetching={postIsRefeching}
            onLike={handleLike}
            onShowCommentSheet={(postId) => {
                setPostId(postId)
                setShowCommentSheet(true)
            }}
        />
    )

    return (
        <KeyboardAvoidingView
            keyboardVerticalOffset={47 + insets.top}
            style={{ flex: 1, bottom: 0, marginTop: 10 }}
            behavior="padding"
        >
            <FlatList
                data={transformedPosts}
                ref={postRef}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                refreshControl={
                    <RefreshControl
                        onRefresh={refetch}
                        refreshing={postIsRefeching}
                    />
                }
                onEndReached={handleRefeshData}
                ListEmptyComponent={() =>
                    isLoadingPost ? (
                        <>
                            <PostLoadingSekeleton />
                            <PostLoadingSekeleton />
                        </>
                    ) : (
                        <Text>No post found</Text>
                    )
                }
                maxToRenderPerBatch={FETCH_BATCH}
                onMomentumScrollBegin={() => {
                    onEndReachedCalledDuringMomentum.current = false
                }}
                initialScrollIndex={0}
                onEndReachedThreshold={0.7}
                onScrollToIndexFailed={({ index, averageItemLength }) => {
                    postRef.current?.scrollToOffset({
                        offset: index * averageItemLength,
                        animated: true,
                    })
                }}
            />
            <TouchableHighlight
                style={styles.createPostBtn}
                onPress={handleGtoCreatePost}
            >
                <Ionicons size={25} name="pencil-outline" color={"white"} />
            </TouchableHighlight>
            {showCommentSheet && (
                <Comments
                    onShowComment={setShowCommentSheet}
                    showComment={showCommentSheet}
                    postId={postId}
                />
            )}
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    createPostBtn: {
        borderRadius: 25,
        height: 50,
        width: 50,
        position: "absolute",
        zIndex: 100,
        alignItems: "center",
        justifyContent: "center",
        bottom: 60,
        right: 25,
        backgroundColor: "black",
    },
})
