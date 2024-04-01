import React, { useState } from "react"
import { usePathname } from "next/navigation"
import { useRouter } from "next/router"
import {
    Box,
    Button,
    Checkbox,
    HStack,
    IconButton,
    Stack,
    Table,
    TableContainer,
    Tag,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react"
import { BiArchiveOut, BiEdit, BiShow, BiTrash } from "react-icons/bi"
import { type Partner } from "~/ui/sessions/components/partnerInput"
import CustomImage from "~/shared/CustomImage"
import { buildFileUrlV2 } from "~/utils/getFileurl"
import { tags } from "~/ui/recipes/components/EditRecipeForm"

interface Event {
    id: string
    startTime: Date
    endTime: Date
    title: string
    category: string
    partner: Partner
    tags: string[]
    isPublish: boolean
    createdAt: Date
}

interface Props {
    events: Event[]
    onDelete: (ids: string[]) => void
    isDeleting: boolean
    onPublish: (ids: string[]) => void
    isPublishing: boolean
}

const EventTable: React.FC<Props> = ({ events, onDelete, children, isDeleting , onPublish , isPublishing }) => {
    const [selectedEvents, setSelectedEvents] = useState<string[]>([])
    const [isRowSelected, setIsRowSelected] = useState(false)
    const { replace } = useRouter()
    const pathname = usePathname()

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        }).format(date)
    }

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        })
    }

    const toggleEventSelection = (eventId: string) => {
        const isSelected = selectedEvents.includes(eventId)
        if (isSelected) {
            setSelectedEvents(selectedEvents.filter((id) => id !== eventId))
        } else {
            setSelectedEvents([...selectedEvents, eventId])
        }
    }

    const isEventSelected = (eventId: string) => {
        return selectedEvents.includes(eventId)
    }

    const handleDeleteSelected = () => {
        onDelete(selectedEvents)
        setSelectedEvents([])
    }

    const handleViewEvent = (event: Event) => {
        if (!isRowSelected) {
            replace(`/dashboard/sessions/${event.id}`)
        }
    }

    const handleRowClick = (event: Event) => {
        setIsRowSelected(true)
        toggleEventSelection(event.id)
       
    }

    const handlePublishSelected = () => {
        onPublish(selectedEvents)
        setSelectedEvents([]) 
    }

    return (
        <Box boxShadow={"sm"} borderRadius="lg" overflow="hidden">
            <TableContainer>
                <Table variant="simple">
                    <Thead>
                        <Tr>
                            <Th>Select</Th>
                            <Th>Partner profile</Th>
                            <Th>Event</Th>
                            <Th>Date and Time </Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {events.map((event, index) => (
                            <Tr key={index}>
                                <Td>
                                    <Checkbox
                                        isChecked={isEventSelected(event.id)}
                                        onChange={() => handleRowClick(event)}
                                    />
                                </Td>

                                   
                                   
                                    <Td>
                                        <HStack>
                                            <CustomImage alt="" src={buildFileUrlV2(`${event.partner.images[0]?.repo}/${event.partner.images[0]?.key}`)} height={30} width={30}/>
                                        <Text>{event.partner.name}</Text>
                                        </HStack>
                                      
                                    </Td>
                                    <Td>
                                        <Stack spacing={1} overflowX={"scroll"}>
                                            <HStack>
                                            <Text
                                                wordBreak={"break-word"}
                                                fontSize="smaller"
                                                fontWeight="bold"
                                                mb={2}
                                            >
                                                {event.title}
                                            </Text>
                                            <Tag
                                                    fontSize={10}  
                                                    colorScheme={
                                                        event.isPublish
                                                            ? "green"
                                                            : "red"
                                                    }
                                                >
                                                    {event.isPublish
                                                        ? "Published"
                                                        : "Draft"}
                                                </Tag>
                                            </HStack>
                                            <HStack
                                                spacing={1}
                                                alignItems={"center"}
                                            >
                                                <Text fontSize={"sm"}>
                                                    Category: {event.category}
                                                </Text>
                                             
                                            </HStack>
                                            <Box mt={2}>
                                                {event.tags.slice(0,3).map(
                                                    (tag, index) => (
                                                        <Tag
                                                            size={"sm"}
                                                            fontWeight={"bold"}
                                                            fontSize={"x-small"}
                                                            key={index}
                                                            variant="subtle"
                                                            colorScheme="blue"
                                                            cursor="pointer"
                                                            mr={2}
                                                        >
                                                            {tag} 
                                                        </Tag>
                                                    ),
                                                )}
                                                {tags.length > 4 && "More..."}
                                            </Box>
                                        </Stack>
                                    </Td>
                                    <Td>
                                       <Text>
                                       {formatDate(event.startTime)}
                                       </Text>
                                       <Text> 
                                        {formatTime(event.startTime)} -{" "}
                                        {formatTime(event.endTime)}
                                        </Text>
                                        </Td>
                                <Td>
                                    <IconButton
                                    aria-label="delete-session"
                                      icon={<BiShow />}
                                    onClick={() => handleViewEvent(event)}
                                    />
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>
            <HStack px={4} my={4} justifyContent={"space-between"}>
                <HStack>
                <Button
                    onClick={handleDeleteSelected}
                    leftIcon={<BiTrash />}
                    size="sm"
                    mt={2}
                    isDisabled={!selectedEvents.length}
                    isLoading={isDeleting}
                >
                    Delete Selected
                </Button>
                <Button
                
                    leftIcon={<BiArchiveOut />}
                    size="sm"
                    mt={2}
                    isDisabled={!selectedEvents.length}
                    isLoading={isPublishing}
                    onClick={handlePublishSelected}
                >
                    Publish Sessions
                </Button>
                </HStack>                                      
                <Box>{children}</Box>
            </HStack>
        </Box>
    )
}

export default EventTable
