import { useAppUser } from "~/provider/user";
import ChallengeList from "./ListChallenge";
import { api } from "~/utils/api";
import { useCallback, useMemo, useState } from "react";
import { View } from "tamagui";

export const UpcomingChallenges = () => {
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
   ...( activitity ? {  type: activitity, }: {}),
   isFreeSession: false,
    skip,
    limit,
  }, { enabled: !!user, keepPreviousData: true });

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
        challenges={data?.challenges ?? []} 
        isLoading={isLoading} 
        refreshing={isRefetching} 
      />
    </View>
  );
};