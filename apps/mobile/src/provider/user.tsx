import type { ReactNode } from "react";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { useRouter, useSegments, useRootNavigationState } from "expo-router";
import { useSession } from "@supabase/auth-helpers-react";

import type { RouterOutputs } from "~/utils/api";
import { api } from "~/utils/api";

type User = RouterOutputs["auth"]["me"];

interface UserProviderProps {
  children: ReactNode;
}

const UserContext = createContext<User | null>(null);

export const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const session = useSession();
  const segments = useSegments();
  const navigationState = useRootNavigationState();

  const { data, isLoading } = api.auth.me.useQuery({}, {
    onError(err){
      console.log({ err })
    }
  });


  useEffect(() => {
    if (data?.id) {
      setUser(data);
    }
  }, [data]);

  useEffect(() => {
    if (!navigationState?.key) return;
   
    const isRootRoute = segments.length === 0 && navigationState?.routes?.length === 1;


    if (!session) {
      router.replace("/login");
    } else if (session?.user.id && !isLoading) {
      if (data && isRootRoute) {
        // User is authenticated, has completed onboarding, and is on the root route
        router.replace("/home");
      } 
    }
  }, [session, isLoading, data, segments, navigationState?.key]);

  if (isLoading) {
    return <ActivityIndicator size={"large"}  />;
  }


  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export const useAppUser = () => {
  return useContext(UserContext);
};