import {
  Box,
  Button,
  Container,
  Flex,
  Image,
  Link as ChakraLink,
  useDisclosure,
} from "@chakra-ui/react";
import { IoIosMenu, IoIosClose } from "react-icons/io";
import { useRouter } from "next/router";

export default function Navbar() {
  const { isOpen, onToggle } = useDisclosure();
  const router = useRouter();
  const navigation = ["Recipes", "Studios", "Blog", "About"];

  return (
    <Box w="100%">
      <Container maxW="container.xl" p={4}>
        <Flex alignItems="center" justifyContent="space-between">
          {/* Logo */}
          <ChakraLink
            href="/"
            display="flex"
            alignItems="center"
            fontWeight="medium"
            fontSize="2xl"
          >
            <Image
              src="/solu.png"
              alt="Logo"
              width="100px"
              height="100px"
              mr={2}
            />
          </ChakraLink>

          {/* Mobile Menu Button */}
          <Button
            display={{ base: "flex", lg: "none" }}
            onClick={onToggle}
            variant="ghost"
            colorScheme="gray"
          >
            {isOpen ? <IoIosClose size={30} /> : <IoIosMenu size={30} />}
          </Button>

          {/* Desktop Menu */}
          <Flex display={{ base: "none", lg: "flex" }} alignItems="center">
            {navigation.map((nav, index) => {
              const isActive = router.pathname.startsWith(`/${nav.toLowerCase()}`);
              return (
                <ChakraLink
                  key={index}
                  href={`/${nav.toLowerCase()}`}
                  mr={4}
                  fontSize="lg"
                  color={isActive ? "#dda043" : "#dda044"}
                  _hover={{ color: "#dda043" }}
                  fontWeight={isActive ? "bold" : "normal"}
                >
                  {nav}
                </ChakraLink>
              );
            })}
          </Flex>
        </Flex>

        {/* Mobile Menu */}
        <Flex
          direction="column"
          mt={4}
          display={{ base: isOpen ? "flex" : "none", lg: "none" }}
          pb={4}
        >
          {navigation.map((nav, index) => {
            const isActive = router.pathname.startsWith(`/${nav.toLowerCase()}`);
            return (
              <ChakraLink
                key={index}
                href={`/${nav.toLowerCase()}`}
                py={2}
                fontSize="lg"
                color={isActive ? "#dda043" : "#dda044"}
                _hover={{ color: "#dda043" }}
                fontWeight={isActive ? "bold" : "normal"}
                onClick={onToggle} // Close the menu when a link is clicked
              >
                {nav}
              </ChakraLink>
            );
          })}
        </Flex>
      </Container>
    </Box>
  );
}
