import { Stack, Heading, Button, Box, Text } from "@chakra-ui/react"
import Link from "next/link"

const SoluAd = () => {
    return (
        <Box
            w="100%"
            h="200px"
            bg="#f4e5ce"
            borderRadius="15px"
            flexDir={{ base: 'column', lg: 'row'}}
            boxShadow="md"
            display={'flex'}
            alignItems={'center'}
            justifyContent={'space-between'}
            px={8}
            py={{ base: 4, lg: 2 }}
        >
            <Stack>
                <Heading as="h3" size="md" mb={2}    color="#40780b">
                    Get Personalize Health and wellness solution
                </Heading>
                <Text fontSize="md" mb={4}>
                    This is a description inside the card. It can contain any
                    content you want.
                </Text>
            </Stack>
            <Button
                as={Link}
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                px={8}
                py={4}
                fontSize="lg"
                fontWeight="medium"
                bg="#dda044"
                _hover={{ bg: "#dda042" }}
                color="#f4e5ce"
            >
                 Download Now
            </Button>
        </Box>
    )
}

export default SoluAd