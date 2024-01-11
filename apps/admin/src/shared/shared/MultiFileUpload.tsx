import React, { useRef, useState, type FormEvent } from "react"
import {
    Box,
    Button,
    IconButton,
    Image,
    Input,
    Stack,
    useToast,
} from "@chakra-ui/react"
import { BiPlus, BiTrash, BiUpload } from "react-icons/bi"
import { v4 as uuidv4 } from "uuid"

import { api } from "~/utils/api"
import { buildFileUrl } from "~/utils/getFileurl"
import CustomImage from "~/shared/shared/CustomImage"

interface PreSignedPost {
    url: string
    fields: Record<string, any>
}

interface UploadedImageProps {
    file: File
    index: number
    onRemove: (index: number) => void
}

const UploadedImage: React.FC<UploadedImageProps> = ({
    file,
    index,
    onRemove,
}) => (
    <Box
        display={"flex"}
        flexDir={"column"}
        alignItems={"center"}
        justifyContent={"center"}
    >
        <Image
            src={URL.createObjectURL(file)}
            alt={`Selected Image ${index}`}
            maxH={200}
            maxW={200}
        />
        <IconButton
            mt={3}
            size={"sm"}
            aria-label="remove-image"
            colorScheme="red"
            icon={<BiTrash />}
            onClick={() => onRemove(index)}
        />
    </Box>
)

interface UploadFormProps {
    imageInputRef: React.RefObject<HTMLInputElement | undefined>
    files: File[]
    onFileChange: (e: FormEvent<HTMLInputElement>) => void
    onAddImageClick: () => void
    onUpload: () => void
    onRemove: (index: number) => void
    isUploading: boolean
    contentType: string
}

const UploadForm: React.FC<UploadFormProps> = ({
    imageInputRef,
    files,
    onFileChange,
    onAddImageClick,
    onUpload,
    onRemove,
    contentType,
    isUploading,
}) => (
    <>
        <Input
            display={"none"}
            accept={contentType}
            ref={imageInputRef}
            type="file"
            multiple
            onChange={onFileChange}
        />
        <Box
            borderStyle={"dashed"}
            minHeight={150}
            borderWidth={2}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
        >
            {files.length > 0 ? (
                <Stack spacing={2} flexDir={"row"} alignItems={"center"}>
                    {files.map((file, index) => (
                        <UploadedImage
                            index={index}
                            file={file}
                            key={index}
                            onRemove={onRemove}
                        />
                    ))}
                </Stack>
            ) : (
                <Stack alignItems={"center"}>
                    <IconButton
                        aria-label="color-mode"
                        onClick={onAddImageClick}
                        fontSize={25}
                        icon={<BiPlus />}
                        color="sage.500"
                        as="label"
                        htmlFor="fileInput"
                    />
                    <div>Click + to upload files</div>
                </Stack>
            )}
        </Box>
        {files.length >= 1 && (
            <Button
                isLoading={isUploading}
                mt={4}
                colorScheme="green"
                onClick={onUpload}
                rightIcon={<BiUpload />}
            >
                Upload
            </Button>
        )}
    </>
)

interface FileUploadFormProps {
    onUploadComplete: (keys: string[]) => void
    contentType: string
}

export const MultiFileUpload: React.FC<FileUploadFormProps> = ({
    onUploadComplete,
    contentType,
}) => {
    const [files, setFiles] = useState<File[]>([])
    const imageInputRef = useRef<HTMLInputElement>()
    const toast = useToast()
    const { mutate: getPreSignedUrl, isLoading: isUploading } =
        api.s3.getUploadPreSignedUrl.useMutation()
    const { mutate: updateUpload } = api.s3.updateFileUpload.useMutation()
    const { mutate: getUploads, data: uploadedFiles } =
        api.s3.getFilesByBaseId.useMutation()

    const handleFileChange = (e: FormEvent<HTMLInputElement>) => {
        const selectedFiles = e.currentTarget.files
        if (selectedFiles) {
            const filesArray: File[] = Array.from(selectedFiles)
            setFiles(filesArray)
        }
    }

    const handleAddImageClick = () => {
        imageInputRef.current?.click()
    }

    const handleRemoveImage = (index: number) => {
        const updatedFiles = [...files]
        updatedFiles.splice(index, 1)
        setFiles(updatedFiles)
    }

    const handleFileUploads = () => {
        if (files.length === 0) return
        const baseKey = uuidv4()

        try {
            getPreSignedUrl(
                {
                    fileNames: files.map((file) => file.name),
                    contentType: "image/png",
                    expiration: "36000",
                    baseKey,
                    repo: "recipes",
                },
                {
                    async onSuccess(data) {
                        await Promise.all(
                            files.map(async (file, index) => {
                                const { url, fields } = data[
                                    index
                                ] as PreSignedPost
                                const formData = new FormData()
                                const fileData: Record<string, any> = {
                                    ...fields,
                                    "Content-Type": file.type,
                                    file,
                                }

                                for (const name in fileData) {
                                    formData.append(name, fileData[name])
                                }

                                const resp = await fetch(url, {
                                    method: "POST",
                                    body: formData,
                                })

                                if (resp.ok) {
                                    updateUpload(
                                        { id: baseKey },
                                        {
                                            onSuccess: () => {
                                                getUploads(
                                                    { id: baseKey },
                                                    {
                                                        onSuccess: (data) => {
                                                            onUploadComplete(
                                                                data.map(
                                                                    (d) =>
                                                                        d.key,
                                                                ),
                                                            )
                                                        },
                                                    },
                                                )
                                            },
                                        },
                                    )
                                }
                            }),
                        )
                    },
                },
            )
        } catch (err) {
            console.log("err")
            toast({
                title: "Error",
                description: "File upload failed",
                status: "error",
                duration: 9000,
                isClosable: true,
            })
        }
    }

    return (
        <Box>
            {uploadedFiles ? (
                <Box
                    display={"flex"}
                    flexDir={"row"}
                    alignItems={"center"}
                    justifyContent={"flex-start"}
                >
                    {uploadedFiles.map((file, index) => (
                        <Box key={index} mr={4} height={150} width={300}  boxSizing="content-box" >
                            <CustomImage
                                src={buildFileUrl(file.repo, file.key)}
                                alt={`Image ${index}`}
                                height={'100%'}
                                width={'100%'}
                            />
                        </Box>
                    ))}
                </Box>
            ) : (
                <UploadForm
                    imageInputRef={imageInputRef}
                    files={files}
                    onRemove={handleRemoveImage}
                    onFileChange={handleFileChange}
                    onAddImageClick={handleAddImageClick}
                    onUpload={handleFileUploads}
                    isUploading={isUploading}
                    contentType={contentType}
                />
            )}
        </Box>
    )
}
