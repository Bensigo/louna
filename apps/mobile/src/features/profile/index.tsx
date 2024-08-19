import React, { useState, useEffect } from 'react';
import { View, Text, YStack, Image, H1, XStack, Input, debounce, ScrollView, Card, Spinner } from 'tamagui';
import { decode } from 'base64-arraybuffer'
import * as ImagePicker from 'expo-image-picker';
import { colorScheme } from '~/constants/colors';
import  activities from '~/constants/activities';
import { Clock1, Edit3, Settings } from '@tamagui/lucide-icons';
import { api, type RouterOutputs } from '~/utils/api';
import { useAppUser } from '~/provider/user';
import { supabase } from '~/utils/supabase';
import { ActivityIndicator, Alert, FlatList, Keyboard, Pressable, RefreshControl } from 'react-native';
import Pill from '~/components/pill';
import { format } from 'date-fns';

interface AvatarProps {
  url?: string;
  onChange: (newUrl: string) => void;
  userId: string
}

const Avatar: React.FC<AvatarProps> = ({ url, onChange, userId }) => {
  const [imgUrl, setImageUrl] = useState(url)
  const [isLoading, setIsLoading] = useState(true)
  const handleChangeAvatar = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
        base64: true,
      });
      if (!result.canceled && result.assets[0].uri) {
        const uri = result.assets[0].uri;
        const base64 = result.assets[0]?.base64
        

        const fileExtension = uri.split('.').pop();
        const fileName = `${userId}/avatar-${Date.now()}.${fileExtension}`;
        const contentType = `image/${fileExtension}`;
        const bucket = 'profile-images'
        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(fileName, decode(base64), {
            contentType,
            upsert: true
          });

        if (error) throw error;

        const { data: publicUrlData } = supabase.storage
          .from(bucket)
          .getPublicUrl(data.path);

        const publicImageUrl = publicUrlData.publicUrl;
        setImageUrl(publicImageUrl);
        onChange(publicImageUrl);
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      Alert.alert('Error', 'Failed to upload avatar. Please try again.');
    }
  };

  return (
    <Pressable onPress={handleChangeAvatar}>
      <View alignItems="center" justifyContent="center">
        <View>
          <Image
            source={{ uri: imgUrl ?? 'https://via.placeholder.com/150' }}
            width={90}
            height={90}
            borderRadius={45}
            onLoadStart={() => setIsLoading(true)}
            onLoad={() => setIsLoading(false)}
            onError={() => setIsLoading(false)}
          />
          {isLoading && (
            <View 
              position="absolute" 
              top={0} 
              left={0} 
              right={0} 
              bottom={0} 
              backgroundColor="$gray5" 
              justifyContent="center" 
              alignItems="center"
              borderRadius={45}
            >
              <Spinner size="large" color={colorScheme.primary.lightGreen} />
            </View>
          )}
          <View position="absolute" bottom={0} right={0} backgroundColor="white" borderRadius={15} padding={5}>
            <Edit3 size={20} color={colorScheme.primary.lightGreen} />
          </View>
        </View>
      </View>
    </Pressable>
  );
};



const InterestsList = ({ interests, selectedInterests, onUpdate }: { interests: string[], selectedInterests: string[], onUpdate: (interests: string[]) => void }) => {
  const [showAll, setShowAll] = useState(false);
  const [currentlySeleted, setCurrentlySelected] = useState(selectedInterests)


  const displayedInterests = showAll ? interests : interests.slice(0, 9);
  const toggleInterest = (interest: string) => {
    const updatedInterests = currentlySeleted.includes(interest)
      ? currentlySeleted.filter(i => i !== interest)
      : [...currentlySeleted, interest];
    setCurrentlySelected(updatedInterests)  
    onUpdate(updatedInterests);
  };

  return (
    <YStack space="$2">
      <Text fontSize="$5" fontWeight="bold" color={colorScheme.text.secondary}>Interests</Text>
      <XStack flexWrap="wrap" space="$2">
        {displayedInterests.map((interest, index) => (
          <Pill
            key={index}
            onPress={() => toggleInterest(interest)}
            bg={currentlySeleted.includes(interest) ? colorScheme.primary.lightGreen : "white"}
            color={currentlySeleted.includes(interest) ? "white" : colorScheme.text.secondary}
          >
            {interest}
          </Pill>
        ))}
        {interests.length > 10 && (
          <Pressable onPress={() => setShowAll(!showAll)}>
            <Text color={colorScheme.primary.lightGreen}>
              {showAll ? '▾ Show Less' : '▸ Show More'}
            </Text>
          </Pressable>
        )}
      </XStack>
    </YStack>
  );
};
type Activity = RouterOutputs['challenges']['get']

const ActivityItem = ({ activity }: { activity: Activity }) => {
  const { name, startDateTime, imageUrl } = activity;
  const [isLoading, setIsLoading] = useState(true);

  return (
    <Card
      backgroundColor={'white'}
      borderColor={'white'}
      marginVertical={'$1'}
      animation="bouncy"
      scale={0.9}
      hoverStyle={{ scale: 0.925 }}
      pressStyle={{ scale: 0.875 }}
    >
      <XStack space="$3" padding="$3" alignItems="center">
        <View width={80} height={80} borderRadius="$2">
          <Image
            source={{ uri: imageUrl ?? 'https://via.placeholder.com/80x80' }}
            width={80}
            height={80}
            borderRadius="$2"
            onLoadStart={() => setIsLoading(true)}
            onLoad={() => setIsLoading(false)}
            onError={() => setIsLoading(false)}
          />
          {isLoading && (
            <View 
              position="absolute" 
              top={0} 
              left={0} 
              right={0} 
              bottom={0} 
              backgroundColor="$gray5" 
              justifyContent="center" 
              alignItems="center"
              borderRadius="$2"
            >
              <Spinner size="small" color={colorScheme.primary.lightGreen} />
            </View>
          )}
        </View>
        <YStack space="$2" flex={1}>
          <Text fontSize="$5" fontWeight="bold" color={colorScheme.text.primary}>
            {name}
          </Text>
          <XStack alignItems="center" space="$2">
            <Clock1 size={18} color={colorScheme.text.secondary} />
            <Text fontSize="$3" color={colorScheme.text.secondary}>
              {format(new Date(startDateTime), 'PPp')}
            </Text>
          </XStack>
        </YStack>
      </XStack>
    </Card>
  );
};

const DoneActivities = () => {
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { data, refetch, isLoading, isRefetching } = api.challenges.completed.useQuery(
    { page, limit: 10 },
    {
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    }
  );

  const hasNextPage = data ? data.currentPage < data.totalPages : false;

  const onRefresh = () => {
    refetch();
  };

  const onLoadMore = () => {
    if (hasNextPage && !isLoadingMore) {
      setIsLoadingMore(true);
      setPage(prevPage => prevPage + 1);
      setIsLoadingMore(false);
    }
  };

  return (
    <YStack space="$2">
      <Text fontSize="$5" fontWeight="bold" color={colorScheme.text.secondary}>Done Activities</Text>
      {data?.challenges.length === 0 && !isLoading ? (
        <Text fontSize="$4" color={colorScheme.text.secondary} textAlign="center">
          No completed activities yet.
        </Text>
      ) : (
        <FlatList
          data={data?.challenges ?? []}
          renderItem={({ item }) => <ActivityItem activity={item} />}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={onRefresh}
            />
          }
          onEndReached={onLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isLoadingMore ? (
              <ActivityIndicator size="small" color={colorScheme.primary.lightGreen} />
            ) : null
          }
        />
      )}
    </YStack>
  );
};

const Profile = () => {
  const utils = api.useUtils()
  const { mutate: updateProfile } = api.auth.update.useMutation()
  const [name, setName] = useState('');
  const user = useAppUser();
  const [seletectedIntrest, setSeletedIntrest] = useState<string[]>([])


  useEffect(() => {
     if (user && user.hasPref){
        setName(user.name ?? '')
        setSeletedIntrest(user.preference?.intrest)
     }
  }, [user])

  const handleUpdateUserProfileImg = (url: string) => {
    updateProfile({
        id: user?.id ?? '',
        image: url,
        
    }, {
        async onSuccess(){
           await  utils.auth.me.invalidate()
        },
        onError(){
            Alert.alert('Error', 'Failed to upload avatar. Please try again.');
        }
    })
  }


  const handleUpdateIntrest= (intrest: string[]) => {
    updateProfile({
      id: user?.id ?? '',
      intrest
      
  }, {
      async onSuccess(){
         await  utils.auth.me.invalidate()
      },
      onError(){
          Alert.alert('Error', 'Failed to upload avatar. Please try again.');
      }
  })
  }

  
  return (
    <ScrollView>
    <YStack flex={1} padding="$4" backgroundColor="white">
   <XStack justifyContent="space-between" alignItems="center">
     <H1 fontSize={30} fontWeight={'bold'} color={colorScheme.text.primary}>Profile</H1>
     <Pressable onPress={() => {
       // TODO: Implement menu list display logic
       Alert.alert(
         "Profile Options",
         "Choose an action",
         [
           { text: "Logout", onPress: () => {/* TODO: Implement logout */} },
           { text: "Delete Profile", onPress: () => {/* TODO: Implement profile deletion */} },
           { text: "Cancel", style: "cancel" }
         ]
       );
     }}>
       <Settings size={24} color={colorScheme.text.primary} />
     </Pressable>
   </XStack>
   <YStack marginTop="$5" gap="$4">
         <Avatar userId={user?.id ?? ''} url={user?.image ?? ''} onChange={handleUpdateUserProfileImg} />
         <XStack alignItems="flex-start" width={'100%'} flexDirection="column">
           <Text fontSize="$4" color={colorScheme.text.secondary} marginBottom="$1" alignSelf="flex-start">Name</Text>
           <Input
             value={name}
             onChangeText={(newName) => {
               setName(newName);
               debounce(() => {
                 if (newName && user?.id) {
                   updateProfile({
                     id: user.id,
                     name: newName
                   }, {
                     async onSuccess() {
                       await utils.auth.me.invalidate();
                       Keyboard.dismiss();
                     },
                     onError() {
                       Alert.alert('Error', 'Failed to update name. Please try again.');
                       Keyboard.dismiss();
                     }
                   });
                 }
               }, 500)();
             }}
             fontSize="$6"
             textAlign="left"
             color={colorScheme.secondary.darkGray}
             backgroundColor={'white'}
             borderColor={colorScheme.text.secondary}
             width="100%"
             fontWeight="bold"
             marginTop="$1"
           />
         </XStack>
    {seletectedIntrest.length > 0  &&  <InterestsList interests={activities} selectedInterests={seletectedIntrest} onUpdate={handleUpdateIntrest}  />}
    <View mt={'$2'}>
    <DoneActivities />
    </View>
   </YStack>
 </YStack>
 </ScrollView>
  );
};

export default Profile;