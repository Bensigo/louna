import {
    Avatar,
    Badge,
    Box,
    HStack,
    Table,
    Tbody,
    Td,
    Th,
    Tr,
} from "@chakra-ui/react"

import { type RouterOutputs } from "@solu/admin-api"

type User = RouterOutputs["user"]["get"]

const UserInfo: React.FC<{ user: User }> = ({ user }) => {
    if (!user)return null;
    return (
        <Box p={6} overflow="hidden">
            <Avatar
                size={"xl"}
                src={user?.imageUrl || ''}
                name={`${user?.firstname} ${user?.lastname}`}
            />
            <Table variant="simple" mt={6}>
                <Tbody>
                    <Tr>
                        <Th p={2} fontWeight="normal" width="30%">Name</Th>
                        <Td p={2}>{`${user?.firstname} ${user?.lastname}`}</Td>
                    </Tr>
                    <Tr>
                        <Th p={2} fontWeight="normal">Age</Th>
                        <Td p={2}><b>{user?.userPref?.age}</b></Td>
                    </Tr>
                    <Tr>
                        <Th p={2} fontWeight="normal">Diet</Th>
                        <Td p={2}><b>{user?.userPref?.diet}</b></Td>
                    </Tr>
                    <Tr>
                        <Th p={2} fontWeight="normal">Height</Th>
                        <Td p={2}><b>{user?.userPref?.height}cm</b></Td>
                    </Tr>
                    <Tr>
                        <Th p={2} fontWeight="normal">Weight</Th>
                        <Td p={2}><b>{user?.userPref?.weight}kg</b></Td>
                    </Tr>
                    <Tr>
                        <Th p={2} fontWeight="normal">Fitness Goal</Th>
                        <Td p={2}>
                            <HStack spacing={2}>
                                {user.userPref?.fitnesGoal.map((goal, i) => (
                                    <Badge
                                        rounded={5}
                                        key={i}
                                        variant="solid"
                                        colorScheme="blue"
                                    >
                                        {goal}
                                    </Badge>
                                ))}
                            </HStack>
                        </Td>
                    </Tr>
                    <Tr>
                        <Th p={2} fontWeight="normal">Fitness Difficulty</Th>
                        <Td p={2}>
                            <HStack spacing={2}>
                                {user.userPref?.fitnessDiffculty.map((difficulty, i) => (
                                    <Badge
                                        rounded={5}
                                        key={i}
                                        variant="solid"
                                        colorScheme="purple"
                                    >
                                        {difficulty}
                                    </Badge>
                                ))}
                            </HStack>
                        </Td>
                    </Tr>
                    <Tr>
                        <Th p={2} fontWeight="normal">Health Conditions</Th>
                        <Td p={2}>
                            <HStack spacing={2}>
                                {user.userPref?.healthConditions.map((condition, i) => (
                                    <Badge
                                        key={i}
                                        variant="solid"
                                        rounded={5}
                                        colorScheme="red"
                                    >
                                        {condition}
                                    </Badge>
                                ))}
                            </HStack>
                        </Td>
                    </Tr>
                </Tbody>
            </Table>
        </Box>
    )
}

export { UserInfo }
