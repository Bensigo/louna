


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
    IconButton,
    Skeleton,
    Stack,
    Tag,
    Text,
} from "@chakra-ui/react"
import { useDebouncedCallback } from "use-debounce"

import { api } from "~/utils/api"
import CustomImage from "~/shared/CustomImage"
import { buildFileUrlV2 } from "~/utils/getFileurl"
import { BiTrash } from "react-icons/bi"


export type Partner = {
    id: string;
    name: string;
    partnerId: string
    bio: string;
    images: { key: string, repo: string }[]
    category: 'Fitness' | 'Wellness'
}


interface SearchPartnerInputProps {
    onSelectPartner: (partner: Partner) => void,
    partner?: Partner,
    
}

const SearchPartnerInput: React.FC<SearchPartnerInputProps> = ({
    onSelectPartner,
    partner,

}) => {
    const { data, isLoading, refetch } = api.partner.list.useQuery( { filter: {}})

    const [searchTerm, setSearchTerm] = useState<string>("")
    const [selectedPartner, setSelectedPartner] = useState<Partner | null>(partner)


    useEffect(() => {
      if(partner){
        setSelectedPartner(partner)
      }else{
        setSelectedPartner(null)
      }
    }, [partner])



    const handleSearch = useDebouncedCallback((query: string) => {
        setSearchTerm(query)
        refetch({
            filter: {
               searchTerm : query,
            },
        })
        // setSearchResults(filteredResults);
    })

    const handleSelectPartner = (partner: Partner) => {
        setSearchTerm("")
        onSelectPartner(partner)
        setSelectedPartner(partner)
    }


    if(selectedPartner){
        return (
          <Box py={2}>
            <Stack  spacing={2} direction={'row'}>
              <CustomImage alt="partner" width={50} height={50} src={buildFileUrlV2(`${selectedPartner.images[0]?.repo}/${selectedPartner.images[0]?.key}`)}/>
              <Stack spacing={2}>
              <Text>{selectedPartner.name}</Text>
              <Tag>{selectedPartner.category}</Tag>

            </Stack>
            <IconButton
                                    aria-label="delete-session"
                                    color={'red'}
                                      icon={<BiTrash />}
                                    onClick={() => setSelectedPartner(null)}
                                    />
              </Stack>
          </Box>
        )
    }

    return (
        <>
           <FormControl>
           <FormLabel fontSize={"sm"}>partner search</FormLabel>
            <InputGroup>
                <Input
                    type="text"
                    placeholder="Search Partner by name"
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
                    {data &&  data.partners ? (
                        data.partners.map((partner) => (
                            <ListItem
                                key={partner.id}
                                cursor="pointer"
                                py={2}
                                onClick={() =>
                                    handleSelectPartner(partner)
                                }
                            >
                         
                                   
                                    <Stack spacing={0}>
                                        <Text>
                                            {partner.name}
                                          
                                        </Text>
                                        <Text fontSize={'x-small'}>{partner.category}</Text>
                                    </Stack>
                                   
                             
                                <Divider />
                            </ListItem>
                        ))
                    ) : (
                        <ListItem>
                            <Stack>
                            <Text>No Partner found</Text>
                            <Text fontSize={'x-small'}>Parner neeeded to create session</Text>
                            </Stack>
                           
                        </ListItem>
                    )}
                </List>
               </Skeleton>
            )}
        </>
    )
}

export { SearchPartnerInput }
