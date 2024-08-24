import React, { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { router } from "expo-router";
import { Calendar, Clock, PlusCircle, Trophy } from "@tamagui/lucide-icons";
import { Avatar, Button, Card, XStack, YStack } from "tamagui";

import type { RouterOutputs } from "@lumi/api";

import Pill from "~/components/pill";
import activities from "~/constants/activities";
import { Colors, colorScheme } from "~/constants/colors";
import { useAppUser } from "~/provider/user";
import { api } from "~/utils/api";

type Challenges = RouterOutputs["challenges"]["list"]["challenges"];

interface ChallengeCardProps {
  loadMore: () => void;
  onRefresh: () => void;
  onSelectActivity: (val: string) => void;
  challenges: Challenges;
  isLoading: boolean;
  refreshing: boolean;
}

type ChallengeParticipation = {
  id: string;
  userId: string;
  user: {
    id: string;
    name: string;
    image: string | null;
  };
};

const ChallengeCard = ({ item }: { item: Challenges[0] }) => {
  const user = useAppUser();
  const formatDate = (date: Date) => date.toLocaleDateString();
  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const { mutate: join } = api.challenges.join.useMutation();

  const goToDetail = () => {
    router.push(`/(tabs)/challenges/${item.id}`);
  };

  const joinChallenge = () => {
    join(
      {
        id: item.id,
      },
      {
        onError(error) {
          Alert.alert("Error", error.message);
        },
      },
    );
  };

  const participantsToShow =
    (item.participants as ChallengeParticipation[])?.slice(0, 3) || [];
  const remainingParticipants = (item.participants?.length || 0) - 3;


  const getGoalType = (value: string) => {
    switch(value){
      case 'DURATION':
        return 'Mins'
        break;
      default:
        return '%(Increment)'
    }
  }

  return (
    <Card
      size="$4"
      bordered
      animation="bouncy"
      scale={0.9}
      hoverStyle={{ scale: 0.925 }}
      pressStyle={{ scale: 0.875 }}
      borderRadius={16}
      margin="$1"
      backgroundColor={Colors.light.background}
      onPress={goToDetail}
    >
      <XStack space="$3" padding="$3">
        <Image
          source={{
            uri: item.imageUrl ?? "https://via.placeholder.com/100x100",
          }}
          style={styles.image}
        />
        <YStack flex={1} space="$2">
          <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
            {item.title}
          </Text>
          <XStack space="$2" alignItems="center">
            <Calendar size={16} color={colorScheme.text.secondary} />
            <Text
              style={styles.infoText}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {formatDate(item?.startDate)} -{" "}
              {item?.endDate ? formatDate(item?.endDate) : "N/A"}
            </Text>
          </XStack>
          {/* <XStack space="$2" alignItems="center">
            <Clock size={16} color={colorScheme.text.secondary} />
            <Text style={styles.infoText} numberOfLines={1} ellipsizeMode="tail">
              {formatTime(item?.startDate)} - {item.endDate ? formatTime(item.endDate) : 'N/A'}
            </Text>
          </XStack> */}
          <XStack gap={'$2'}>
              <Trophy size={16} color={colorScheme.text.secondary} />
            <XStack  gap={'$1'}>
              <Text style={styles.infoText}>{item.goalType}</Text>
              <Text style={styles.infoText}>{`${item.goalValue} ${getGoalType(item.goalType)}`}</Text>
            </XStack>
          </XStack>
        </YStack>
      </XStack>
      <XStack justifyContent="space-between" alignItems="center" padding="$3">
        <XStack space="$1" alignItems="center">
          {participantsToShow.map((participant) => (
            <Avatar key={participant.id} size="$2" circular>
              <Avatar.Image
                source={{
                  uri:
                    participant.user?.image ||
                    "https://via.placeholder.com/30x30",
                }}
              />
            </Avatar>
          ))}
          {remainingParticipants > 0 && (
            <View style={styles.remainingParticipants}>
              <Text style={styles.remainingParticipantsText}>
                +{remainingParticipants}
              </Text>
            </View>
          )}
        </XStack>
        {item.creatorId !== user?.id ||
          (!item.participants.some((x) => x.userId === user.id) && (
            <Button
              size="$3"
              theme="active"
              backgroundColor={colorScheme.primary.green}
              onPress={joinChallenge}
            >
              Join
            </Button>
          ))}
      </XStack>
    </Card>
  );
};

const ChallengeList: React.FC<ChallengeCardProps> = ({
  onRefresh,
  onSelectActivity,
  loadMore,
  challenges,
  isLoading,
  refreshing,
}) => {
  const [selectedActivityFilter, setSelectedActivityFilter] = useState("");
  const onEndReachedCalledDuringMomentum = useRef(true);
  const challengeRef = useRef();
  const setActivity = (activity: string) => {
    setSelectedActivityFilter(activity);
    onSelectActivity(activity);
  };

  const renderFooter = () => {
    return refreshing ? (
      <ActivityIndicator size="small" color={colorScheme.secondary.gray} />
    ) : null;
  };

  const getItemLayout = useCallback(
    (data, index) => ({
      length: 200, // Replace with your item's fixed height
      offset: 200 * index,
      index,
    }),
    [],
  );

  const handleRefresh = useCallback(() => {
    onRefresh()
  }, [])

  return (
    <YStack flex={1}>
      <View style={styles.pillContainer}>
        <FlatList
          horizontal
          data={activities}
          extraData={selectedActivityFilter}
          scrollEnabled
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Pill
              onPress={() => setActivity(item)}
              color={
                selectedActivityFilter === item
                  ? colorScheme.primary.lightGreen
                  : colorScheme.text.secondary
              }
              borderColor={
                selectedActivityFilter === item
                  ? colorScheme.primary.lightGreen
                  : colorScheme.text.secondary
              }
            >
              {item}
            </Pill>
          )}
          style={styles.pillList}
          contentContainerStyle={styles.pillContentContainer}
        />
      </View>
      <FlatList
        data={challenges}
        ListEmptyComponent={() => <Text>No challenges found</Text>}
        renderItem={({ item }) => <ChallengeCard item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.container}
        onEndReached={loadMore}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        initialScrollIndex={0}
        onMomentumScrollBegin={() => {
          onEndReachedCalledDuringMomentum.current = false;
        }}
        ref={challengeRef}
        scrollEnabled
        onRefresh={onRefresh}
        ListFooterComponent={renderFooter}
        refreshing={refreshing}
        onScrollToIndexFailed={({ index, averageItemLength }) => {
          challengeRef.current?.scrollToOffset({
            offset: index * averageItemLength,
            animated: true,
          });
        }}
        getItemLayout={getItemLayout}
        removeClippedSubviews={true}
        windowSize={21}
        maxToRenderPerBatch={20}
        updateCellsBatchingPeriod={50}
        initialNumToRender={20}
        onEndReachedThreshold={0.1}
      />
    </YStack>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
  },
  pillList: {
    flexGrow: 0,
  },
  pillContentContainer: {
    // alignItems: 'center',
  },
  pillContainer: {
    height: 50,
    marginBottom: 10,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: colorScheme.secondary.darkGray,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: colorScheme.text.secondary,
  },
  remainingParticipants: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colorScheme.primary.green,
    justifyContent: "center",
    alignItems: "center",
  },
  remainingParticipantsText: {
    color: colorScheme.secondary.darkGray,
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default React.memo(ChallengeList);
