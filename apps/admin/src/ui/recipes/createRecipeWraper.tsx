import { Box, Heading } from "@chakra-ui/react"
import { FileUploadForm } from "~/shared/shared/FileUpload"
import { useState } from "react"
import CreateRecipeForm from "./components/createRecipeForm"


export const CreateRecipesWrapper = () => {
    const [imageKeys, setImageKeys ] = useState<string[]>([])
    console.log({imageKeys})
    return (
        <Box py={8}>
                <Heading >Create Recipe</Heading>
                <CreateRecipeForm/ >
                {/* <FileUploadForm onUploadComplete={val => setImageKeys(val)} contentType="image/png" /> */}
  
        </Box>
    )
}