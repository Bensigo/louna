import { useAppUser } from "~/provider/user";
import ChallengeList from "./ListChallenge";
import { api } from "~/utils/api";
import { useCallback, useMemo, useState } from "react";
import { View } from "tamagui";

export const OwnedChallenges = () => {
  const user = useAppUser();

  const [activitity, setActivity] = useState();
  const [skip, setSkip] = useState(0);
  const limit = 20;
  // find out why this causes
  const today = useMemo(() => new Date().toISOString(), []);
  
  
    //  {
  //     limit: 50,
  //     skip,
  //     startDate: today,
  //     activities: []
  //   } 

   
  const { 
    data, 
    isLoading, 
    refetch,
    isRefetching
  } = api.challenges.list.useQuery({
    startDate: today,
   ...(activitity ? { activities: [activitity] }: {}),
    id: user?.id,
    skip: 0,
    limit: 50
  }, { enabled: !!user });

  const onRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const loadMore = useCallback(() => {
    setSkip((prev) => prev + limit);
  }, [limit]);

  console.log({ data, isLoading })

  return (
    <View flex={1} mt={'$2'}>
      <ChallengeList 
        loadMore={loadMore} 
        onRefresh={onRefresh} 
        onSelectActivity={(val) => setActivity(val)} 
        challenges={data || []} 
        isLoading={isLoading} 
        refreshing={isRefetching} 
      />
    </View>
  );
};