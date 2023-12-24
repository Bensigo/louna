import React, { type ReactNode } from "react"
import { useRouter } from "next/router"
import { Container, Skeleton } from "@chakra-ui/react"

import { useCustomAuth } from "~/context/authContext"

const AuthGuard: React.FC<{ useLoader?: boolean; children: ReactNode }> = ({
    children,
    useLoader = true,
}) => {
    const router = useRouter()
    const { isAdmin, isSignedIn, isLoading } = useCustomAuth()

    React.useEffect(() => {
        if (!isLoading && !isSignedIn) {
            router.replace("/")
        }
        if (!isLoading && isSignedIn) {
            if (!isAdmin) {
                router.replace("/")
            }
        }
    }, [isAdmin, isSignedIn, isLoading, router])

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

    return !isLoading && isSignedIn && isAdmin && <>{children}</>
}

export { AuthGuard }
