import { useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { useRouter } from "next/router"
import {
    Box,
    Button,
    Checkbox,
    Collapse,
    IconButton,
    Input,
    InputGroup,
    InputLeftElement,
    Skeleton,
    Stack,
    Text,
    VStack,
} from "@chakra-ui/react"
import { BiFilter, BiSearch } from "react-icons/bi"
import { useDebouncedCallback } from "use-debounce"

import { api } from "~/utils/api"
import { UserCard } from "./components/UserCard"
import { Paginator } from "~/shared/Paginator"

export const ListUserWrapper = () => {
    const params = useSearchParams()
    const { replace } = useRouter()
    const pathname = usePathname()

    const PAGE_LIMIT = 10
    const page = parseInt(params.get("page") || "1")
    const search = params.get("search")
    const isSubscriber = params.get("isSubscriber")

    const [searchTerm, setSearchTerm] = useState<string>("")
    // const [isSubscribe, setIsSubscribe] = useState<boolean>(isSubscriber === "true")
    const [isFiltersOpen, setIsFiltersOpen] = useState(false)

    const { isLoading, data, isFetched } = api.user.list.useQuery({
        page,
        limit: PAGE_LIMIT,
        filters: {
            ...(search ? { searchName: search } : {}),
            isSubscribe: isSubscriber === "true",
        },
    })

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value
        setSearchTerm(term)
        handleSearch(term)
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

    const handleSubscriberFilterChange = (value: boolean) => {
        const currentParams = new URLSearchParams(params)
        currentParams.set("page", page.toString())

        if (value) {
            currentParams.set("isSubscriber", String(value))
        } else {
            currentParams.delete("isSubscriber")
        }
        replace(`${pathname}?${currentParams.toString()}`)
    }

    const handleChangePage = (page: number) => {
        const currenParams = new URLSearchParams(params)
        currenParams.set("page", page.toString())
        replace(`${pathname}?${currenParams.toString()}`)
    }

    return (
        <Box>
             <Text my={3} fontWeight={"bold"} fontSize={"x-large"}>
                Users
            </Text>
            <Box display={"flex"} justifyContent={"space-between"}>
                <Box w="50%" display={"flex"} alignItems={"center"}>
                    <InputGroup mr={4}>
                        <Input
                            borderWidth={3}
                            placeholder="Search user by name......"
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
            </Box>
            <Collapse in={isFiltersOpen} animateOpacity>
                <VStack align="start" spacing={4}>
                    <Box>
                        <Text fontSize="md" fontWeight="semibold" mb={2}>
                            User filters
                        </Text>
                        <Text>Subscriber filter</Text>
                        <Stack direction="row" spacing={4}>
                            <Checkbox
                                onChange={() =>
                                    handleSubscriberFilterChange(!isSubscriber)
                                }
                                isChecked={isSubscriber === "true"}
                                colorScheme="teal"
                            >
                                Subscriber
                            </Checkbox>

                            <Checkbox
                                onChange={() =>
                                    handleSubscriberFilterChange(!isSubscriber)
                                }
                                isChecked={isSubscriber === "false"}
                                colorScheme="teal"
                            >
                                All
                            </Checkbox>
                        </Stack>
                    </Box>
                </VStack>
            </Collapse>
           
            {isFetched && !data?.users.length && (
                <Box
                    display={"flex"}
                    flexDir={"row"}
                    justifyContent={"center"}
                    py={5}
                    width={"100%"}
                >
                    <Text>Users not found</Text>
                </Box>
            )}
            {isLoading && <Skeleton minH={400}  mt={5} width={"100%"} />}
            {!!data?.users.length && <Stack spacing={3}>
            <Stack spacing={2} direction={'row'} mt={5} wrap={"wrap"}>
                {data?.users.map((user) => (
                    <UserCard user={user} key={user.id} />
                ))}
            </Stack>
            <Paginator
                        currentPage={page}
                        totalPages={data?.totalPages || 0}
                        goToPage={handleChangePage}
                    />
            </Stack>}
        </Box>
    )
}
