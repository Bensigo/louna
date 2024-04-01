import { Box, Button, Heading } from "@chakra-ui/react"
import CreateRecipeForm from "./components/CreateRecipeForm"
import { BiArrowBack } from "react-icons/bi"
import { useRouter } from "next/router"


export const CreateRecipeWrapper = () => {
    const router = useRouter()

    const goBack = () => router.replace(`/dashboard/recipes`)

    return (
        <Box py={8}>
              <Button leftIcon={<BiArrowBack />} onClick={goBack}>
                Back
            </Button>
            <Heading>Create Recipe</Heading>
            <CreateRecipeForm/>        
        </Box>
    )
}