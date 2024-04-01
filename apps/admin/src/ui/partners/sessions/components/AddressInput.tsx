
import React, { useEffect, useState } from "react"
import {
    Box,
    Button,
    Divider,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    InputRightElement,
    List,
    ListItem,
    Skeleton,
    Stack,
    Text,
} from "@chakra-ui/react"
import { useDebouncedCallback } from "use-debounce"

import { api } from "~/utils/api"
import AddressCard from "../../components/AddressCard"


export type Address = {
    id: string;
    name: string;
    lat: string;
    building: string
    partnerId: string,
    floor: string;
    lng: string;
    city: string;
    country: string;
    street?: string;
}


interface SearchAddressInputProps {
    onSelectAddress: (address: Address) => void,
    address?: Address,
    partnerId: string
}

const SearchAddressInput: React.FC<SearchAddressInputProps> = ({
    onSelectAddress,
    address,
    partnerId
}) => {
    const { data: addresses, isLoading, refetch } = api.address.list.useQuery({ id: partnerId })

    const [searchTerm, setSearchTerm] = useState<string>("")
    const [selectedAddress, setSelectedAddress] = useState(address)


    useEffect(() => {
      if(address){
        setSelectedAddress(address)
      }else{
        setSelectedAddress(null)
      }
    }, [address])



    const handleSearch = useDebouncedCallback((query: string) => {
        setSearchTerm(query)
        refetch({
            id: partnerId,
            filter: {
               search : query,
            },
        })
        // setSearchResults(filteredResults);
    })

    const handleSelectAddress = (address: Address) => {
        setSearchTerm("")
        onSelectAddress(address)
        setSelectedAddress(address)
    }


    if(selectedAddress){
        return (
          <Box py={2}>
             <AddressCard isViewOnly  address={selectedAddress} onRemove={() => setSelectedAddress(null)} />
          </Box>
        )
    }

    return (
        <>
           <FormControl>
           <FormLabel fontSize={"sm"}>Instructor</FormLabel>
            <InputGroup>
                <Input
                    type="text"
                    placeholder="Search address by name, city"
                    value={searchTerm}
                    onChange={(e) => {
                        handleSearch(e.target.value)
                    }}
                />
                <InputRightElement width="4.5rem">
                    {/* You can add a search icon here if needed */}
                </InputRightElement>
            </InputGroup>
           </FormControl>
            {searchTerm && (
               <Skeleton isLoaded={!isLoading}>
                   <List mt={2} boxShadow={"sm"}>
                    {addresses ? (
                        addresses.map((ad) => (
                            <ListItem
                                key={ad.id}
                                cursor="pointer"
                                py={2}
                                onClick={() =>
                                    handleSelectAddress(ad)
                                }
                            >
                         
                                   
                                    <Stack spacing={0}>
                                        <Text>
                                            {ad.name}
                                          
                                        </Text>
                                        <Text fontSize={'x-small'}>{ad.city}</Text>
                                    </Stack>
                                   
                             
                                <Divider />
                            </ListItem>
                        ))
                    ) : (
                        <ListItem>
                            <Stack>
                            <Text>No Address found</Text>
                            <Text fontSize={'x-small'}>Address neeeded to create session</Text>
                            <Text fontSize={'x-small'}>Go to partner, address session to create address</Text>
                           
                            </Stack>
                           
                        </ListItem>
                    )}
                </List>
               </Skeleton>
            )}
        </>
    )
}

export { SearchAddressInput }
