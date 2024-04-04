import React, { type ReactNode, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Container, Skeleton } from "@chakra-ui/react";
import { api } from "~/utils/api";

const AuthGuard: React.FC<{ useLoader?: boolean; children: ReactNode, userId?: string }> = ({
    children,
    userId,
    useLoader = true,
}) => {
    const router = useRouter();
    const [redirected, setRedirected] = useState(false);
    const { data, isLoading, isFetched } = api.profile.get.useQuery({ userId: userId || '' });

    useEffect(() => {
        if (isFetched && !data) {
            console.log("No data fetched");
            router.push('/')
            setRedirected(true);
        }
    }, [data, isFetched, redirected]);

    console.log({data})

    if (useLoader && isLoading) {
        return (
            <Container
                maxW="100%"
                py={{ base: "12", md: "24" }}
                px={{ base: "0", sm: "8" }}
            >
                <Skeleton minH={500} width={"100%"}></Skeleton>
            </Container>
        );
    }

    return data && data.roles.includes('ADMIN') && <>{children}</>;
};

export { AuthGuard };
