import React, { useState } from "react"
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
import { Paginator } from "~/shared/Paginator"
import { PartnerCard } from "./components/PartnerCard"

export type Category = "Fitness" | "Wellness" | "All"

export function PartnerListWrapper() {
    const params = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()
    const PAGE_LIMIT = 10
    const page = parseInt(params.get("page") || "1")
    const search = params.get("search")
    const published = params.get("published")

    const [searchTerm, setSearchTerm] = useState<string>("")

    const [categoryFilter, setCategoryFilter] = useState<Category>("All")
    const [isPublished, setIsPublished] = useState(published === "true")
    const [isFiltersOpen, setIsFiltersOpen] = useState(false)

    const { data, isLoading } = api.partner.list.useQuery({
        page,
        limit: PAGE_LIMIT,
        filter: {
            ...(search ? { searchTerm: search } : {}),
            ...(isPublished ? { isPublished: "true" } : {}),
            ...(categoryFilter ? { category: categoryFilter } : {}),
        },
    })

    const handleChangePage = (page: number) => {
        const currenParams = new URLSearchParams(params)
        currenParams.set("page", page.toString())
        replace(`${pathname}?${currenParams.toString()}`)
    }

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

    const handleIsPublishedChange = () => {
        const currentParams = new URLSearchParams(params)
        setIsPublished((val) => !val)
        currentParams.set("isPublished", String(!isPublished))
        replace(`${pathname}?${currentParams.toString()}`)
    }

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value
        setSearchTerm(term)
        handleSearch(term)
    }

    const goToCreatePartner = () => {
        replace(`${pathname}/create`)
    }

    return (
        <Box>
            <Box display="flex" justifyContent={"space-between"}>
                <Text my={3} fontWeight={"bold"} fontSize={"x-large"}>
                    Solu Partners
                </Text>
                <Button onClick={goToCreatePartner} leftIcon={<BiPlus />}>
                    Add Partner
                </Button>
            </Box>
            <HStack spacing={3} alignItems={"center"} mb={5}>
                <InputGroup maxW={400}>
                    <Input
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
                            colorScheme="gray"
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
            </HStack>
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
                    <Box></Box>
                </VStack>
            </Collapse>
            {data && data.partners.length ? (
                <Skeleton isLoaded={!isLoading}>
                    <Stack mt={5} width={"100%"}>
                        <HStack
                            spacing={5}
                            flexFlow={"wrap"}
                            width={"inherit"}
                            mb={5}
                        >
                            {data.partners.map(
                                (partner) => (
                                    <PartnerCard
                                        key={partner.id}
                                        partner={partner}
                                    />
                                ),
                            )}
                        </HStack>
                        <Paginator
                            currentPage={page}
                            totalPages={data?.totalPages || 0}
                            goToPage={handleChangePage}
                        />
                    </Stack>
                </Skeleton>
            ) : (
                <Box
                    display={"flex"}
                    flexDir={"row"}
                    justifyContent={"center"}
                    py={5}
                    width={"100%"}
                >
                    <Text>Patners not found</Text>
                </Box>
            )}
        </Box>
    )
}
