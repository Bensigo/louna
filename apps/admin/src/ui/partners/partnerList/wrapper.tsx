import { Box, Image, Text, Button, Stack, Skeleton, VStack } from '@chakra-ui/react';
import React, { useState } from 'react';
import { api } from "~/utils/api";

interface Profile {

}

interface ProfileItemProps {
    firstName: string;
    lastName: string;
    title: string;
    businessType: string;
    imageUrl: string;
  refetch: () => void;
  // Other pagination-related props can be added here
}


const ProfileItem: React.FC<ProfileItemProps> = (props) => {
    return (
      <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={4} mb={4}>
        <Stack direction="row" justifyContent={"space-between"} spacing={4} align="center" width={'100%'}>
          <Stack spacing={5} direction={'row'}>
          <Image src={props.imageUrl} alt={`${props.firstName} ${props.lastName}`} boxSize="50px" borderRadius="full" />
          <Stack>
            <Text>{`${props.firstName} ${props.lastName}`}</Text>
            <Text>{props.title}</Text>
            <Text>{props.businessType}</Text>
          </Stack>
          </Stack>
          <Button colorScheme="teal" onClick={props.refetch} justifySelf={"flex-end"}>
            View
          </Button>
        </Stack>
       
      </Box>
    );
  };

const ProfilesList = ({ profiles, isLoading, refetch }) => {



    if(isLoading){
        return  <Skeleton height={100}></Skeleton>
    }


    const itemsPerPage = 5;
    const [currentPage, setCurrentPage] = useState(1);
  
    const totalPages = Math.ceil(profiles.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = profiles.slice(indexOfFirstItem, indexOfLastItem);



  
    const handlePagination = (page: number) => {
      setCurrentPage(page);
    };



    return (
        <>
    <VStack align="stretch" spacing={4}>
      {currentItems.map((profile, index) => (
        <ProfileItem key={index} firstName={profile.firstname} refetch={() => alert('View button clicked')} lastName={profile.lastname} title={''} businessType={profile?.partnerProfile?.title || ''} imageUrl={profile.imageUrl} />
      ))}
      <Box display={'flex'} alignSelf={"center"}>
        {Array.from({ length: totalPages }, (_, index) => (
          <Button
            key={index}
            size="sm"
            colorScheme={currentPage === index + 1 ? 'teal' : 'gray'}
            onClick={() => handlePagination(index + 1)}
          >
            {index + 1}
          </Button>
        ))}
      </Box>
    </VStack>
        </>
    );
}



export function PartnerListWrapper () {
    const { data, isLoading } = api.partners.list.useQuery({ })
    
    return (
        <Box>
            <ProfilesList profiles={data} isLoading={isLoading} refetch={() => {} } />
        </Box>
    )
}