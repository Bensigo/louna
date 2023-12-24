import React from "react"
import {  FlatList } from "react-native"
import { Sheet, H4, View } from "tamagui"
import { api } from "../../utils/api"
import { CustomTextInput } from './customTextInput'
import { CommentItem } from "./comment"


export const Comments = ({ onShowComment, showComment, postId }: { onShowComment: (val: boolean) => void, showComment: boolean, postId: string }) => {
   
    const { mutate } = api.post.createComment.useMutation()
    const context = api.useUtils()
    const { data: comments, isLoading } = api.post.listComment.useQuery({ postId, limit: 100})

    const handleSendComment = (comment: string) => {
        mutate({
            postId,
            comment
        }, {
            onSuccess: () => {
                context.post.listComment.refetch({ limit: 100, postId })
                context.post.listPost.refetch({ limit: 100  })
            }
        })
    }

    return (
        <Sheet
            forceRemoveScrollEnabled={showComment}
            open={showComment}
            onOpenChange={onShowComment}
            dismissOnSnapToBottom
            snapPoints={[90, 50]}
            zIndex={100_000}
            animation="lazy"
        >
            <Sheet.Overlay
                animation="lazy"
                enterStyle={{ opacity: 0 }}
                exitStyle={{ opacity: 0 }}
            />
            <Sheet.Handle />
            <Sheet.Frame>
                <View alignItems="center" padding="$4">
                    <H4>Comments</H4>
                </View>
                <View
                    width={"100%"}
                    borderBottomWidth={1}
                    borderBottomColor={"$gray6"}
                />
                {/* <ScrollView style={{ padding: 10 }}> */}
                <View style={{ padding: 10, flex: 1}}>
                    <FlatList
                        scrollEnabled
                        keyExtractor={(item) => item.id}
                        data={comments}
                        renderItem={({ item }) => (
                            <CommentItem comment={{ ...item }} isLoading={isLoading} />
                        )}
                    />
                    </View>
                {/* </ScrollView> */}

                <CustomTextInput onPostText={handleSendComment} />
            </Sheet.Frame>
        </Sheet>
    )
}