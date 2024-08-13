import type { ReactNode } from "react";
import React, { createContext, useContext, useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
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

  const { data, isLoading } = api.auth.me.useQuery();

  useEffect(() => {
    if (data?.id) {
      setUser(data);
    }
  }, [data]);

  useEffect(() => {
    if (session?.user.id && !isLoading && data) {
      // check if user has done the onboarding questionnaire
      // if not redirect user to questionnaire

      router.push("/home");
      // if (data?.has_Onboarding) {
      //    router.push("/home");
      // } else {
      //   router.push("/username");
      // }
    }
  }, [session, isLoading, router]);

  if (!session || isLoading) {
    return <ActivityIndicator size={"small"} />;
  }


  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export const useAppUser = () => {
  return useContext(UserContext);
};
