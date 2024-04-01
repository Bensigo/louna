import React, { useEffect, useRef, useState } from "react"
import { Box, IconButton, Input, Skeleton, Stack } from "@chakra-ui/react"
import {  BiPlus, BiTrash } from "react-icons/bi"

import { buildFileUrlV2 } from "~/utils/getFileurl"
import CustomImage from "./CustomImage"
import useFileUploadV2 from "~/hooks/useFileUploadV2"
import { api } from "~/utils/api"

type FileUploaderV2 = {
    file?: string 
    repo: string
    onRemove: (file: string) => void
    onUpload: (key: string) => void
    alt?: string
    isRounded: boolean
}

// files is the uploaded image
//

const V2FileUplaod: React.FC<FileUploaderV2> = ({ file, onUpload , onRemove, alt, repo, isRounded  }) => {
    const imageInputRef = useRef<HTMLInputElement>()
    const [localFile, setLocalFile] = useState<string | undefined| null>(file)


    const { mutate: deleteFile , isLoading: isDeleteing } = api.s3.delete.useMutation()

    const {
        handleUpload: upload,
        data,
        isLoading: isUploading,
    } = useFileUploadV2()


    useEffect(() => {
        if (data){
            setLocalFile(`${repo}/${data}`)
            onUpload(data);
        }
    }, [data, repo])

    const addImageClick = () => {
        imageInputRef.current?.click()
    }


    useEffect(() => {
        if (file){
            setLocalFile(file)   
        }
               
    }, [file])


    const handleFileUpload = (file: File) => {
        upload(file, repo)
    }

    


    const handleRemove = React.useCallback(() => {
        if (localFile){
            setLocalFile(null)
            const key = localFile.split('/')[1]
            if (key){
                onRemove(key)
                deleteFile({ key})
            }
            }
           
      
    }, [localFile, onRemove, deleteFile])

    return (
        <>
            {localFile ? (
                <Stack  width={'100%'} height={'100%'} spacing={3} alignItems={'center'}>
                    <CustomImage
                        alt={alt}
                        src={buildFileUrlV2(localFile)}
                        height={"70%"}
                        width={"100%"}
                        isRounded
                    />
                    <IconButton size={'md'} isLoading={isDeleteing}  colorScheme="red" icon={<BiTrash />} aria-label={"edit-image"} onClick={handleRemove} />
                </Stack>
            ) : (
                <>
                   <Skeleton isLoaded={!isUploading}>
                   <Input
                        display={"none"}
                        accept={"image/*"}
                        ref={imageInputRef}
                        type="file"
                        onChange={(e) => handleFileUpload(e.target?.files[0] as File)}
                    />
                    <IconButton
                        aria-label="color-mode"
                        onClick={addImageClick}
                        fontSize={25}
                        icon={<BiPlus />}
                        color="sage.500"
                        as="label"
                        htmlFor="fileInput"
                    />
                   </Skeleton>
                </>
            )}
        </>
    )
  
}


const MemoV2FileUplaod = React.memo(V2FileUplaod,  (prevProps, nextProps) => {
    // Compare relevant props to determine whether the component should re-render
    return (
      prevProps.file === nextProps.file &&
      prevProps.alt === nextProps.alt &&
      prevProps.repo === nextProps.repo
    );
  })

export { MemoV2FileUplaod }
