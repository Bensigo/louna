import React, { useEffect, useRef, useState } from "react"
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
    useToast
} from "@chakra-ui/react"
import { BiDownload, BiFilter, BiPlus, BiSearch, BiUpload } from "react-icons/bi"
import { useDebouncedCallback } from "use-debounce"

import { api } from "~/utils/api"
import { Paginator } from "~/shared/Paginator"
import RecipeCard from "./components/RecipeCard"

import axios from 'axios'

const ListRecipeWrapper = () => {
    const params = useSearchParams()
    const { replace, push } = useRouter()
    const pathname = usePathname()
    const toast = useToast()

    const PAGE_LIMIT = 10
    const page = parseInt(params.get("page") || "1")
    const search = params.get("search")
    const isApproved = params.get("isApproved")


    const ctx = api.useUtils();

    const [searchTerm, setSearchTerm] = useState<string>("")
    const [file, setFile] = useState<File>(null)
    const [isApprove, setIsApprove] = useState<boolean>(isApproved === "true")
    const [generatingUpload, setGeneratingUpload] = useState<boolean>(false)
    const [mealTypeFilters, setMealTypeFilters] = useState<string[]>([])
    const [isFiltersOpen, setIsFiltersOpen] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)


    useEffect(() => 
    {
        if (file){
            uploadRecipes(file)
        }
        return () => {
            setIsUploading(false); 
        };
    }, [file])


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

    const { isLoading, data, isFetched } = api.recipe.list.useQuery({
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



    const generateBulkUpload = async () => {
        try {
            setGeneratingUpload(true)
            await axios.get('/api/bulk/recipe/generate',{
                responseType: 'arraybuffer'
            }).then((response) => {
                const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const link = document.createElement('a')
                link.href = window.URL.createObjectURL(blob)
                link.download = `recipe-upload-sheet-${new Date().toISOString()}.xlsx`
                link.click()
                setGeneratingUpload(false);
            })
            
        }catch(err){
            setGeneratingUpload(false);
            console.log(err)
            toast({
                title: 'File generation',
                description: err.message,
                status: "error",
                duration: 9000,
                isClosable: true,
                
            })
        }
    }

   
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0])
        }
    }
    const uploadClickHandler = async () => {

        fileInputRef.current?.click()
       
    }

    const uploadRecipes = async  (file: File) => {
        try {
            
            setIsUploading(true)
            // Prepare the form data
            const formData = new FormData()
            formData.append('file', file)
    
            // Make the POST request to upload the file
            await axios.post('/api/bulk/recipe/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            ctx.recipe.list.invalidate()
            setIsUploading(false)
            toast({
                title: 'Upload successful',
                description: 'The recipes have been uploaded successfully.',
                status: 'success',
                duration: 9000,
                isClosable: true,
            })
        }
         catch (err){
            setIsUploading(false)
            toast({
                title: 'Failed to upload',
                description: err.message,
                status: "error",
                duration: 9000,
                isClosable: true,
                
            })
         }
    }

    return (
        <>
            <Text my={3} fontWeight={"bold"} fontSize={"x-large"}>
                Recipes
            </Text>
            <VStack spacing={6} align="start" width={"100%"}>
               <HStack spacing={2} alignSelf={'end'}>
               <input ref={fileInputRef} style={{ display: 'none' }} type="file" accept=".xlsx, .xls" onChange={handleFileChange} />

               <Button
             
             leftIcon={<BiUpload />}
             onClick={uploadClickHandler}
             isLoading={isUploading}
         >
            Upload
         </Button>
               <Button
             
                    leftIcon={<BiDownload />}
                    onClick={generateBulkUpload}
                    isLoading={generatingUpload}
                >
                    Generate Bulk Upload
                </Button>
               <Button
                    
                    leftIcon={<BiPlus />}
                    onClick={goToCreatePage}
                >
                    Create Recipe
                </Button>
               </HStack>
                <Box w="50%" display={"flex"} alignItems={"center"}>
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
                                    onChange={() =>
                                        handleMealTypeChange("LUNCH")
                                    }
                                    isChecked={mealTypeFilters.includes(
                                        "LUNCH",
                                    )}
                                    colorScheme="teal"
                                >
                                    Lunch
                                </Checkbox>
                                <Checkbox
                                    onChange={() =>
                                        handleMealTypeChange("DINNER")
                                    }
                                    isChecked={mealTypeFilters.includes(
                                        "DINNER",
                                    )}
                                    colorScheme="teal"
                                >
                                    Dinner
                                </Checkbox>
                                <Checkbox
                                    onChange={() =>
                                        handleMealTypeChange("SNACK")
                                    }
                                    isChecked={mealTypeFilters.includes(
                                        "SNACK",
                                    )}
                                    colorScheme="teal"
                                >
                                    Snack
                                </Checkbox>
                            </Stack>
                        </Box>
                    </VStack>
                </Collapse>
                (
                <HStack spacing={5} flexFlow={"wrap"} width={"inherit"}>
                    {data  && data.recipes.map((recipe) => (
                        <Skeleton isLoaded={!isLoading} key={recipe.id}>
                            <RecipeCard recipe={recipe} />
                        </Skeleton>
                    ))}
                    {!data && isFetched && (
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
                   {data && isFetched && <Paginator
                        currentPage={page}
                        totalPages={data?.totalPages || 0}
                        goToPage={handleChangePage}
                    />}
                    {isLoading && <Skeleton minH={400} width={'100%'} />}
                </HStack>
                )
            </VStack>
        </>
    )
}

export { ListRecipeWrapper }
