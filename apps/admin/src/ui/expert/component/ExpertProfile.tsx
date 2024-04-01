import {
    Badge,
    Box,
    Button,
    Divider,
    Heading,
    HStack,
    Skeleton,
    Stack,
    Text,
} from "@chakra-ui/react"
import { BiCalendar, BiPencil } from "react-icons/bi"

import { api } from "~/utils/api"
import { buildFileUrlV2 } from "~/utils/getFileurl"
import CustomImage from "~/shared/CustomImage"
import Link from "next/link"
import { usePathname } from "next/navigation"

type ExpertProfileType = {
    profile: any
    isLoading: boolean
}

const ExpertProfile: React.FC<ExpertProfileType> = ({ profile, isLoading }) => {
    const pathname = usePathname()


    return (
        <>
        
            <Skeleton isLoaded={!isLoading}>
              
                {profile && (
                    <>
                        <Box
                            width={"100%"}
                            display={"flex"}
                            justifyContent={"flex-end"}
                        >
                            <Button
                                borderWidth={2}
                                variant={"outline"}
                                href={`${pathname}/edit`}
                                as={Link}
                                leftIcon={<BiPencil />}
                            >
                                Edit{" "}
                            </Button>
                        </Box>
                        <HStack my={4} spacing={5} alignItems={"flex-start"}>
                            <Box width={200} height={200}>
                                <CustomImage
                                    alt={`${profile.firstname}-${profile.lastname}}`}
                                    src={buildFileUrlV2(
                                        `${profile.repo}/${profile.imageKey}`,
                                    )}
                                    height={"100%"}
                                    width={"100%"}
                                />
                            </Box>
                            <Stack spacing={3}>
                                <HStack spacing={1}>
                                    <Heading fontSize={"x-large"}>
                                        {profile.firstname} {profile.lastname}
                                    </Heading>
                                    <Badge
                                        colorScheme={
                                            profile.isActive ? "green" : "red"
                                        }
                                    >
                                        {profile.isActive
                                            ? "Active"
                                            : "inactive"}
                                    </Badge>
                                </HStack>
                                <HStack spacing={1}>
                                    <Text>Category:</Text>
                                    <Badge colorScheme="orange">
                                        {profile.category}
                                    </Badge>
                                </HStack>
                                <Text>{profile.title}</Text>
                           
                                 {profile.calenderUrl &&   <Button
                                        as={Link}
                                        target="_blank"
                                        href={profile.calenderUrl}
                                        isDisabled={!profile.calenderUrl}
                                        leftIcon={<BiCalendar />}
                                        colorScheme="orange"
                                    >
                                        Book a meeting
                                    </Button>}
                              
                            </Stack>
                        </HStack>
                        <Divider />
                        <HStack
                            mt={3}
                            align="center"
                            flexFlow={"wrap"}
                            spacing={1}
                        >
                            {profile.subCategories.map((category, index) => (
                                <Badge
                                    key={index}
                                    colorScheme="green"
                                    borderRadius="md"
                                    fontSize={"x-small"}
                                    px={2}
                                    py={1}
                                >
                                    {category}
                                </Badge>
                            ))}
                        </HStack>
                        <Text fontSize={"larger"}>Bio</Text>
                        <Text color={"gray.700"}>{profile.bio}</Text>
                    </>
                )}
            </Skeleton>
        </>
    )
}
export { ExpertProfile }
