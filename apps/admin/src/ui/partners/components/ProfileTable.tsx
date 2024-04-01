import { Table, Thead, Tr, Th, Tbody, Td, IconButton, Text, Box, Image } from "@chakra-ui/react";
import { BiShow } from "react-icons/bi";


  
const ProfileTable = ({ profiles }) => {
    return (
      <Table variant="simple" borderRadius="md" overflow="hidden" mb={8}>
        <Thead color="black">
          <Tr>
            <Th>Image</Th>
            <Th>Name</Th>
            <Th>Role</Th>
            <Th>Id</Th>
            <Th>View</Th>
          </Tr>
        </Thead>
        <Tbody>
          {profiles.map((profile) => (
            <Tr key={profile.id}  borderWidth={10} borderRadius="md" height={20}>
              <Td>
                <Image
                  src={profile.imageUrl}
                  alt={`${profile.firstname} ${profile.lastname}`}
                  boxSize="30px"
                  borderRadius="full"
                />
              </Td>
              <Td>{`${profile.firstname} ${profile.lastname}`}</Td>
              <Td display={"flex"} align={"center"}>
                <Box
                  color="white"
                  bg="black"
                  borderRadius="full"
                  px={2}
                  py={0.5}
                >
                  <Text fontSize="xs">{profile.roles[0]}</Text>
                </Box>
              </Td>
              <Td>
                <Text fontSize="xs">{profile.id}</Text>
              </Td>
              <Td>
                <IconButton
                  icon={<BiShow />}
                  aria-label={"view-profile"}
                  bg="black"
                  color="white"
                  size="sm"
                ></IconButton>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    );
  };
  
  export default ProfileTable;