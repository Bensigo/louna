import { useRouter } from "next/router"
import {
    Box,
    Button,
    Flex,
    HStack,
    Skeleton,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Tag,
    Text,
} from "@chakra-ui/react"
import { BiArrowBack, BiCalendar, BiEdit, BiPlus } from "react-icons/bi"

import { api } from "~/utils/api"
import Carousel from "~/shared/Carousel"
import { Address } from "./components/Address"
import { usePathname } from "next/navigation"
import Link from "next/link"

const PartnerInfo = ({ id }: { id: string }) => {
    const { data: partner, isLoading } = api.partner.get.useQuery({ id })

    const { mutate: publish, isLoading: isUpdating } = api.partner.publish.useMutation()
    const pathname = usePathname()

    const publishPartner = () => {
        publish({
            id
        })
    }


    return (
        <Box>
          
            <HStack>
                <Skeleton isLoaded={!isLoading}>
                    <Text fontWeight={"bold"} fontSize={"larger"}>
                        {partner?.name}
                    </Text>
                </Skeleton>
                
                <Skeleton isLoaded={!isLoading}>
                    {partner && (
                        <Tag colorScheme="blue">{partner?.category}</Tag>
                    )}
                </Skeleton>
            </HStack>
            <Skeleton minH={300} isLoaded={!isLoading}>
                {partner && <Carousel slides={partner?.images} />}
            </Skeleton>
           
            <Skeleton isLoaded={!isLoading} minH={100}>
            <Text fontSize={"sm"} fontWeight={"bold"}>
                Amenites
            </Text>
            <HStack px={2} spacing={1} my={3}>
                {partner &&
                    partner?.amenities.map((amenity, index) => (
                        <Tag key={index} colorScheme="blue">
                            {amenity}
                        </Tag>
                    ))}
            </HStack>
            </Skeleton>
            <Skeleton my={2} minH={'100%'} isLoaded={!isLoading}>
                {partner && <Text fontSize={"md"}>{partner?.bio}</Text>}
            </Skeleton>
            {partner &&  <Button colorScheme="green" onClick={publishPartner} isLoading={isUpdating}>
                                        {partner?.isPublished
                                            ? "Unpublish"
                                            : "Publish"}
                                    </Button>}
            <Skeleton minH={200} isLoaded={!isLoading}>
                <Button leftIcon={<BiCalendar />}  as={Link} href={`${pathname}/sessions`}>View Sessions</Button>
            </Skeleton>

        </Box>
    )
}




const PartnerWrapper = () => {
    const { query, replace } = useRouter()
    const { id } = query as { id: string }
    const pathname = usePathname()


    const goBack = () => replace("/dashboard/partners")


    const goToEdit = () => replace(`${pathname}/edit`)
    const goToCreateSession = () => replace(`/dashboard/sessions/create`);

  

    return (
        <>
           <Flex justifyContent={'space-between'}>
           <Button onClick={goBack} leftIcon={<BiArrowBack />}>
                Back
            </Button>
           <HStack>

           <Button onClick={goToEdit} leftIcon={<BiEdit />}>
                Edit
            </Button>
            <Button leftIcon={<BiCalendar />}  as={Link} href={`${pathname}/sessions`}>View Sessions</Button>
            <Button onClick={goToCreateSession} leftIcon={<BiPlus />}>
                Create Session
            </Button>
           </HStack>
           </Flex>

            <Tabs mt={3} variant="soft-rounded" colorScheme="green" isLazy>
                <TabList>
                    <Tab>Info</Tab>
                    <Tab>Addresses</Tab>
                    
                </TabList>
                <TabPanels>
                    <TabPanel>
                        <PartnerInfo id={id} />
                    </TabPanel>
                    <TabPanel>  
                        <Address id={id} />  
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </>
    )
}

export { PartnerWrapper }
