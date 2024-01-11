import React, { type ReactNode } from "react"
import { useRouter } from "next/router"
import { Container, Skeleton } from "@chakra-ui/react"

import { useCustomAuth } from "~/context/authContext"

const AuthGuard: React.FC<{ useLoader?: boolean; children: ReactNode }> = ({
    children,
    useLoader = true,
}) => {
    const router = useRouter()
    const { isInstructor, isSignedIn, isLoading } = useCustomAuth()

    React.useEffect(() => {
        if (!isLoading && !isSignedIn) {
            router.replace("/auth/login")
        }
        if (!isLoading && isSignedIn) {
            if (!isInstructor) {
                router.replace("/auth/login")
            }
        }
    }, [isInstructor, isSignedIn, isLoading, router])

    if (useLoader && isLoading && !isSignedIn) {
        return (
            <Container
                maxW="100%"
                py={{ base: "12", md: "24" }}
                px={{ base: "0", sm: "8" }}
            >
                <Skeleton minH={500} width={"100%"}></Skeleton>
            </Container>
        )
    }

    return !isLoading && isSignedIn && isInstructor && <>{children}</>
}

export { AuthGuard }
