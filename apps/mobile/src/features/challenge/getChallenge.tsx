import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Linking, Platform, StyleSheet } from "react-native";

import { router } from "expo-router";
import * as CalendarRN from 'expo-calendar';
import {
  Activity,
  Calendar,
  CheckCircle,
  Clock,
  Cog,
  PlusCircle,
  Trophy,
  Users,
} from "@tamagui/lucide-icons";
import { format } from "date-fns";
import {
  Avatar,
  Button,
  Card,
  H2,
  Image,
  Paragraph,
  ScrollView,
  Text,
  useWindowDimensions,
  XStack,
  YStack,
} from "tamagui";

import { Colors, colorScheme } from "~/constants/colors";
import { useAppUser } from "~/provider/user";
import { api } from "~/utils/api";

interface GetChallengeProps {
  id: string;
}

const GetChallenge: React.FC<GetChallengeProps> = ({ id }) => {
  const { width: DEVICE_WIDTH } = useWindowDimensions();
  const user = useAppUser();
  const [isLoadingImg, setIsLoadingImg] = useState(true);

  const { isLoading, data: challenge } = api.challenges.get.useQuery({ id });
  const { mutate: joinChallenge, isLoading: isSubmitting } =
    api.challenges.join.useMutation();


  

  const handleJoinChallenge = () => {
    joinChallenge(
      { id },
      {
        onSuccess: () => {
          Alert.alert("Success", "You've joined the challenge!");
        },
        onError: (error) => {
          Alert.alert("Error", error.message);
        },
      },
    );
  };

  const goToChallengeSetting = () => {
    if (challenge) {
      router.push({
        pathname: "/(tabs)/challenges/[id]/settings" as const,
        params: {
          id,
          startDate: challenge.startDate.toISOString(),
          endDate: challenge.endDate?.toISOString(),
        },
      });
    }
  };

  async function getDefaultCalendarSource() {
    const defaultCalendar = await CalendarRN.getDefaultCalendarAsync();
    return defaultCalendar.source;
  }

  const addToCalendar = async () => {
    if (challenge) {
      const eventConfig = {
        title: challenge.title ?? '',
        startDate: challenge.startDate.toISOString(),
        endDate: challenge.endDate?.toISOString() || challenge.startDate.toISOString(),
        notes: challenge.description ?? '',
      };
      const { status } = await CalendarRN.requestCalendarPermissionsAsync();
      if (status === 'granted') {
        const defaultCalendarSource = Platform.OS === 'ios'
          ? await getDefaultCalendarSource()
          : { isLocalAccount: true, name: 'Expo Calendar' };

          const calendarID = await CalendarRN.createCalendarAsync({
            title: 'Louna',
            color: colorScheme.primary.green,
            entityType: CalendarRN.EntityTypes.EVENT,
            sourceId: defaultCalendarSource.id,
            source: defaultCalendarSource,
            name: 'internalCalendarName',
            ownerAccount: 'personal',
            accessLevel: CalendarRN.CalendarAccessLevel.OWNER,
          });
         const event =  await CalendarRN.createEventAsync(calendarID, eventConfig);
         console.log({ event })
         if (typeof event === 'string'){
          Alert.alert("Sucess", "Calender event created")
         }
      }
    }
  };

  if (isLoading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <ActivityIndicator size="large" color={colorScheme.primary.green} />
      </YStack>
    );
  }

  if (!challenge) {
    return (
      <YStack padding="$4">
        <Text>Challenge not found.</Text>
      </YStack>
    );
  }

  const getGoalType = (value: string) => {
    switch(value){
      case 'DURATION':
        return 'Mins'
        break;
      default:
        return '%(Increment)'
    }
  }

  const participantsToShow = challenge.participants?.slice(0, 4) || [];
  const remainingParticipants = (challenge.participants?.length || 0) - 4;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card elevate style={styles.imageCard}>
        <Image
          source={{
            uri: challenge.imageUrl || "https://via.placeholder.com/400x200",
          }}
          style={styles.image}
          onLoadStart={() => setIsLoadingImg(true)}
          onLoad={() => setIsLoadingImg(false)}
          onError={() => setIsLoadingImg(false)}
        />
        {isLoadingImg && (
          <ActivityIndicator
            style={StyleSheet.absoluteFill}
            color={colorScheme.primary.green}
          />
        )}
      </Card>
      <Button
        size="$5"
        backgroundColor={colorScheme.secondary.lightGray}
        color={colorScheme.primary.lightGreen}
        onPress={addToCalendar}
        width={'100%'}
        pressStyle={{
           backgroundColor:colorScheme.secondary.lightGray,
           borderWidth: 0
        }}
        icon={<Calendar  size={20} color={colorScheme.primary.lightGreen} />}
      >
        Add to Calendar
      </Button>
      <YStack space="$4" style={styles.contentContainer}>
        <XStack justifyContent="space-between" alignItems="center">
          <H2 fontSize={'$7'} color={colorScheme.secondary.darkGray} fontWeight={"bold"}>
            {challenge.title}
          </H2>
          {challenge.creatorId === user?.id && (
            <Button
              icon={<Cog size={20} color={colorScheme.primary.lightGreen} />}
              circular
              backgroundColor="transparent"
              onPress={goToChallengeSetting}
            />
          )}
        </XStack>

        <Paragraph color={colorScheme.secondary.darkGray}>
          {challenge?.description ?? ""}
        </Paragraph>

        <Card elevate style={styles.infoCard}>
          <YStack gap="$2" flexWrap="wrap">
            <XStack gap="$3">
              <InfoItem
                icon={<Calendar size={20} color={colorScheme.text.secondary} />}
                label="Start"
                value={format(new Date(challenge.startDate), "PPP")}
              />
              <InfoItem
                icon={<Clock size={20} color={colorScheme.text.secondary} />}
                label="End"
                value={
                  challenge.endDate
                    ? format(new Date(challenge.endDate), "PPP")
                    : "N/A"
                }
              />
            </XStack>

            {/* <InfoItem
              icon={
                <CheckCircle size={20} color={colorScheme.text.secondary} />
              }
              label="Interval"
              value={challenge.interval || "N/A"}
            /> */}
            <XStack>
              <InfoItem
                icon={<Activity size={20} color={colorScheme.text.secondary} />}
                label="Tracking"
                value={challenge.goalType?.toString() || "Unlimited"}
              />
              <InfoItem
                icon={
                  <Trophy size={20} color={colorScheme.text.secondary} />
                }
                label="Goal"
                value={`${challenge.goalValue} ${getGoalType(challenge.goalType)}`}
              />
            </XStack>
          </YStack>
        </Card>

        <Card elevate style={styles.participantsCard}>
          <H2
            color={colorScheme.secondary.darkGray}
            style={styles.participantsTitle}
          >
            Participants
          </H2>
          <XStack space="$2" flexWrap="wrap">
            {participantsToShow.map((participant) => (
              <Avatar key={participant.id} circular size={"$3"}>
                <Avatar.Image
                  source={{
                    uri:
                      participant.user.image ||
                      "https://via.placeholder.com/50x50",
                  }}
                />
              </Avatar>
            ))}
            {remainingParticipants > 0 && (
              <Avatar
                circular
                size={10}
                backgroundColor={colorScheme.primary.green}
              >
                <Avatar.Text color={Colors.light.background} fontWeight="bold">
                  +{remainingParticipants}
                </Avatar.Text>
              </Avatar>
            )}
          </XStack>
        </Card>

        {challenge.creatorId === user?.id && (
          <XStack space="$4" justifyContent="center" bottom={20} left={0} right={0} position="absolute">
            <Button
              size="$5"
              theme="active"
              backgroundColor={colorScheme.primary.green}
              color={colorScheme.primary.white}
              onPress={handleJoinChallenge}
              icon={
                isSubmitting ? undefined : (
                  <PlusCircle size={20} color={colorScheme.primary.white} />
                )
              }
            >
              {isSubmitting ? (
                <ActivityIndicator color={colorScheme.primary.white} />
              ) : (
                "Join Challenge"
              )}
            </Button>
          </XStack>
        )}
      </YStack>
    </ScrollView>
  );
};




const InfoItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <XStack space="$2" alignItems="center" style={styles.infoItem}>
    {icon}
    <YStack>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </YStack>
  </XStack>
);

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  imageCard: {
    overflow: "hidden",
    borderRadius: 0,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  contentContainer: {
    padding: 20,
  },
  infoCard: {
    padding: 20,
    backgroundColor: colorScheme.primary.lightGreen + "10",
  },
  infoItem: {
    minWidth: "45%",
    marginBottom: 10,
  },
  infoLabel: {
    fontSize: 12,
    color: colorScheme.text.secondary,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: "bold",
    color: colorScheme.secondary.darkGray,
  },
  participantsCard: {
    padding: 15,
    backgroundColor: colorScheme.secondary.lightGray + "20",
  },
  participantsTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
});

export { GetChallenge };
