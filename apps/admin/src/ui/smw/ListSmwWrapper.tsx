import { InputGroup, Input, InputLeftElement, IconButton, Button, Collapse, Box, Text,VStack, Checkbox, Stack, HStack, Skeleton } from "@chakra-ui/react"

import { useSearchParams, usePathname } from "next/navigation"
import { useRouter } from "next/router"
import { useState } from "react"
import { BiSearch, BiFilter, BiPlus } from "react-icons/bi"
import { useDebouncedCallback } from "use-debounce"
import { Paginator } from "~/shared/Paginator"
import { api } from "~/utils/api"
import { SMWCard } from "./components/SMWCard"



type ContentType = 'Freemium' | 'Premium' | 'All'
type Category = 'Fitness' | 'Wellness' | 'All'



const ListSMWWrapper = () => {
    const params = useSearchParams()
    const { replace } = useRouter()
    const pathname = usePathname()

    const PAGE_LIMIT = 10
    const page = parseInt(params.get("page") || "1")
    const search = params.get("search")
    const published = params.get("published")
    const CT = params.get("contentType")


    const [categoryFilter, setCategoryFilter] = useState<Category>('All')
    const [contentType, setContentType] = useState<ContentType>('All')

    const [searchTerm, setSearchTerm] = useState<string>("")
    const [isPublished, setIsPublished] = useState(published === "true")

    const [isFiltersOpen, setIsFiltersOpen] = useState(false)


    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value
        setSearchTerm(term)
        handleSearch(term)
    }

    const handleCategoryChange = (category: Category) => {
        const currentParams = new URLSearchParams(params)
        currentParams.set("page", page.toString())

        if (category) {
          
                setCategoryFilter(category)
                currentParams.set("category", category)
            
           
        } else {
            currentParams.delete("category")
        }

        replace(`${pathname}?${currentParams.toString()}`)
    }

    const goToCreate = () => replace(`${pathname}/create`)

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

    const handleIsPublishedChange = () => {
        const currentParams = new URLSearchParams(params)
        setIsPublished((val) => !val)
        currentParams.set("isPublished", String(!isPublished))
        replace(`${pathname}?${currentParams.toString()}`)
    }

    const handleChangePage = (page: number) => {
        const currenParams = new URLSearchParams(params)
        currenParams.set("page", page.toString())
        replace(`${pathname}?${currenParams.toString()}`)
    }


    const handleContentTypeChange = (contentType: ContentType) => {
        const currentParams = new URLSearchParams(params)
        setContentType(contentType)
        currentParams.set("contentType", contentType)
        replace(`${pathname}?${currentParams.toString()}`)
    }


    const { isLoading, data, isFetched } = api.smw.list.useQuery({
        page,
        limit: PAGE_LIMIT,
        filter: {
            ...(search ? { searchTerm: search } : {}),
            ...(isPublished  ? { isPublished: 'true' } : {}),
            ...( contentType ? { contentType }: {}),    
            ...( categoryFilter ? { category: categoryFilter }: {})    
        },
    })



    return (
        <Box>
             <Text my={3} fontWeight={'bold'} fontSize={'x-large'}>Solu Micro Wellness</Text>
            <Box display={"flex"} justifyContent={"space-between"}>
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
                <Button leftIcon={<BiPlus />} onClick={goToCreate}>
                    Add SMW
                </Button>
            </Box>
            <Collapse in={isFiltersOpen} animateOpacity>
                <VStack align="start" spacing={4}>
                    <Box>
                        <Checkbox
                            onChange={handleIsPublishedChange}
                            isChecked={isPublished}
                            colorScheme="teal"
                        >
                            Published
                        </Checkbox>
                    </Box>
                    <Box>
                        <Text fontSize="md" fontWeight="semibold" mb={2}>
                            Category
                        </Text>
                        <Stack direction="row" spacing={4}>
                            <Checkbox
                                onChange={() => handleCategoryChange("Fitness")}
                                isChecked={categoryFilter === "Fitness"}
                                colorScheme="teal"
                            >
                                Fitness
                            </Checkbox>
                            <Checkbox
                                onChange={() =>
                                    handleCategoryChange("Wellness")
                                }
                                isChecked={categoryFilter === "Wellness"}
                                colorScheme="teal"
                            >
                                Wellness
                            </Checkbox>
                            <Checkbox
                                onChange={() => handleCategoryChange("All")}
                                isChecked={categoryFilter === "All"}
                                colorScheme="teal"
                            >
                                All
                            </Checkbox>
                        </Stack>
                    </Box>


                    <Box>
                    <Text fontSize="md" fontWeight="semibold" mb={2}>
                        Content Type
                    </Text>
                    <Stack direction="row" spacing={4}>
                        <Checkbox
                            onChange={() => handleContentTypeChange("Freemium")}
                            isChecked={contentType === "Freemium"}
                            colorScheme="teal"
                        >
                        Freemium
                        </Checkbox>
                        <Checkbox
                            onChange={() =>
                                handleContentTypeChange("Premium")
                            }
                            isChecked={contentType === "Premium"}
                            colorScheme="teal"
                        >
                        Premium
                        </Checkbox>
                        <Checkbox
                            onChange={() => handleContentTypeChange("All")}
                            isChecked={contentType === "All"}
                            colorScheme="teal"
                        >
                            All
                        </Checkbox>
                    </Stack>
                </Box>
                </VStack>
            </Collapse>
            {isFetched  && data.smws.length && (
                <Stack mt={5} width={'100%'}>
                    <HStack  spacing={5} flexFlow={"wrap"} width={"inherit"} mb={5}>
                        {[...data.smws, ...data.smws].map(
                            (smw) => (
                                <Skeleton
                                    isLoaded={!isLoading}
                                    key={smw.id}
                                >
                                  <SMWCard smw={smw} />
                                </Skeleton>
                            ),
                        )}
                    </HStack>
                    <Paginator
                        currentPage={page}
                        totalPages={data?.totalPages || 0}
                        goToPage={handleChangePage}
                    />
                </Stack>
            ) }
            
            {isFetched && !data  && (
                <Box
                    display={"flex"}
                    flexDir={"row"}
                    justifyContent={"center"}
                    py={5}
                    width={"100%"}
                >
                    <Text>SMW not found</Text>
                </Box>
            )}
            {isLoading && <Skeleton minH={400} width={'100%'} />}
        </Box>
    )
}

export { ListSMWWrapper }