import React, { type ReactNode } from "react";
import { useRouter } from "next/router";

import { useCustomAuth } from "~/context/authContext";
import { Container, Skeleton } from "@chakra-ui/react";


const Guard: React.FC<{ useLoader?: boolean, children: ReactNode }> = ({ children, useLoader = true }) =>   {
  const router = useRouter();
  const { isAdmin, isSignedIn, isLoading } = useCustomAuth();

  React.useEffect(() => {
    if (!isLoading && isSignedIn) {
      if ( isAdmin) {
        console.log("got here");
        router.replace("/dashboard/");
      } 
    }
  }, [isAdmin, isSignedIn, isLoading, router]);

  if (useLoader && isLoading && !isSignedIn) {
    return (
      <Container maxW="100%" py={{ base: "12", md: "24" }} px={{ base: "0", sm: "8" }}>
        <Skeleton minH={500} width={"100%"}></Skeleton>
      </Container>
    );
  }

  return (!isLoading && !isSignedIn && <>
    {children}
  </>);
}

export { Guard };

