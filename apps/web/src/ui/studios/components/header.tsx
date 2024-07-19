import React, { useState } from "react"
import {
    Box,
    Button,
    Card,
    Checkbox,
    Drawer,
    DrawerBody,
    DrawerCloseButton,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    Heading,
    IconButton,
    Input,
    InputGroup,
    InputLeftElement,
    Stack,
    Text,
    useDisclosure,
} from "@chakra-ui/react"
import { BiFilter, BiSearch } from "react-icons/bi"

import Navbar from "~/components/Navbar"

export type Filters = {
    mealType: string[]
    dietType: string[]
    difficulty: string[]
}

type StudioHeaderProps = {
    onChangeSearch: (e: React.ChangeEvent<HTMLInputElement>) => void
    searchName: string
    onApplyFilters: (filters: Filters, fn: () => void) => void
    isLoading: boolean
}

export const StudioHeader: React.FC<StudioHeaderProps> = ({
    onChangeSearch,
    searchName,
    onApplyFilters,
    isLoading,
}) => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = React.useRef<HTMLButtonElement>(null)

    console.log({ isLoading}, 222)

    const [selectedFilters, setSelectedFilters] = useState({
        categories: [],
        subCategories: [],
    })

    const handleFilterChange = (category: string, value: string) => {
        setSelectedFilters((prevState) => {
            const newValues = prevState[category].includes(value)
                ? prevState[category].filter((item) => item !== value)
                : [...prevState[category], value]
            return { ...prevState, [category]: newValues }
        })
    }

    const handleApplyFilters = () => {
        // alert(`Selected Filters:\nMeal Type: ${selectedFilters.mealType.join(', ')}\nDiet Type: ${selectedFilters.dietType.join(', ')}\nDifficulty: ${selectedFilters.difficulty.join(', ')}`);
        onApplyFilters(selectedFilters, () => {
            onClose()
        })
    }

    return (
        <>
            <Card bg="#f4e5ce" height={{ base: 350, md: 300 }}>
                <Navbar />
                <Stack
                    alignSelf="center"
                    gap={5}
                    minW={{ base: "100%", md: 500 }}
                    px={{ base: 4, md: 0 }}
                >
                    <Heading as="h2" size="2xl" color="#dda044">
                        Studios
                    </Heading>
                    <Box w="100%" display="flex" alignItems="center">
                        <InputGroup mr={4} size="lg" width="100%">
                            <Input
                                bg="white"
                                pr="4.5rem"
                                borderWidth={3}
                                placeholder="Search..."
                                onChange={onChangeSearch}
                                value={searchName}
                            />
                            <InputLeftElement>
                                <IconButton
                                    my={5}
                                    aria-label="Search"
                                    disabled
                                    size="sm"
                                    icon={<BiSearch />}
                                    variant="ghost"
                                    color="whitesmoke"
                                    bg="#dda044"
                                    _hover={{
                                        bg: "#dda065",
                                    }}
                                />
                            </InputLeftElement>
                        </InputGroup>
                        <Button
                            ref={btnRef}
                            leftIcon={<BiFilter />}
                            onClick={onOpen}
                            size="md"
                            bg="#dda044"
                            color="white"
                            _hover={{
                                bg: "#dda065",
                            }}
                        >
                            Filters
                        </Button>
                    </Box>
                </Stack>
            </Card>

            <Drawer
                isOpen={isOpen}
                placement="right"
                onClose={onClose}
                finalFocusRef={btnRef}
            >
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton color="#dda044" />
                    <DrawerHeader
                        color="#dda044"
                        fontSize="lg"
                        fontWeight="bold"
                    >
                        Filters
                    </DrawerHeader>

                    <DrawerBody>
                        <Stack spacing={5}>
                            <Box>
                                <Text
                                    fontSize="md"
                                    color="#dda044"
                                    fontWeight="semibold"
                                    mb={2}
                                >
                                    Category
                                </Text>
                                <Stack direction="column" spacing={2}>
                                    {[
                                        "Fitness",
                                        "Wellness",
                                    ].map((type) => (
                                        <Checkbox
                                            key={type}
                                            size="md"
                                            colorScheme="orange"
                                            onChange={() =>
                                                handleFilterChange(
                                                    "categories",
                                                    type,
                                                )
                                            }
                                            isChecked={selectedFilters.categories.includes(
                                                type,
                                            )}
                                        >
                                            {type}
                                        </Checkbox>
                                    ))}
                                </Stack>
                            </Box>
                            <Box>
                                <Text
                                    color="#dda044"
                                    fontSize="md"
                                    fontWeight="semibold"
                                    mb={2}
                                >
                                    Activity Type
                                </Text>
                                <Stack direction="column" spacing={2}>
                                    {[
                                        "Cardiovasular",
                                        "Muscle traning",
                                        "Stress Relief",
                                        "Therapy",
                                        "Endurance",
                                        "Mobility"
                                    ].map((type) => (
                                        <Checkbox
                                            key={type}
                                            size="md"
                                            colorScheme="orange"
                                            onChange={() =>
                                                handleFilterChange(
                                                    "subCategories",
                                                    type,
                                                )
                                            }
                                            isChecked={selectedFilters.subCategories.includes(
                                                type,
                                            )}
                                        >
                                            {type}
                                        </Checkbox>
                                    ))}
                                </Stack>
                            </Box>
                        </Stack>
                    </DrawerBody>

                    <DrawerFooter>
                        <Button variant="outline" mr={3} onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            bg="#dda044"
                            isLoading={isLoading}
                            color="white"
                            _hover={{
                                bg: "#dda065",
                            }}
                            onClick={handleApplyFilters}
                        >
                            Apply Filters
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    )
}

