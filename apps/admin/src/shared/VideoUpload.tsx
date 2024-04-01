import React, { useEffect, useRef, useState } from "react"
import {
    AspectRatio,
    Box,
    IconButton,
    Input,
    Skeleton,
    Stack,
} from "@chakra-ui/react"
import { BiPlus, BiTrash } from "react-icons/bi"

import { api } from "~/utils/api"
import { buildFileUrlV2 } from "~/utils/getFileurl"
import useFileUploadV2 from "~/hooks/useFileUploadV2"
import CustomVideo from "./CustomVideo"

type VideoUploaderV2 = {
    video?: string
    repo: string
    onRemove: (video: string) => void
    onUpload: (key: string) => void
    title: string
   
}

const VideoUpload: React.FC<VideoUploaderV2> = ({
    video,
    onUpload,
    onRemove,
    title,
    repo
  
}) => {
    const videoInputRef = useRef<HTMLInputElement>()
    const [localVideo, setLocalVideo] = useState<string | undefined | null>(
        video,
    )

    const { mutate: deleteVideo, isLoading: isDeleting } =
        api.s3.delete.useMutation()

    const {
        handleUpload: upload,
        data,
        isLoading: isUploading,
    } = useFileUploadV2()

    useEffect(() => {
        if (data) {
            setLocalVideo(`${repo}/${data}`)
            onUpload(data)
        }
    }, [data, repo])

    const addVideoClick = () => {
        videoInputRef.current?.click()
    }

    useEffect(() => {
        if (video) {
            setLocalVideo(video)
        }
    }, [video])

    const handleVideoUpload = (file: File) => {
        upload(file, repo)
    }

    const handleRemove = React.useCallback(() => {
        if (localVideo) {
            setLocalVideo(null)
            const key = localVideo.split("/")[1]
            if (key) {
                onRemove(key)
                deleteVideo({ key })
            }
        }
    }, [localVideo, onRemove, deleteVideo])

    return (
        <>
            {localVideo ? (
                <Stack
                    width={"100%"}
                    height={"100%"}
                    spacing={3}
                    alignItems={"center"}
                >
                    {/* Assuming you have a CustomVideo component for displaying videos */}
                    <AspectRatio w={'100%'}>
                        <CustomVideo
                            alt={title}
                            src={buildFileUrlV2(localVideo)}
                            height={"100%"}
                            width={"100%"}
                        />
                    </AspectRatio>
                    <IconButton
                        size={"md"}
                        isLoading={isDeleting}
                        colorScheme="red"
                        icon={<BiTrash />}
                        aria-label={"remove-video"}
                        onClick={handleRemove}
                    />
                </Stack>
            ) : (
                <>
                    <Skeleton isLoaded={!isUploading}>
                        <Input
                            display={"none"}
                            accept={"video/*"}
                            ref={videoInputRef}
                            type="file"
                            onChange={(e) =>
                                handleVideoUpload(e.target?.files[0] as File)
                            }
                        />
                        <IconButton
                            aria-label="upload-video"
                            onClick={addVideoClick}
                            fontSize={25}
                            icon={<BiPlus />}
                            color="sage.500"
                            as="label"
                            htmlFor="videoInput"
                        />
                    </Skeleton>
                </>
            )}
        </>
    )
}

export default VideoUpload
