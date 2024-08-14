import React from 'react';
import { YStack, Text, Spinner, Image, H2, Paragraph, XStack, useWindowDimensions, ScrollView, Button } from 'tamagui';
import { api } from '~/utils/api';
import MapView, { Marker } from 'react-native-maps';
import { format } from 'date-fns';
import { Calendar, Clock, Users, Cog, User, MapPin } from '@tamagui/lucide-icons';
import { Colors, colorScheme } from '~/constants/colors';
import { ActivityIndicator, Alert } from 'react-native';
import { useAppUser } from '~/provider/user';
import { router } from 'expo-router';

interface GetChallengeProps {
  id: string;
}

const GetChallenge: React.FC<GetChallengeProps> = ({ id }) => {
    const { width: DEVICE_WIDTH } = useWindowDimensions()
    const user = useAppUser()
    
    const { isLoading, data: challenge } = api.challenges.get.useQuery({ id });
    const { mutate: joinChallenge, isLoading: isSubmiting } = api.challenges.join.useMutation();

    const handleJoinChallenge = () => {
        joinChallenge({ challengeId: id }, {
            onError(error){
                Alert.alert("Error", error.message)
            }
        });
      
    };


  if (isLoading) {
    return (
      <YStack flex={1} justifyContent="center" alignItems="center">
        <Spinner size="large" />
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

  const goToChallengeSetting = () => {
     if(challenge){
        router.push({
          pathname: "/(tabs)/challenges/[id]/settings" as const,
          params: { 
            id,
            startDate: challenge.startDateTime.toISOString(),
            endDate: challenge.endDateTime?.toISOString()
          }
        })
     }
  }

 

  return (
    <>
      <ScrollView >
        <YStack >
          {challenge.imageUrl ? (
            <Image 
              source={{ uri: challenge.imageUrl }} 
              aspectRatio={16 / 9} 
              width="100%"
              resizeMode="cover"
            />
          ) : (
            <Text>No image available</Text>
          )}

          <YStack padding="$4">
            <XStack justifyContent="space-between" alignItems="center">
              <H2 color={colorScheme.secondary.darkGray}>{challenge.name}</H2>
              {challenge.ownerId === user?.id && (
                <Button
                  icon={<Cog size={20} color={colorScheme.primary.lightGreen} />}
                  circular
                  backgroundColor="transparent"
                  onPress={goToChallengeSetting}
                />
              )}
            </XStack>
            <Paragraph color={colorScheme.secondary.darkGray}>{challenge.description}</Paragraph>
         
            
            <YStack gap="$2" marginTop="$4">
              <XStack alignItems="center" gap="$2">
                <Calendar size={20} color={colorScheme.text.secondary} />
                <Text color={colorScheme.secondary.darkGray}>Starts: {format(new Date(challenge.startDateTime), 'PPP p')}</Text>
              </XStack>
              {challenge.endDateTime && (
                <XStack alignItems="center" gap="$2">
                  <Clock size={20} color={colorScheme.text.secondary} />
                  <Text color={colorScheme.secondary.darkGray}>Ends: {format(new Date(challenge.endDateTime), 'PPP p')}</Text>
                </XStack>
              )}
            </YStack>    
            <YStack gap="$2" marginTop="$4">
              {challenge?.capacity > 0 && <XStack alignItems="center" gap="$2">
                <Users size={20} color={colorScheme.text.secondary} />
                <Text color={colorScheme.secondary.darkGray}>Capacity: {challenge.capacity}</Text>
              </XStack>}
              <XStack alignItems="center" gap="$2">
                <User size={20} color={colorScheme.text.secondary} />
                <Text color={colorScheme.secondary.darkGray}>Participants: {challenge.members?.length || 0}</Text>
              </XStack>
                 
            {challenge.location &&   (
              <YStack gap="$2">
                <MapView
                  style={{ height: 200, borderRadius: 10, marginVertical: 10 }}
                  initialRegion={{
                    latitude: challenge.location?.lat,
                    longitude: challenge.location?.lng,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421, 
                  }}
                >
                  <Marker
                    coordinate={{
                      latitude: challenge.location?.lat,
                      longitude: challenge.location?.lng,
                    }}
                    title={challenge.location?.address}
                  />
                </MapView>
                <XStack alignItems="center" gap="$2">
                  <MapPin size={20} color={Colors.light.text} />
                  <Text color={colorScheme.secondary.darkGray}>{challenge.location.address}</Text>
                </XStack>
              </YStack>
            )}
            </YStack>
          </YStack>
        </YStack>
      </ScrollView>
    {challenge.ownerId !== user?.id && <Button
        position="absolute"
        bottom={50}
        left={50}
        borderRadius={20}
        right={50}
        height={40}
        opacity={1}
        backgroundColor={colorScheme.primary.green}
        color={colorScheme.primary.white}
        size="$4"
        onPress={handleJoinChallenge}
      >
      {isSubmiting ? <ActivityIndicator size={'small'} /> : ' Join Challenge'}
      </Button>}
    </>
  );
};

export { GetChallenge };