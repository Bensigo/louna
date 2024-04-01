import { useRouter } from "next/router"
import { Skeleton } from "@chakra-ui/react"

import { api } from "~/utils/api"
import EditRecipeForm from "./components/EditRecipeForm"

const EditRecipeWrapper = () => {
    const router = useRouter()
    const id = router.query.id as string

    const { data: recipe, isLoading } = api.recipe.get.useQuery({ id })


    return (
        <Skeleton isLoaded={!isLoading}>
            {recipe && <EditRecipeForm recipe={recipe} id={id} />}
        </Skeleton>
    )
}


export default EditRecipeWrapper
