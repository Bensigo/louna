import { useAppUser } from "~/provider/user";
import ChallengeList from "./ListChallenge";
import { api } from "~/utils/api";
import { useCallback, useMemo, useState, useEffect } from "react";
import { View } from "tamagui";

export const UpcomingChallenges = () => {
  const user = useAppUser();

  const [activity, setActivity] = useState<string | undefined>();
  const [skip, setSkip] = useState<number>(0);
  const limit = 20;
  const today = useMemo(() => new Date().toISOString(), []);

  useEffect(() => {
    setSkip(0); // Reset skip to trigger refresh
  }, [activity]);

  const { 
    data, 
    isLoading, 
    refetch,
    isRefetching
  } = api.challenges.list.useQuery({
    startDate: today,
    ...(activity ? { type: activity }: {}),
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