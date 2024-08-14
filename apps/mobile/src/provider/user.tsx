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

  console.log({ data }, '===================')

  useEffect(() => {
    if (data?.id) {
      setUser(data);
    }
  }, [data]);

  useEffect(() => {
    if (!navigationState?.key) return;
   
    const inAuthGroup = segments[0] === "(auth)";

    console.log({ session, isLoading, inAuthGroup })

    if (!session && !inAuthGroup) {
      router.replace("/login");
    } else if (session?.user.id && !isLoading  && inAuthGroup) {
      // check if user has done the onboarding questionnaire
      // if not redirect user to questionnaire
      router.replace("/home");
    }
  }, [session, isLoading, data, segments, navigationState?.key]);

  if (isLoading) {
    return <ActivityIndicator size={"small"} />;
  }

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export const useAppUser = () => {
  return useContext(UserContext);
};
