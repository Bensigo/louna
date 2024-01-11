import { File } from "buffer"
import React, { useEffect, useRef, useState, type FormEvent } from "react"
import {
    Box,
    Button,
    IconButton,
    Image,
    Input,
    Skeleton,
    Stack,
    useToast,
} from "@chakra-ui/react"
import { BiCheck, BiPlus, BiTrash, BiUpload } from "react-icons/bi"
import { v4 as uuidv4 } from "uuid"

import { api } from "~/utils/api"
import { buildFileUrl } from "~/utils/getFileurl"
import useFileUpload from "~/hooks/useFileUpload"
import CustomImage from "~/shared/shared/CustomImage"

interface PreSignedPost {
    url: string
    fields: Record<string, any>
}

interface UploadedImageProps {
    file: File
    onRemove: () => void
    onUpload: () => void
}

interface FileUploadFormProps {
    onUploadComplete: (keys: string[]) => void
    contentType: string
    repo: string
    h: number | string
    w: number | string
}

// Updated UploadedImage component
// Updated UploadedImage component
const UploadedImage: React.FC<UploadedImageProps> = ({
    file,
    onRemove,
    onUpload,
}) => {
    return (
        <Box
            display={"flex"}
            flexDir={"column"}
            alignItems={"center"}
            justifyContent={"center"}
            boxSize={"auto"}
        >
            <Box
                borderRadius={10}
                overflow="hidden"
                boxShadow="md"
                bg="gray.200"
                boxSize="80px"
            >
                <Image
                    src={URL.createObjectURL(file)}
                    alt={`Selected Image `}
                    boxSize="100%"
                    objectFit="cover"
                    width="100%"
                    height="100%"
                />
            </Box>
            <Stack spacing={5} flexDir={"row"}>
                <IconButton
                    mt={3}
                    size={"sm"}
                    aria-label="remove-image"
                    colorScheme="red"
                    icon={<BiTrash />}
                    onClick={() => onRemove()}
                />
                <IconButton
                    mt={3}
                    size={"sm"}
                    aria-label="upload-image"
                    colorScheme="green"
                    icon={<BiCheck />}
                    onClick={() => onUpload()}
                />
            </Stack>
        </Box>
    )
}

// Updated FileUploadForm component
const FileUploadForm: React.FC<FileUploadFormProps> = ({
    onUploadComplete,
    contentType,
    repo,
    h,
    w,
}) => {
    const [file, setFile] = useState<File>()
    const imageInputRef = useRef<HTMLInputElement>()
    const { data, isLoading, handleUpload: upload } = useFileUpload()

    const addImageClick = () => {
        imageInputRef.current?.click()
    }

    const handleUpload = () => {
        if (!file ||!repo) return
        upload(file, repo)
    }

    useEffect(() => {
      
        if(data){
            onUploadComplete(data)
        }
        return () => {};
    }, [data])

    return (
        <Box height={h} width={w} p={10}>
            <Input
                display={"none"}
                accept={contentType}
                ref={imageInputRef}
                type="file"
                onChange={(e) => setFile(e.target?.files[0] as File)}
            />
            {file  ? (
                <Stack
                    spacing={2}
                    flexDir={"row"}
                    alignItems={"center"}
                    height={"100%"}
                    width={"100%"}
                >
                    {!data ? 
                      <Skeleton isLoaded={!isLoading}>
                      <UploadedImage
                          file={file}
                          onRemove={() => setFile(undefined)}
                          onUpload={handleUpload}
                      />
                  </Skeleton>
                  : 
                  <CustomImage src={buildFileUrl(repo, data[0] as string)} alt={file.name} height={'100%'} width={'100%'}  />    
                
                }
                </Stack>
            ) : (
                <Stack alignItems={"center"}>
                    <IconButton
                        aria-label="color-mode"
                        onClick={addImageClick}
                        fontSize={25}
                        icon={<BiPlus />}
                        color="sage.500"
                        as="label"
                        htmlFor="fileInput"
                    />
                </Stack>
            )}
        </Box>
    )
}
const MemorizeFileUploadForm = React.memo(FileUploadForm)
export { MemorizeFileUploadForm }