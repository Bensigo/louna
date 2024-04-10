/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { formatDistanceToNow } from "date-fns"
import { Skeleton } from "moti/skeleton"
import { XStack, Avatar, YStack, Text, View  } from "tamagui"


export const CommentItem = ({
    comment,
    isLoading,
}: {
    comment: any
    isLoading: boolean
}) => {
    const CommentLoading = () => {
        return (
            <View style={{ flex: 1, width: '100%' }}  marginBottom="$5">
                <XStack alignItems="center" space>
                    <Avatar circular size="$3">
                        <Skeleton
                            colorMode="light"
                            radius="round"
                            height={45}
                            width={45}
                        ></Skeleton>
                    </Avatar>
                    <YStack space="$2">
                        <XStack space={"$2"} alignItems="center">
                            <Skeleton
                                colorMode="light"
                                height={20}
                                width={150}
                            ></Skeleton>
                            <Skeleton
                                colorMode="light"
                                height={20}
                                width={100}
                            ></Skeleton>
                        </XStack>
                        <View>
                            <Skeleton
                                colorMode="light"
                                height={50}
                                width={"100%"}
                            ></Skeleton>
                        </View>
                    </YStack>
                </XStack>
            </View>
        )
    }

    if (isLoading) {
        return (
            <>
                <CommentLoading />
                <CommentLoading />
                <CommentLoading />
            </>
        )
    }
    return (
        <View style={{ flex: 1 }} width={"100%"} marginBottom="$5">
            <XStack alignItems="center" space>
                <Avatar circular size="$3">
                    <Avatar.Image src={comment.user.imageUrl} />
                    <Avatar.Fallback bc="red" />
                </Avatar>
                <YStack space="$2">
                    <XStack space={"$2"} alignItems="center">
                        <Text fontWeight={"$10"}>
                            {comment.user.firstname} {comment.user.lastname}
                        </Text>
                        <Text fontSize={"$2"} color={"$gray9"}>
                            {formatDistanceToNow(comment.createdAt, {
                                addSuffix: true,
                            })}
                        </Text>
                    </XStack>
                    <View>
                        <Text>{comment.text}</Text>
                    </View>
                </YStack>
            </XStack>
        </View>
    )
}