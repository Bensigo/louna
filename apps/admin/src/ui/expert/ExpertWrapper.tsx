import { useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { useRouter } from "next/router"
import { Box } from "@chakra-ui/layout"
import {
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
import { Paginator } from "~/shared/Paginator"
import ExpertCard from "./component/ExpertCard"

const ExpertWrapper = () => {
    const params = useSearchParams()
    const { replace } = useRouter()
    const pathname = usePathname()

    const PAGE_LIMIT = 10
    const page = parseInt(params.get("page") || "1")
    const search = params.get("search")
    const isApproved = params.get("isValid")

    const [categoryFilter, setCategoryFilter] = useState<string>()

    const [searchTerm, setSearchTerm] = useState<string>("")
    const [isValid, setIsValid] = useState<boolean>(isApproved === "true")
    const [isFiltersOpen, setIsFiltersOpen] = useState(false)

    const { isLoading, data } = api.instructor.list.useQuery({
        page,
        limit: PAGE_LIMIT,
        filter: {
            ...(search ? { searchName: search } : {}),
            ...(isApproved === "true" ? { isActive: isApproved } : {}),
            ...(categoryFilter
                ? categoryFilter !== 'all' &&  {  category: categoryFilter as "Fitness" | "Wellness" }
                : {}),
        },
    })

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value
        setSearchTerm(term)
        handleSearch(term)
    }

    const handleCategoryChange = (category: string) => {
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

    const handleIsApproveChange = () => {
        const currentParams = new URLSearchParams(params)
        setIsValid((val) => !val)
        currentParams.set("isApproved", String(!isValid))
        replace(`${pathname}?${currentParams.toString()}`)
    }

    const handleChangePage = (page: number) => {
        const currenParams = new URLSearchParams(params)
        currenParams.set("page", page.toString())
        replace(`${pathname}?${currenParams.toString()}`)
    }

    return (
        <Box>
            <Text  my={3} fontWeight={'bold'} fontSize={'x-large'}>Solu Expert</Text>
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
                    Add Instructor
                </Button>
            </Box>
            <Collapse in={isFiltersOpen} animateOpacity>
                <VStack align="start" spacing={4}>
                    <Box>
                        <Checkbox
                            onChange={handleIsApproveChange}
                            isChecked={isValid}
                            colorScheme="teal"
                        >
                            Approved
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
                                onChange={() => handleCategoryChange("all")}
                                isChecked={categoryFilter === "all"}
                                colorScheme="teal"
                            >
                                All
                            </Checkbox>
                        </Stack>
                    </Box>
                </VStack>
            </Collapse>
            {data && data.instructors.length ? (
                <Stack mt={5} width={'100%'}>
                    <HStack  spacing={5} flexFlow={"wrap"} width={"inherit"} mb={5}>
                        {[...data.instructors, ...data.instructors].map(
                            (instructor) => (
                                <Skeleton
                                    isLoaded={!isLoading}
                                    key={instructor.id}
                                >
                                    <ExpertCard instructor={instructor} />
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
                    <Text>Instructors not found</Text>
                </Box>
            )}
        </Box>
    )
}

export default ExpertWrapper
