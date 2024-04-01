import { InputGroup, Input, InputLeftElement, IconButton, Button, Collapse,Box, VStack, Checkbox, Stack, HStack, Skeleton, Text } from "@chakra-ui/react"
import { useSearchParams, usePathname } from "next/navigation"
import { useRouter } from "next/router"
import { useState } from "react"
import { BiSearch, BiFilter, BiPlus } from "react-icons/bi"
import { useDebouncedCallback } from "use-debounce"
import { Paginator } from "~/shared/Paginator"
import { api } from "~/utils/api"
import { ResourceCard } from "./components/ResourceCard"


export const ListResourcesWrapper = () => {
    const params = useSearchParams()
    const { replace } = useRouter()
    const pathname = usePathname()

    const PAGE_LIMIT = 10
    const page = parseInt(params.get("page") || "1")
    const search = params.get("search")
    const publish = params.get("publish")



    const [searchTerm, setSearchTerm] = useState<string>("")


    const [isFiltersOpen, setIsFiltersOpen] = useState(false)


    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value
        setSearchTerm(term)
        handleSearch(term)
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

    const handlePublishedChange = (type: 'unPublish' |'Publish' | 'all') => {
        const currentParams = new URLSearchParams(params)
        currentParams.set("publish", type)
        replace(`${pathname}?${currentParams.toString()}`)
    }

    const handleChangePage = (page: number) => {
        const currenParams = new URLSearchParams(params)
        currenParams.set("page", page.toString())
        replace(`${pathname}?${currenParams.toString()}`)
    }


 


    const { isLoading, data } = api.resource.list.useQuery({ 
        filter: {
            page,
            limit: PAGE_LIMIT,
            ...(publish  ? { type: publish } : { type: 'all'}),
       
        },
        ...(search ? { searchTerm: search } : {}),
    })



    return (
        <Box>
             <Text my={3} fontWeight={'bold'} fontSize={'x-large'}>Resources</Text>
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
                    Add Resource
                </Button>
            </Box>
            <Collapse in={isFiltersOpen} animateOpacity>
                <VStack align="start" spacing={4}>
                    <Box>
                        <Text fontSize="md" fontWeight="semibold" mb={2}>
                            Category
                        </Text>
                        <Stack direction="row" spacing={4}>
                            <Checkbox
                                onChange={() => handlePublishedChange("Publish")}
                                isChecked={publish === "Publish"}
                                colorScheme="teal"
                            >
                                Publish
                            </Checkbox>
                            <Checkbox
                                onChange={() =>
                                    handlePublishedChange("unPublish")
                                }
                                isChecked={publish === "unPublish"}
                                colorScheme="teal"
                            >
                                Unpublish
                            </Checkbox>
                            <Checkbox
                                onChange={() => handlePublishedChange("all")}
                                isChecked={publish === "all"}
                                colorScheme="teal"
                            >
                                All
                            </Checkbox>
                        </Stack>
                    </Box>


                 
                </VStack>
            </Collapse>
            {data && data.resources.length ? (
                <Stack mt={5} width={'100%'}>
                    <HStack  spacing={5} flexFlow={"wrap"} width={"inherit"} mb={5}>
                        {data.resources.map(
                            (resource) => (
                                <Skeleton
                                    isLoaded={!isLoading}
                                    key={resource.id}
                                >
                                  <ResourceCard resource={resource} />
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
            ) : (
                <Box
                    display={"flex"}
                    flexDir={"row"}
                    justifyContent={"center"}
                    py={5}
                    width={"100%"}
                >
                    <Text>Resources not found</Text>
                </Box>
            )}
        </Box>
    )
}
