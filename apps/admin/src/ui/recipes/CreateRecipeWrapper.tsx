import { Box, Button, Heading } from "@chakra-ui/react"
import { BiArrowBack } from "react-icons/bi"
import { useRouter } from "next/router"

import { NewRecipeForm } from "./components/NewRecipeForm"


export const CreateRecipeWrapper = () => {
    const router = useRouter()

    const goBack = () => router.replace(`/dashboard/recipes`)

    return (
        <Box py={8}>
              <Button leftIcon={<BiArrowBack />} onClick={goBack}>
                Back
            </Button>
            <Heading>Create Recipe</Heading>
            <NewRecipeForm />        
        </Box>
    )
}