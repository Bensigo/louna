import { Avatar, Badge, Box, Button, Card, HStack, Stack, Text } from "@chakra-ui/react";
import { type RouterOutputs } from "@solu/admin-api";
import { useRouter } from "next/router";
import React from "react";

type User = RouterOutputs['user']['get']

export const UserCard: React.FC<{user: User }>  = ({ user }) => {
    const router = useRouter()

    const gotToProfile = () => {
        router.push(`/dashboard/users/${user?.id}`)
    }
    if (!user)return null;
    return (
       <Card px={3} py={4} w={200} bg={'inherit'}>
            <Stack spacing={1}>
                <Avatar size="md"  name={user?.firstname} src={user?.imageUrl} />
                <Text fontSize={'sm'}>Name: {user.firstname} {user.lastname}</Text>
                <Text fontSize={'sm'}>Age: {user.userPref?.age}</Text>
                <Stack>
                {/* <Text fontSize={'sm'}>
                    Fitness goal: 
                </Text>            
                    <HStack wrap={'wrap'} >
                    {user.userPref?.fitnesGoal.map((goal, i) => (
                            <Badge  fontSize={'10px'} key={i} rounded="5px" variant='subtle' colorScheme='green'>
                                {goal}
                            </Badge> 
                        ))}
                    </HStack> */}
                </Stack>
              
            </Stack>
            <Button mt={3} colorScheme="green" onClick={gotToProfile} >View Profile</Button>
       </Card>
    )
}