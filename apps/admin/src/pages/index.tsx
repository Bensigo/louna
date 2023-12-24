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
import { useSignIn } from "@clerk/nextjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type SubmitHandler } from "react-hook-form"
import { z } from "zod"
import { Guard } from "~/shared/shared/Guard"
import { PasswordField } from "~/shared/shared/PasswordField"



const LoginUserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(8).max(20),
})

type LoginUserType = z.infer<typeof LoginUserSchema>

const Login = () => {
    const router = useRouter()
    const toast = useToast()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginUserType>({
        resolver: zodResolver(LoginUserSchema),
    })

    const { signIn, isLoaded, setActive } = useSignIn()
  


    const handleLogin: SubmitHandler<LoginUserType> = async (data) => {
        if (!isLoaded) return
        try {
            const result = await signIn.create({
                password: data.password,
                identifier: data.email,
            })

            if (result.status === "complete") {
                setActive({ session: result.createdSessionId })
                router.push("/dashboard/")
            }
        } catch (err: any) {
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
     <Guard >
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
                                Log in to admin dashboard
                            </Heading>
        
                        </Stack>
                    </Stack>
                    <Box
                        py={{ base: "0", sm: "8" }}
                        px={{ base: "4", sm: "10" }}
                        bg={{ base: "transparent", sm: "bg.surface" }}
                        boxShadow={{ base: "none", sm: "md" }}
                        borderRadius={{ base: "none", sm: "xl" }}
                    >
                        <form onSubmit={handleSubmit(handleLogin)}>
                            <Stack spacing="6">
                                <Stack spacing="5">
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
                                                color={"red.300"}
                                                fontSize="xs"
                                            >
                                                {errors.email.message}
                                            </Text>
                                        )}
                                    </FormControl>
                                    <PasswordField {...register("password")} />
                                    {errors.password && (
                                        <Text color={"red.300"} fontSize="xs">
                                            {errors.password.message}
                                        </Text>
                                    )}
                                </Stack>
                                <HStack justify="space-between">
                                    <Checkbox defaultChecked>
                                        Remember me
                                    </Checkbox>
                                    <Button variant="text" size="sm">
                                        Forgot password?
                                    </Button>
                                </HStack>
                                <Stack spacing="6">
                                    <Button type="submit">Sign in</Button>
                                </Stack>
                            </Stack>
                        </form>
                    </Box>
                </Stack>
            </Container>
         </Guard>
        
    )
}

export default Login;