import React, { useEffect, useState } from "react"
import {
    Badge,
    Box,
    Divider,
    FormControl,
    FormLabel,
    HStack,
    IconButton,
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
import { buildFileUrlV2 } from "~/utils/getFileurl"
import CustomImage from "~/shared/CustomImage"
import { type InstructorType } from "~/ui/expert/schema/instructor"
import {  BiTrash } from "react-icons/bi"

interface SearchInstructorInputProps {
    onSelectInstructor: (instructor: InstructorType) => void,
    instructor?: any
}

const SearchInstructorInput: React.FC<SearchInstructorInputProps> = ({
    onSelectInstructor,
    instructor
}) => {
    const { data, isLoading, refetch } = api.instructor.list.useQuery({
        filter: {},
    })

    const { instructors } = data || {}
    const [searchTerm, setSearchTerm] = useState<string>("")
    const [selectedInstructor, setSelectedInstructor] = useState(instructor)


    useEffect(() => {
      if(instructor){
        setSelectedInstructor(instructor)
      }else{
        setSelectedInstructor(null)
      }
    }, [instructor])



    const handleSearch = useDebouncedCallback((query: string) => {
        setSearchTerm(query)
        refetch({
            filter: {
                searchName: query,
            },
        })
        // setSearchResults(filteredResults);
    })

    const handleSelectInstructor = (instructor: InstructorType) => {
        setSearchTerm("")
        onSelectInstructor(instructor)
        setSelectedInstructor(instructor)
    }


    if(selectedInstructor){
        return (
          <HStack spacing={3}>
          <Box height={50} width={50}>
              <CustomImage
                  src={buildFileUrlV2(
                      `${selectedInstructor.repo}/${selectedInstructor.imageKey}`,
                  )}
                  alt={`${selectedInstructor.firstname} ${selectedInstructor.lastname}`}
                  height={"100%"}
                  width={"100%"}
              />
          </Box>
          <Stack spacing={0}>
              <Text>
                  {selectedInstructor.firstname}{" "}
                  {selectedInstructor.lastname}
              </Text>
              <Text>{selectedInstructor.title}</Text>
          </Stack>
          <Badge colorScheme="orange">
              {selectedInstructor.category}{" "}
          </Badge>
          <IconButton size={'sm'} colorScheme="red" onClick={() => {
              setSelectedInstructor(null)
            } } icon={<BiTrash />} aria-label={"remove"}></IconButton>
      </HStack>
        )
    }

    return (
        <>
           <FormControl>
           <FormLabel fontSize={"sm"}>Instructor</FormLabel>
            <InputGroup>
                <Input
                    type="text"
                    placeholder="Search for an instructor"
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
                    {instructors ? (
                        instructors.map((instructor) => (
                            <ListItem
                                key={instructor.id}
                                cursor="pointer"
                                py={2}
                                onClick={() =>
                                    handleSelectInstructor(instructor)
                                }
                            >
                                <HStack spacing={3}>
                                    <Box height={50} width={50}>
                                        <CustomImage
                                            src={buildFileUrlV2(
                                                `${instructor.repo}/${instructor.imageKey}`,
                                            )}
                                            alt={`${instructor.firstname} ${instructor.lastname}`}
                                            height={"100%"}
                                            width={"100%"}
                                        />
                                    </Box>
                                    <Stack spacing={0}>
                                        <Text>
                                            {instructor.firstname}{" "}
                                            {instructor.lastname}
                                        </Text>
                                        <Text>{instructor.title}</Text>
                                    </Stack>
                                    <Badge colorScheme="orange">
                                        {instructor.category}{" "}
                                    </Badge>
                                </HStack>
                                <Divider />
                            </ListItem>
                        ))
                    ) : (
                        <ListItem>
                            <Text>No Instructor found</Text>
                        </ListItem>
                    )}
                </List>
               </Skeleton>
            )}
        </>
    )
}

export default SearchInstructorInput
