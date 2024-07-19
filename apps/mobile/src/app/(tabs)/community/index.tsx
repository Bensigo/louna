import React, { useCallback, useEffect, useRef, useState } from "react"
import {
    ActivityIndicator,
    Alert,
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
import { Colors } from "../../../constants/colors"
import { api, type RouterOutputs } from "../../../utils/api"

type Post = NonNullable<RouterOutputs["post"]["getPost"]> & {
    trendScore: number
}

const FETCH_BATCH = 10

export default function CommunityForum() {
    const insets = useSafeAreaInsets()
    const onEndReachedCalledDuringMomentum = useRef(true)
    const [showCommentSheet, setShowCommentSheet] = useState(false)
    const router = useRouter()
    const postRef = useRef()
    const [postId, setPostId] = useState<string>()
    const [limit, setLimit] = useState(FETCH_BATCH)
    const [loadingMore, setLoadingMore] = useState(false)

    // const [transformedPosts, setTransformedPosts] = useState<Post[]>([])

    const user = {}

    const {
        data: posts,
        isLoading: isLoadingPost,
        refetch,
        isRefetching,
    } = api.post.listPost.useQuery({ limit }, { keepPreviousData: true })


    useEffect(() => {
        if (posts?.length){
            setLoadingMore(false)
        }
    }, [posts])



    const { mutate: likePost } = api.post.likePost.useMutation()

    const handleLoadMore = useCallback(() => {
        if (!onEndReachedCalledDuringMomentum.current) {
            setLoadingMore(true)
            setLimit((prev) => prev + FETCH_BATCH)
            onEndReachedCalledDuringMomentum.current = true
        }
    }, [])

    const handleRefreshData = useCallback(() => {
        refetch()
    }, [refetch])

    const handleLike = (postId: string) => {
        const updatedPosts = transformedPosts.map((post) => {
            if (post.id === postId && !!user) {
                return {
                    ...post,
                    likes: [...post.likes, { userId: user?.id }],
                }
            }
            return post
        })
        setTransformedPosts(updatedPosts)
        likePost(
            { postId },
            {
                onSuccess: () => {},
                onError: (err) => {
                    setTransformedPosts(transformedPosts)
                    Alert.alert("Error", err.message, [
                        {
                            text: "Cancel",
                            style: "cancel",
                            onPress: () => console.log("Cancel Pressed"),
                        },
                    ])
                },
            },
        )
    }

    const handleGoToCreatePost = () => {
        router.replace("community/createPost")
    }

    const renderItem = ({ item }: { item: Post }) => (
        <Post
            post={item}
            onLike={handleLike}
            onShowCommentSheet={(postId) => {
                setPostId(postId)
                setShowCommentSheet(true)
            }}
        />
    )

    const renderFooter = () => {
        return loadingMore ? (
            <ActivityIndicator size="small" color={Colors.light.primary} />
        ) : null
    }

    return (
        <KeyboardAvoidingView
            keyboardVerticalOffset={47 + insets.top}
            style={{ flex: 1, bottom: 0, marginTop: 10 }}
            behavior="padding"
        >
            {isLoadingPost && !loadingMore ? (
                <FlatList
                    data={[{}, {}, {}, {}, {}]}
                    renderItem={() => <PostLoadingSekeleton />}
                />
            ) : (
                <FlatList
                    data={(posts as Post[])}
                    ref={postRef}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    refreshControl={
                        <RefreshControl
                            tintColor={Colors.light.primary}
                            onRefresh={handleRefreshData}
                            refreshing={isRefetching}
                        />
                    }
                    onEndReached={handleLoadMore}
                    ListFooterComponent={renderFooter}
                    ListEmptyComponent={() => <Text>No post found</Text>}
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
            )}
            <TouchableHighlight
                style={styles.createPostBtn}
                onPress={handleGoToCreatePost}
            >
                <Ionicons
                    size={25}
                    name="pencil-outline"
                    color={Colors.light.primary}
                />
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
        backgroundColor: Colors.light.secondray,
    },
})
