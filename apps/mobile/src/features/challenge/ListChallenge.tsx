import React, { useState } from "react";
import { FlatList, Image, StyleSheet, Text, View, RefreshControl, TouchableWithoutFeedback } from "react-native";
import { Card, Button as TamaguiButton, XStack, YStack } from "tamagui";
import { Users2, Clock , Calendar, } from '@tamagui/lucide-icons'

import type { RouterOutputs } from "@lumi/api";

import Pill from "~/components/pill";
import activities from "~/constants/activities";
import { Colors , colorScheme} from "~/constants/colors";
import { router } from "expo-router";
import { useAppUser } from "~/provider/user";

type Challenges = RouterOutputs["challenges"]["list"];

interface ChallengeCardProps {
  loadMore: () => void;
  onRefresh: () => void,
  onSelectActivity: (val: string) => void,
  challenges: Challenges,
  isLoading: boolean,
  refreshing: boolean
}

const ChallengeCard = ({ item }: { item: Challenges[0] }) => {
  console.log({ item })
  const user = useAppUser()
  const formatDate = (date: Date) => date.toLocaleDateString();
  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const goToDetail = () => {
    router.push(`/(tabs)/challenges/${item.id}`)
  };

  return (
    <TouchableWithoutFeedback onPress={goToDetail}>
      <Card 
         elevate
         size="$4"
         bordered
         animation="bouncy"
         scale={0.9}
         hoverStyle={{ scale: 0.925 }}
         pressStyle={{ scale: 0.875 }}
         borderWidth={1}
         borderColor={'wheat'}
         margin="$1"
         shadowOffset={{ width: 0, height: 1 }}
         shadowOpacity={0.05}
         shadowRadius={2}
      style={styles.card}
      >
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">{item.name}</Text>
          <XStack style={styles.iconTextContainer}>
            <Users2 size={16} color={Colors.light.text} />
            <Text style={styles.infoText}>Capacity: {item.capacity}</Text>
          </XStack>
          <XStack style={styles.iconTextContainer}>
            <Calendar size={16} color={Colors.light.text} />
            <Text style={styles.infoText} numberOfLines={1} ellipsizeMode="tail">
              {formatDate(item.startDateTime)} - {item.endDateTime ? formatDate(item.endDateTime) : 'N/A'}
            </Text>
          </XStack>
          <XStack style={styles.iconTextContainer}>
            <Clock size={16} color={Colors.light.text} />
            <Text style={styles.infoText} numberOfLines={1} ellipsizeMode="tail">
              {formatTime(item.startDateTime)} - {item.endDateTime ? formatTime(item.endDateTime) : 'N/A'}
            </Text>
          </XStack>
          <XStack style={styles.iconTextContainer}>
            <Users2 size={16} color={Colors.light.text} />
            <Text style={styles.infoText}>Members: {item.members?.length || 0}</Text>
          </XStack>
          {item.ownerId !== user?.id && (
            <TamaguiButton
              style={styles.button}
              onPress={() => console.log(`Joined challenge: ${item.name}`)}
            >
              <Text style={styles.buttonText}>Join</Text>
            </TamaguiButton>
          )}
        </View>
      </Card>
    </TouchableWithoutFeedback>
  );
};

const ChallengeList: React.FC<ChallengeCardProps> = ({  onRefresh, onSelectActivity, loadMore, challenges, isLoading, refreshing }) => {
  const [selectedActivityFilter, setSelectedActivityFilter] = useState("");

    const setActivity = (activity: string) => {
      setSelectedActivityFilter(activity)
      onSelectActivity(activity)
    }


  return (
    <YStack flex={1} >
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
             
              color={ selectedActivityFilter === item ? colorScheme.primary.lightGreen : colorScheme.text.secondary}
              borderColor={ selectedActivityFilter === item ? colorScheme.primary.lightGreen : colorScheme.text.secondary}
            >
              {item}
            </Pill>
          )}
          style={styles.pillList}
          contentContainerStyle={styles.pillContentContainer}
        />
      </View>
      <FlatList
        data={challenges ?? []}
        ListEmptyComponent={() => 
          isLoading ? <Text>Loading...</Text> : <Text>No challenges found</Text>
        }
        renderItem={({ item }) => <ChallengeCard item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.container]}
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onRefresh={onRefresh}
        refreshing={refreshing}
      />
    </YStack>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  

  },
  pillList: {
    flexGrow: 0,
  },
  pillContentContainer: {
    // alignItems: 'center',
  },
  iconTextContainer: {
    gap: 3,

  },
  pillContainer: {
    height: 50,
    marginBottom: 10,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 10,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  

  

  },
  infoText : {
    color: "#808080"
  },
  image: {
    width: 120,
    height: 100,
    borderRadius: 8,
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
    color: Colors.light.tint,
  },
  capacity: {
    fontSize: 14,
    marginBottom: 4,
    color:  colorScheme.secondary.darkGray,
  },
  date: {
    fontSize: 14,
    marginBottom: 4,
    color:  colorScheme.secondary.darkGray,
  },
  time: {
    fontSize: 14,
    marginBottom: 8,
    color:  colorScheme.secondary.darkGray,
  },
  memberCount: {
    fontSize: 14,
    marginBottom: 12,
    color: colorScheme.secondary.darkGray,
  },
  button: {
    backgroundColor: colorScheme.primary.green,
    color: colorScheme.primary.white,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: Colors.light.tint,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default React.memo(ChallengeList);