import { Box, Button, Container, Flex, Heading, Image, Link, Stack, Text, keyframes } from "@chakra-ui/react";

// Define keyframes for the animation
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`;


export default function Hero() {
    return (
      <>
        <Container maxW="container.xl" py={8} alignSelf={'center'}>
          <Flex direction={{ base: "column", lg: "row" }}  justify={{ base: 'flex-start', lg: "space-between"}} >
            <Box
              display={{ base: "block", lg: 'none' }}
            
              textAlign="center"
              mb={1}
              animation={`${fadeIn} 1s ease-in-out`}
            >
              <Image
                src={'/app.png'}
                objectFit={'contain'}
               boxSize={{ base: "200px", md: "300px", lg: "600px" }}
                alt="Hero Image"
                mb={4}
                mx="auto"
                animation={`${fadeIn} 1s ease-in-out`}
              />
            </Box>
            <Box w={{ base: "100%", lg: "50%" }} alignSelf={'center'} maxW="2xl" mb={{ base: 4, lg: 0 }}> 
            <Heading
                as="h1"
                size="2xl"
                fontWeight="bold"
                lineHeight="tight"
                color="#40780b"
                animation={`${fadeIn} 1s ease-in-out`}
              
            >
               Live well, Feel Great
              </Heading>
              <Text
                py={2}  // Reduce padding here
                fontSize="xl"
                lineHeight="normal"
                textColor="gray.500"
                _dark={{ textColor: "gray.300" }}
                animation={`${fadeIn} 1s ease-in-out`}
              >
                Nextly is a free landing page & marketing website template for
                startups and indie projects. It’s built with Next.js & TailwindCSS.
                And it’s completely open-source.
              </Text>
              <Stack direction={{ base: "column", sm: "row" }} spacing={3} animation={`${fadeIn} 1s ease-in-out`}>
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
                  color="#f4e5ce"
                >
                  Join Waiting list
                </Button>
              </Stack>
            </Box>
            <Box
              display={{ base: "none", lg: "block" }}
              w="50%"
              textAlign="center"
            
              animation={`${fadeIn} 1s ease-in-out`}
            >
              <Image
                src={'/app.png'}
                objectFit={'contain'}
                boxSize={{ base: "200px", md: "300px", lg: "500px" }}
                alt="Hero Image"
                mx="auto"
                animation={`${fadeIn} 1s ease-in-out`}
              />
            </Box>
          </Flex>
        </Container>
      </>
    );
  }
