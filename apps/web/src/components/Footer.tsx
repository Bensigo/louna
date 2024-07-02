import { useRouter } from "next/router"
import {
    Box,
    Flex,
    Image,
    Link,
    Stack,
    Text,
    useMediaQuery,
} from "@chakra-ui/react"
import { FaInstagram, FaLinkedin, FaTiktok } from "react-icons/fa"

const Footer = () => {
    const currentYear = new Date().getFullYear()
    const router = useRouter()
    const [isLaptopView] = useMediaQuery("(min-width: 1024px)")

    const handleLogoClick = (e) => {
        e.preventDefault()
        router.push("/")
    }

    return (
        <Box
            as="footer"
            px={12}
            py={8}
            textAlign="center"
            bg="gray.800"
            width={"100%"}
            color="white"
        >
            <Box maxW="container.xl">
                <Flex justify="space-between" align="center" flexWrap="wrap">
                    <Box mb={{ base: 4, md: 0 }}>
                        <Link href="/" onClick={handleLogoClick}>
                            <Image
                                src="/solu.png"
                                alt="Your Logo"
                                width={100}
                            />
                        </Link>
                    </Box>
                    {isLaptopView && (
                        <Flex direction="column" alignItems="center">
                            <Text color="#f4e5ce" fontSize="sm" mb={2}>
                                &copy; {currentYear} Solu Inc
                            </Text>
                            <Text color="#f4e5ce" fontSize="sm">
                                All rights reserved.
                            </Text>
                        </Flex>
                    )}
                    <Flex
                        justify={!isLaptopView ? "center" : "flex-end"}
                        align="center"
                        mb={{ base: 4, md: 0 }}
                        flex="1"
                    >
                        <Stack>
                            <Flex justify="center" mb={{ base: 4, md: 0 }}>
                                <Link
                                    href="#"
                                    mr={4}
                                    aria-label="Instagram"
                                    title="Instagram"
                                >
                                    <FaInstagram color="#f4e5ce" size={24} />
                                </Link>
                                <Link
                                    href="#"
                                    mr={4}
                                    aria-label="TikTok"
                                    title="TikTok"
                                >
                                    <FaTiktok color="#f4e5ce" size={24} />
                                </Link>
                                <Link
                                    href="#"
                                    aria-label="LinkedIn"
                                    title="LinkedIn"
                                >
                                    <FaLinkedin color="#f4e5ce" size={24} />
                                </Link>
                            </Flex>
                        </Stack>
                    </Flex>
                </Flex>
                {!isLaptopView && (
                    <Box mt={4}>
                        <Text color="#f4e5ce" fontSize="sm" mb={2}>
                            &copy; {currentYear} Solu Inc
                        </Text>
                        <Text color="#f4e5ce" fontSize="sm">
                            All rights reserved.
                        </Text>
                    </Box>
                )}
            </Box>
        </Box>
    )
}

export default Footer
