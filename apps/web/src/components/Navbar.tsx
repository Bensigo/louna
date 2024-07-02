import { Box, Button, Container, Flex, Image, Link as ChakraLink, useDisclosure } from "@chakra-ui/react";
import { IoIosMenu, IoIosClose } from 'react-icons/io';

export default function Navbar() {
  const { isOpen, onToggle } = useDisclosure({ isOpen: false });

  const navigation = ["Features", "About"];

  return (
    <Box w="100%">
      <Container maxW="container.xl" p={8}>
        <Flex alignItems="center">
          {/* Logo */}
          <Flex  alignItems="center" justifyContent={'space-between'} width={'100%'}>
            <ChakraLink href="/" display="flex" alignItems="center" fontWeight="medium" fontSize="2xl" >
              <Image src="/solu.png" alt="N" width="100px" height="100px" mr={2} />
            </ChakraLink>
            {/* Mobile Menu Button */}
            <Button  display={{ base: "flex", md: "none" }} onClick={onToggle} variant="ghost" colorScheme="gray">
              {isOpen ? <IoIosClose size={40}/> : <IoIosMenu size={40}/> }
            </Button>
          </Flex>

          {/* Desktop Menu */}
          <Flex display={{ base: "none", lg: "flex" }} alignItems="center">
            {navigation.map((menu, index) => (
              <ChakraLink key={index} href="/" mr={4} fontSize="lg" color="#dda044" _hover={{ color: "#dda043" }}>
                {menu}
              </ChakraLink>
            ))}
            <Button colorScheme="indigo" px={6} py={2} fontSize="md">
              Get Started
            </Button>
          </Flex>
        </Flex>

        {/* Mobile Menu */}
        {isOpen && (
          <Flex direction="column" mt={4} display={{ base: "flex", lg: "none" }}>
            {navigation.map((item, index) => (
              <ChakraLink key={index} href="/" py={2} fontSize="lg" color="#dda044" _hover={{ color: "#dda043" }}>
                {item}
              </ChakraLink>
            ))}
            <Button colorScheme="indigo" mt={4} w="100%">
              Get Started
            </Button>
          </Flex>
        )}
      </Container>
    </Box>
  );
}
