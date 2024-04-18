import React, { useEffect, useState } from "react";
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
    Tag,
    Text,
    useDisclosure,
    VStack,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    ModalFooter,
    useToast,
} from "@chakra-ui/react";
import { Calendar, dateFnsLocalizer, Views,type EventWrapperProps } from "react-big-calendar";
import { BiArrowBack, BiFilter, BiPlus, BiSearch } from "react-icons/bi";

import "react-big-calendar/lib/css/react-big-calendar.css";

import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import format from "date-fns/format";
import getDay from "date-fns/getDay";
import enUS from "date-fns/locale/en-US";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import { useDebouncedCallback } from "use-debounce";

import { api } from "~/utils/api";
import { type Category } from "../Wrapper";
import EventTable from "./components/EventTable";
import { Paginator } from "~/shared/Paginator";



type Status = 'Published' | 'Unpublished' | 'All'

const locales = {
    "en-US": enUS,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

const Event = ({ event, onClick }: { event: any; onClick: () => void }) => {
    return (
        <Box  onClick={onClick} cursor="pointer" border={"none"}>
            <HStack spacing={2} alignItems={"center"}>
                <Text fontWeight={"bold"} fontSize={13}>
                    {event.title}
                </Text>
                <Tag colorScheme="green" px={2}>
                    {event.category}
                </Tag>
                <Tag colorScheme={event.isPublished ? "green" : "blue"} px={2}>
                    {event.isPublished ? "Live" : "Draft"}
                </Tag>
            </HStack>
            {/* <Stack spacing={2} direction="row" flexWrap="wrap">
                {event.subCategories?.map((category) => (
                    <Tag key={category} size="sm" variant="solid" colorScheme={"green"} cursor="pointer">
                        {category}
                    </Tag>
                ))}
            </Stack> */}
        </Box>
    );
};

const SessionModal = ({ isOpen, onClose, event }: { isOpen: boolean; onClose: () => void; event: any }) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
           {event &&  <ModalContent>
                <ModalHeader>{event.title}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <Box>
                        <Text fontWeight={"bold"}>Category: </Text>
                        <Text>{event.category}</Text>
                    </Box>
                    <Box>
                        <Text fontWeight={"bold"}>Subcategories: </Text>
                        <Stack direction="row" flexWrap="wrap">
                            {event.subCategories?.map((subcategory: string) => (
                                <Tag key={subcategory} size="sm" variant="solid" colorScheme={"green"} cursor="pointer">
                                    {subcategory}
                                </Tag>
                            ))}
                        </Stack>
                    </Box>
                    <Box>
                        <Text fontWeight={"bold"}>Status: </Text>
                        <Tag colorScheme={event.isPublished ? "green" : "blue"}>{event.isPublished ? "Live" : "Draft"}</Tag>
                    </Box>
                    {/* Add more session details here */}
                </ModalBody>
                <ModalFooter>
                    <Button colorScheme="blue" mr={3} onClick={onClose}>
                        Close
                    </Button>
                </ModalFooter>
            </ModalContent>}
        </Modal>
    );
};

const ListSessionWrapper = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const params = useSearchParams();
    const pathname = usePathname();

    const { replace, query } = useRouter();
    const { id } = query 

    const PAGE_LIMIT = 10;
    const page = parseInt(params.get("page") || "1");
    const search = params.get("search");
    const publishStatus = params.get("status") as Status;
    const category = params.get('category') as Category

    const [searchTerm, setSearchTerm] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<Category>(category);
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);
    const [status, setStatus] = useState<Status>(publishStatus)
    const [events, setEvents] = useState<any[]>([]);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [selectedEvent, setSelectedEvent] = useState<any>(null);

    const { data, isLoading, refetch } = api.session.list.useQuery({
        page,
        limit: PAGE_LIMIT,
        filter: {
            partnerId: id,
            ...(search ? { search } : {}),
            ...(status ? {  status } : { }),
            ...(categoryFilter ? { category: categoryFilter } : {}),
            // add for startdate and endDate
        },
    });

    const toast = useToast()
    const ctx = api.useUtils();
    const { mutate: deleteSessions , isLoading: isDeleting } = api.session.delete.useMutation()
    const { mutate: publish , isLoading: isPublishing } = api.session.publish.useMutation()


    useEffect(() => {
        if (data && data.sessions.length > 0) {
            const calendarData: Array<{
                startDate: Date;
                endDate: Date;
                title: string;
                category: "Fitness" | "Wellness";
                subCategories: string[];
                isPublish: boolean;
            }> = data.sessions.map((session) => ({
                startDate: new Date(session.startTime),
                endDate: new Date(session.endTime),
                category: session.category,
                title: session.title,
                subCategories: session.subCategories,
                isPublish: session.isPublish,
            }));
            setEvents(calendarData);
        }
    }, [data]);



    const handleSearch = useDebouncedCallback((term) => {
        const currentParams = new URLSearchParams(params);
        currentParams.set("page", page.toString());
        if (term) {
            currentParams.set("search", term);
        } else {
            currentParams.delete("search");
        }
        replace(`${pathname}?${currentParams.toString()}`);
    }, 300);

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value;
        setSearchTerm(term);
        handleSearch(term);
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        // Handle logic to fetch sessions for the selected date
    };

    const handleCategoryChange = (category: Category) => {
        const currentParams = new URLSearchParams(params);
        currentParams.set("page", page.toString());

        if (category) {
            setCategoryFilter(category);
            currentParams.set("category", category);
        } else {
            currentParams.delete("category");
        }

        replace(`${pathname}?${currentParams.toString()}`);
    };

    const handleStatusFilterChange = (value: Status) => {
        const currentParams = new URLSearchParams(params);
        setStatus(value);
        currentParams.set("status", value);
        replace(`${pathname}?${currentParams.toString()}`);
    };

    const goToCreateSession = () => {
        replace(`/dashboard/sessions/create`);
    };

    const handleChangePage = (page: number) => {
        const currenParams = new URLSearchParams(params)
        currenParams.set("page", page.toString())
        replace(`${pathname}?${currenParams.toString()}`)
    }

    const goBack = () => replace(`/dashboard/partners/${id}`)

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
               ctx.session.list.refetch()
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
        publish({
            ids ,
            partnerId: id as string
         }, {
             onSuccess: () => {
                 toast({
                     description: 'Published',
                     status: "success",
                     duration: 9000,
                     isClosable: true,
                 })
                ctx.session.list.refetch()
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
            <Button justifySelf={'flex-start'} my={4} onClick={goBack} leftIcon={<BiArrowBack />}>Back</Button>
            <Box display="flex" justifyContent={"space-between"}>
                <Text my={3} fontWeight={"bold"} fontSize={"x-large"}>
                    Sessions
                </Text>
                <Button onClick={goToCreateSession} leftIcon={<BiPlus />}>
                    Create Session
                </Button>
            </Box>
            <HStack spacing={3} alignItems={"center"} mb={5}>
                <InputGroup maxW={400}>
                    <Input placeholder="Search..." onChange={handleTextChange} value={searchTerm} />
                    <InputLeftElement>
                        <IconButton aria-label="Search" disabled icon={<BiSearch />} variant="ghost" colorScheme="gray" />
                    </InputLeftElement>
                </InputGroup>
                <Button leftIcon={<BiFilter />} onClick={() => setIsFiltersOpen(!isFiltersOpen)} size="md">
                    filters
                </Button>
            </HStack>
            <Collapse in={isFiltersOpen} animateOpacity>
                <VStack align="start" spacing={4}>
                    <Box>
                        <Text fontSize="md" fontWeight="semibold" mb={2}>
                            Status
                        </Text>
                        <Stack direction="row" spacing={4}>
                            <Checkbox onChange={() => handleStatusFilterChange("Published")} isChecked={status === 'Published' } colorScheme="teal">
                                Published
                            </Checkbox>
                            <Checkbox onChange={() => handleStatusFilterChange("Unpublished")} isChecked={status === "Unpublished"} colorScheme="teal">
                                Unpublished
                            </Checkbox>
                            <Checkbox onChange={() => handleStatusFilterChange("All")} isChecked={status === "All"} colorScheme="teal">
                                All
                            </Checkbox>
                        </Stack>
                    </Box>
                    <Box>
                        <Text fontSize="md" fontWeight="semibold" mb={2}>
                            Category
                        </Text>
                        <Stack direction="row" spacing={4}>
                            <Checkbox onChange={() => handleCategoryChange("Fitness")} isChecked={categoryFilter === "Fitness"} colorScheme="teal">
                                Fitness
                            </Checkbox>
                            <Checkbox onChange={() => handleCategoryChange("Wellness")} isChecked={categoryFilter === "Wellness"} colorScheme="teal">
                                Wellness
                            </Checkbox>
                            <Checkbox onChange={() => handleCategoryChange("All")} isChecked={categoryFilter === "All"} colorScheme="teal">
                                All
                            </Checkbox>
                        </Stack>
                    </Box>
                    <Box></Box>
                </VStack>
            </Collapse>
            <Box>
                <Skeleton isLoaded={!isLoading}>
                 <Stack spacing={4}>
                 <EventTable events={data?.sessions || []} onDelete={handleDelete} isDeleting={isDeleting} isPublishing={isPublishing} onPublish={handlePublish} >
                 {data && data?.totalPages > 0  && <Paginator
                        currentPage={page}
                        totalPages={data?.totalPages || 0}
                        goToPage={handleChangePage}
                    />}
                </EventTable>
                   
                 </Stack>
                </Skeleton>
            </Box>
            <SessionModal isOpen={isOpen} onClose={onClose} event={selectedEvent} />
        </Box>
    );
};

export { ListSessionWrapper };
