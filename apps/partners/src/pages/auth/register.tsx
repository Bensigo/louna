import React from "react"
import { useRouter } from "next/router"
import {
    Box,
    Button,
    Checkbox,
    Container,
    FormControl,
    FormLabel,
    Heading,
    HStack,
    Input,
    Link,
    Stack,
    Text,
    useToast,
} from "@chakra-ui/react"
import { useSignUp } from "@clerk/nextjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type SubmitHandler } from "react-hook-form"
import * as z from "zod"

import { Guard } from "~/shared/Guard"
import { PasswordField } from "~/shared/PasswordField"

const SignUpSchema = z.object({
    firstname: z
        .string({
            required_error: "Firstname must contain at least 2 character(s)",
        })
        .min(2),
    lastname: z
        .string({
            required_error: "Lastname must contain at least 2 character(s)",
        })
        .min(2),
    email: z.string().email(),
    password: z.string().min(8).max(15),
})

type SignUpSchemaType = z.infer<typeof SignUpSchema>

const ROLE = "PARTNER"

const Register = () => {
    const router = useRouter()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignUpSchemaType>({
        resolver: zodResolver(SignUpSchema),
    })

    const toast = useToast()
    const { signUp, isLoaded } = useSignUp()

    const handleSignup: SubmitHandler<SignUpSchemaType> = async (data) => {
        if (!isLoaded) {
            return
        }
        try {
            // TODO: check if email is valid whitelist for patners
            await signUp?.create({
                emailAddress: data.email,
                password: data.password,
                firstName: data.firstname,
                lastName: data.lastname,
                unsafeMetadata: {
                    role: ROLE,
                    agent: "web",
                },
            })
            await signUp.prepareEmailAddressVerification({
                strategy: "email_code",
            })
            router.push("/auth/verify_new")
        } catch (err: any) {
            console.error("error", err.errors[0])
            toast({
                title: "Error",
                description: err.errors[0].longMessage,
                status: "error",
                duration: 9000,
                isClosable: true,
            })
        }
    }

    return (
        <Guard>
            <Container
                maxW="lg"
                py={{ base: "12", md: "24" }}
                px={{ base: "0", sm: "8" }}
            >
                <Stack spacing="8">
                    <Stack spacing="6">
                        <Stack
                            spacing={{ base: "2", md: "3" }}
                            textAlign="center"
                        >
                            <Heading size={{ base: "xs", md: "sm" }}>
                                Log in to your account
                            </Heading>
                            <Text color="fg.muted">
                                Already have an account?{" "}
                                <Link href="/">Sign In</Link>
                            </Text>
                        </Stack>
                    </Stack>
                    <Box
                        py={{ base: "0", sm: "8" }}
                        px={{ base: "4", sm: "10" }}
                        bg={{ base: "transparent", sm: "bg.surface" }}
                        boxShadow={{ base: "none", sm: "md" }}
                        borderRadius={{ base: "none", sm: "xl" }}
                    >
                        <Stack spacing="6">
                            <form onSubmit={handleSubmit(handleSignup)}>
                                <Stack spacing="5">
                                    <FormControl>
                                        <FormLabel htmlFor="firstname">
                                            Firstname
                                        </FormLabel>
                                        <Input
                                            id="firstname"
                                            type="text"
                                            {...register("firstname")}
                                        />
                                        {errors.firstname && (
                                            <Text
                                                color={"red.300"}
                                                fontSize="xs"
                                            >
                                                {errors.firstname.message}
                                            </Text>
                                        )}
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel htmlFor="lastname">
                                            Lastname
                                        </FormLabel>
                                        <Input
                                            id="lastname"
                                            type="text"
                                            {...register("lastname")}
                                        />
                                        {errors.lastname && (
                                            <Text
                                                color={"red.300"}
                                                fontSize="xs"
                                            >
                                                {errors.lastname.message}
                                            </Text>
                                        )}
                                    </FormControl>
                                    <FormControl>
                                        <FormLabel htmlFor="email">
                                            Email
                                        </FormLabel>
                                        <Input
                                            id="email"
                                            type="email"
                                            {...register("email")}
                                        />
                                        {errors.email && (
                                            <Text
                                                fontSize="xs"
                                                color={"red.300"}
                                            >
                                                {errors.email.message}
                                            </Text>
                                        )}
                                    </FormControl>
                                    <PasswordField {...register("password")} />
                                    {errors.password && (
                                        <Text fontSize="xs" color={"red.300"}>
                                            {errors.password.message}
                                        </Text>
                                    )}
                                </Stack>
                                <HStack justify="space-between" mt={4}>
                                    <Checkbox defaultChecked>
                                        Remember me
                                    </Checkbox>
                                    <Button variant="text" size="sm">
                                        Forgot password?
                                    </Button>
                                </HStack>
                                <Stack spacing="6" mt={5}>
                                    <Button
                                        type="submit"
                                        bg={"blue.400"}
                                        color="white"
                                    >
                                        Sign up
                                    </Button>
                                </Stack>
                            </form>
                        </Stack>
                    </Box>
                </Stack>
            </Container>
        </Guard>
    )
}

export default Register
