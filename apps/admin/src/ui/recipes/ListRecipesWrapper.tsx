import { useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { useRouter } from "next/router"
import {
    Box,
    Button,
    Checkbox,
    Collapse,
    HStack,
    IconButton,
    Input,
    InputGroup,
    InputLeftElement,
    Skeleton,
    Stack,
    Text,
    VStack,
} from "@chakra-ui/react"
import { BiFilter, BiPlus, BiSearch } from "react-icons/bi"
import { useDebouncedCallback } from "use-debounce"

import { api } from "~/utils/api"
import RecipeCard from "./components/RecipeCard"
import { Paginator } from "~/shared/Paginator"

const ListRecipeWrapper = () => {
    const params = useSearchParams()
    const { replace, push } = useRouter()
    const pathname = usePathname()

    const PAGE_LIMIT = 10
    const page = parseInt(params.get("page") || "1")
    const search = params.get("search")
    const isApproved = params.get("isApproved")

    const [searchTerm, setSearchTerm] = useState<string>("")
    const [isApprove, setIsApprove] = useState<boolean>(isApproved === "true")
    const [mealTypeFilters, setMealTypeFilters] = useState<string[]>([])
    const [isFiltersOpen, setIsFiltersOpen] = useState(false)

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value
        setSearchTerm(term)
        handleSearch(term)
    }

    const handleMealTypeChange = (type: string) => {
        const updatedFilters = mealTypeFilters.includes(type)
            ? mealTypeFilters.filter((filter) => filter !== type)
            : [...mealTypeFilters, type]

        setMealTypeFilters(updatedFilters)

        const currentParams = new URLSearchParams(params)
        currentParams.set("page", page.toString())

        if (updatedFilters.length > 0) {
            currentParams.set("mealType", updatedFilters.join(","))
        } else {
            currentParams.delete("mealType")
        }

        replace(`${pathname}?${currentParams.toString()}`)
    }

    const { isLoading, data } = api.recipe.list.useQuery({
        page,
        limit: PAGE_LIMIT,
        filter: {
            ...(search ? { searchName: search } : {}),
            ...(isApproved === "true" ? { isApproved: isApproved } : {}),
            mealType: mealTypeFilters,
        },
    })

    const handleSearch = useDebouncedCallback((term: string) => {
        const currentParams = new URLSearchParams(params)
        currentParams.set("page", page.toString())
        if (term) {
            currentParams.set("search", term)
        } else {
            currentParams.delete("search")
        }
        replace(`${pathname}?${currentParams.toString()}`)
    }, 300)

    const handleIsApproveChange = () => {
        const currentParams = new URLSearchParams(params)
        setIsApprove((val) => !val)
        currentParams.set("isApproved", String(!isApprove))
        replace(`${pathname}?${currentParams.toString()}`)
    }

    const goToCreatePage = () => push(`${pathname}/create`)

    const handleChangePage = (page: number) => {
        const currenParams = new URLSearchParams(params)
        currenParams.set("page", page.toString())
        replace(`${pathname}?${currenParams.toString()}`)
    }

    return (
        <>
        <Text  my={3} fontWeight={'bold'} fontSize={'x-large'}>Recipes</Text>
        <VStack spacing={6} align="start" width={'100%'}>
            <Button
           
                alignSelf={'end'}
               
                leftIcon={<BiPlus />}
                onClick={goToCreatePage}
            >
                Create Recipe
            </Button>
            <Box w="50%" display={'flex'} alignItems={'center'}>
                <InputGroup mr={4}>
                    <Input
                     borderWidth={3}
                        placeholder="Search..."
                        onChange={handleTextChange}
                        value={searchTerm}
                    />
                    <InputLeftElement>
                        <IconButton
                           
                            aria-label="Search"
                            disabled
                            icon={<BiSearch />}
                            variant="ghost"
                            colorScheme="green"
                        />
                    </InputLeftElement>
                </InputGroup>
                <Button
                leftIcon={<BiFilter />}
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                size="md"
      
            >
                filters
            </Button>  
            </Box>

            <Collapse in={isFiltersOpen} animateOpacity>
                <VStack align="start" spacing={4}>
                    <Box>
                        <Checkbox
                            onChange={handleIsApproveChange}
                            isChecked={isApprove}
                            colorScheme="teal"
                        >
                            Approved
                        </Checkbox>
                    </Box>
                    <Box>
                        <Text fontSize="md" fontWeight="semibold" mb={2}>
                            Meal Type
                        </Text>
                        <Stack direction="row" spacing={4}>
                            <Checkbox
                                onChange={() =>
                                    handleMealTypeChange("BREAKFAST")
                                }
                                isChecked={mealTypeFilters.includes(
                                    "BREAKFAST",
                                )}
                                colorScheme="teal"
                            >
                                Breakfast
                            </Checkbox>
                            <Checkbox
                                onChange={() => handleMealTypeChange("LUNCH")}
                                isChecked={mealTypeFilters.includes("LUNCH")}
                                colorScheme="teal"
                            >
                                Lunch
                            </Checkbox>
                            <Checkbox
                                onChange={() => handleMealTypeChange("DINNER")}
                                isChecked={mealTypeFilters.includes("DINNER")}
                                colorScheme="teal"
                            >
                                Dinner
                            </Checkbox>
                            <Checkbox
                                onChange={() => handleMealTypeChange("SNACK")}
                                isChecked={mealTypeFilters.includes("SNACK")}
                                colorScheme="teal"
                            >
                                Snack
                            </Checkbox>
                        </Stack>
                    </Box>
                </VStack>
            </Collapse>
           
            {data && data.recipes.length ? (
                <HStack spacing={5} flexFlow={'wrap'} width={'inherit'} >

                    {[...data.recipes, ...data.recipes].map(recipe => (
                        <Skeleton  isLoaded={!isLoading} key={recipe.id}> 
                            <RecipeCard recipe={recipe}  />
                        </Skeleton>
                    ))}
                    <Paginator
                        currentPage={page}
                        totalPages={data?.totalPages || 0}
                        goToPage={handleChangePage}
                    />
                </HStack>
            ) : (
                <Box
                    display={"flex"}
                    flexDir={"row"}
                    justifyContent={"center"}
                    py={5}
                    width={"100%"}
                >
                    <Text>Recipe not found</Text>
                </Box>
            )}
       
        </VStack>
        </>
    )
}

export { ListRecipeWrapper }
