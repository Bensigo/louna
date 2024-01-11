import React from "react"
import Link from "next/link"
import { useRouter } from "next/router"
import {
    Box,
    Button,
    Container,
    FormControl,
    FormLabel,
    HStack,
    Input,
    Text,
    useToast,
} from "@chakra-ui/react"
import { useSignUp } from "@clerk/nextjs"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type SubmitHandler } from "react-hook-form"
import { z } from "zod"

import { Guard } from "~/shared/Guard"

const VerifyNewUserSchema = z.object({
    code: z.string().min(3),
})

type VerifyNewUserType = z.infer<typeof VerifyNewUserSchema>

const VerifyNewUser = () => {
    const router = useRouter()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<VerifyNewUserType>({
        resolver: zodResolver(VerifyNewUserSchema),
    })

    const toast = useToast()
    const { signUp, isLoaded, setActive } = useSignUp()




    const handleVerifyUser: SubmitHandler<VerifyNewUserType> = async ({
        code,
    }) => {
        if (!isLoaded) return
        try {
            const completeAuth = await signUp.attemptEmailAddressVerification({
                code: code,
            })

            if ((completeAuth.status = "complete")) {
                setActive({ session: completeAuth.createdSessionId })
                router.push("/dashbord/setup")
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
        <>
            (
            <Guard>
                <Container mt={6}>
                    <Box>
                        <Text>Verify your account</Text>
                        <form onSubmit={handleSubmit(handleVerifyUser)}>
                            <FormControl mt={10}>
                                <FormLabel htmlFor="code">
                                    Verification code
                                </FormLabel>
                                <Input
                                    id="code"
                                    type="text"
                                    {...register("code")}
                                />
                                {errors.code && (
                                    <Text color={"red.300"} fontSize="xs">
                                        {errors.code.message}
                                    </Text>
                                )}
                            </FormControl>
                            <HStack mt={5}>
                                <Button
                                    type="submit"
                                    bg={"blue.600"}
                                    color="white"
                                >
                                    Verify Code
                                </Button>
                            </HStack>
                        </form>
                        <Link href={"/auth/register"}>Back to Register</Link>
                    </Box>
                </Container>
            </Guard>
        </>
    )
}

export default VerifyNewUser
