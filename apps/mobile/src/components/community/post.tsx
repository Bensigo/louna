import React, { useEffect } from "react"
import { TouchableHighlight } from "react-native"
import { useAuth } from "@clerk/clerk-expo"
import Ionicons from "@expo/vector-icons/Ionicons"
import { formatDistanceToNow } from "date-fns"
import { Skeleton } from "moti/skeleton"
import { Avatar, Card, H6, Text, View, XStack, YStack } from "tamagui"

type PostType = {
    post: {
        id: string
        user: any
        text: string
        likes: any[]
        Comments: any[]
        createdAt: Date
    }
    isLoading: boolean
    onLike: (postId: string) => void
    isLiked: boolean
    onShowCommentSheet: (postId: string) => void
}
const Post: React.FC<PostType> = (props) => {
    const { post, onLike } = props
    const { userId } = useAuth()
    const [isLiked, setIsLike] = React.useState(false)

    const [likeCount, setLikeCount] = React.useState(0)

    useEffect(() => {
        const userLike = post.likes.some((like) => like.userId === userId)
        setLikeCount(post.likes.length)
        setIsLike(userLike)
    }, [post.likes])
    
    const handleLike = () => {
        setIsLike((prev) => !prev)

        if (!isLiked) {
            console.log("here!!")
            setLikeCount((prev) => prev + 1)
        } else {
            setLikeCount((prev) => prev - 1)
        }
        // console.log('called')
        onLike(post.id)
    }

    if (props.isLoading) {
        return (
            <>
                <PostLoadingSekeleton />
                <PostLoadingSekeleton />
                <PostLoadingSekeleton />
            </>
        )
    }

    return (
        <>
            <Card
                paddingHorizontal="$3"
                borderBottomWidth={"$1"}
                borderBottomColor={"$gray4"}
            >
                <Card.Header paddingHorizontal={"$1"}>
                    <XStack space>
                        <Avatar circular size="$2.5">
                            <Avatar.Image
                                src={post.user.imageUrl ||  "http://placekitten.com/200/300"}
                            />
                            <Avatar.Fallback bc="red" />
                        </Avatar>
                        <YStack space={"$3"}>
                            <XStack space="$2" alignItems="center">
                                <H6>{` ${post.user.firstname} ${post.user.lastname}`}</H6>
                                <View>
                                    <Text fontSize={"$2"} color={"$gray9"}>
                                        {formatDistanceToNow(post.createdAt, {
                                            addSuffix: true,
                                        })}
                                    </Text>
                                </View>
                            </XStack>
                            <View paddingVertical="$1" width={"100%"}>
                                <Text
                                    fontSize={"$5"}
                                    fontWeight={"$2"}
                                    maxWidth={"90%"}
                                >
                                    {post.text}
                                </Text>
                            </View>
                            <XStack space>
                                <TouchableHighlight
                                    underlayColor={"inherit"}
                                    onPress={handleLike}
                                >
                                    <XStack alignItems="center">
                                        <Ionicons
                                            name={
                                                !!isLiked
                                                    ? "heart"
                                                    : "heart-outline"
                                            }
                                            size={20}
                                            color={isLiked ? "red" : "black"}
                                        />
                                        <Text> {likeCount}</Text>
                                    </XStack>
                                </TouchableHighlight>

                                <TouchableHighlight
                                    underlayColor={"inherit"}
                                    onPress={() =>
                                        props.onShowCommentSheet(props.post.id)
                                    }
                                >
                                    <XStack alignItems="center">
                                        <Ionicons
                                            name="chatbox-outline"
                                            size={20}
                                        />
                                        <Text> {post.Comments.length}</Text>
                                    </XStack>
                                </TouchableHighlight>
                            </XStack>
                        </YStack>
                    </XStack>
                </Card.Header>
            </Card>
        </>
    )
}

export const PostWithMemo = React.memo(Post);


const PostLoadingSekeleton = () => {
    return (
        <Card
            paddingHorizontal="$2"
            borderBottomWidth={"$1"}
            borderBottomColor={"$gray4"}
        >
            <Card.Header paddingHorizontal={"$1"}>
                <XStack alignItems="center" space>
                    <Avatar circular size="$3">
                        <Skeleton
                            colorMode="light"
                            radius="round"
                            height={75}
                            width={75}
                        ></Skeleton>
                    </Avatar>
                    <Skeleton
                        colorMode="light"
                        height={40}
                        width={75}
                    ></Skeleton>
                </XStack>
            </Card.Header>
            <View paddingVertical="$0.5">
                <Skeleton
                    colorMode="light"
                    height={150}
                    width={"100%"}
                ></Skeleton>
            </View>
            <Card.Footer
                marginVertical="$4"
                paddingHorizontal={"$1"}
                justifyContent="space-between"
                alignItems="center"
            >
                <View>
                    <Text fontSize={"$2"}>
                        <Skeleton
                            colorMode="light"
                            height={15}
                            width={100}
                        ></Skeleton>
                    </Text>
                </View>
                <XStack space>
                    <Ionicons name="heart-outline" size={20}>
                        <Skeleton
                            colorMode="light"
                            height={15}
                            width={15}
                        ></Skeleton>
                    </Ionicons>
                    <Ionicons name="chatbox-outline" size={20}>
                        <Skeleton
                            colorMode="light"
                            height={15}
                            width={15}
                        ></Skeleton>
                    </Ionicons>
                </XStack>
            </Card.Footer>
        </Card>
    )
}
