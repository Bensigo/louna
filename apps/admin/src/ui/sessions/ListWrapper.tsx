import { InputGroup, useToast, Input, InputLeftElement, IconButton, Button, Collapse, VStack, Stack, Checkbox, Box, Text, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Skeleton, Tag, useDisclosure } from "@chakra-ui/react"
import { useSearchParams, usePathname } from "next/navigation"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { BiSearch, BiFilter, BiPlus } from "react-icons/bi"
import { useDebouncedCallback } from "use-debounce"
import { Paginator } from "~/shared/Paginator"
import EventTable from "../partners/sessions/components/EventTable"
import { api } from "~/utils/api"

type Status = 'Published' | 'Unpublished' | 'All'

export const ListSessionWrapper = () => {
    const params = useSearchParams()
    const { replace } = useRouter()
    const pathname = usePathname()

    const PAGE_LIMIT = 10
    const page = parseInt(params.get("page") || "1")
    const search = params.get("search")
    const publishStatus = params.get("publish") as Status



    const [searchTerm, setSearchTerm] = useState<string>("")


    const [isFiltersOpen, setIsFiltersOpen] = useState(false)

    const [status, setStatus] = useState<Status>(publishStatus)
    const { isOpen, onOpen, onClose } = useDisclosure();

    const { data, isLoading, refetch } = api.session.list.useQuery({
        page,
        limit: PAGE_LIMIT,
        filter: {
            ...(search ? { search } : {}),
            ...(status ? {  status } : { })
            // add for startdate and endDate
        },
    });



   

    const toast = useToast()
    const ctx = api.useUtils();
    const { mutate: deleteSessions , isLoading: isDeleting } = api.session.delete.useMutation()
    const { mutate: publishSessions , isLoading: isPublishing } = api.session.publish.useMutation()


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

    const handlePublishedChange = (type:  Status) => {
        const currentParams = new URLSearchParams(params)
        currentParams.set("publish", type)
        replace(`${pathname}?${currentParams.toString()}`)
    }

    const handleChangePage = (page: number) => {
        const currenParams = new URLSearchParams(params)
        currenParams.set("page", page.toString())
        replace(`${pathname}?${currenParams.toString()}`)
    }


 
   
    const handleDelete = (ids: string[]) => {
        deleteSessions({
           ids 
        }, {
            onSuccess: () => {
                toast({
                    title: "Deleted",
                    description: 'Session Deleted',
                    status: "success",
                    duration: 9000,
                    isClosable: true,
                })
               ctx.session.list.invalidate()
            },
            onError: (err) => {
                
                toast({
                    title: "Error",
                    description: err.message,
                    status: "error",
                    duration: 9000,
                    isClosable: true,
                })
            }
        });
    }

    const handlePublish = (ids: string[]) => {
        publishSessions({
            ids,
         }, {
             onSuccess: () => {
                 toast({
                     description: 'Published',
                     status: "success",
                     duration: 9000,
                     isClosable: true,
                 })
                ctx.session.list.invalidate()
             },
             onError: (err) => {
                 
                 toast({
                     title: "Error",
                     description: err.message,
                     status: "error",
                     duration: 9000,
                     isClosable: true,
                 })
             }
         });
    }





    return (
        <Box>
             <Text my={3} fontWeight={'bold'} fontSize={'x-large'}>Session</Text>
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
                    Create Session
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
                                onChange={() => handlePublishedChange("Published")}
                                isChecked={publishStatus === "Published"}
                                colorScheme="teal"
                            >
                                Publish
                            </Checkbox>
                            <Checkbox
                                onChange={() =>
                                    handlePublishedChange("Unpublished")
                                }
                                isChecked={publishStatus === "Unpublished"}
                                colorScheme="teal"
                            >
                                Unpublish
                            </Checkbox>
                            <Checkbox
                                onChange={() => handlePublishedChange("all")}
                                isChecked={publishStatus === "All"}
                                colorScheme="teal"
                            >
                                All
                            </Checkbox>
                        </Stack>
                    </Box>


                 
                </VStack>
            </Collapse>
            <Box>
                <Skeleton isLoaded={!isLoading}>
                 <Stack spacing={4}>
                 {data && data?.totalPages > 0  && <EventTable events={data?.sessions} onDelete={handleDelete} isDeleting={isDeleting} isPublishing={isPublishing} onPublish={handlePublish} >
                  <Paginator
                        currentPage={page}
                        totalPages={data?.totalPages || 0}
                        goToPage={handleChangePage}
                    />
                </EventTable>}
                   
                 </Stack>
                </Skeleton>
            </Box>
        </Box>
      
    )
}