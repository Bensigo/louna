import React, { useState, useEffect } from 'react';
import { View, Text, YStack, Image, H1, XStack, Input, debounce, ScrollView } from 'tamagui';
import { decode } from 'base64-arraybuffer'
import * as ImagePicker from 'expo-image-picker';
import { colorScheme } from '~/constants/colors';
import  activities from '~/constants/activities';
import { Edit3 } from '@tamagui/lucide-icons';
import { api } from '~/utils/api';
import { useAppUser } from '~/provider/user';
import { supabase } from '~/utils/supabase';
import { Alert, Keyboard, Pressable } from 'react-native';
import Pill from '~/components/pill';

interface AvatarProps {
  url?: string;
  onChange: (newUrl: string) => void;
  userId: string
}

const Avatar: React.FC<AvatarProps> = ({ url, onChange, userId }) => {
  const [imgUrl, setImageUrl] = useState(url)
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
          source={{ uri: imgUrl || 'https://via.placeholder.com/150' }}
          width={120}
          height={120}
          borderRadius={60}
        />
        <View position="absolute" bottom={0} right={0} backgroundColor="white" borderRadius={15} padding={5}>
          <Edit3 size={20} color={colorScheme.primary.lightGreen} />
        </View>
          </View>
      </View>
    </Pressable>
  );
};

const InterestTag = ({ name }: { name: string }) => (
  <View backgroundColor={colorScheme.primary.lightGreen} paddingHorizontal="$2" paddingVertical="$1" borderRadius="$4">
    <Text color="white">{name}</Text>
  </View>
);

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
      <Text fontSize="$5" fontWeight="bold" color={colorScheme.text.primary}>Interests</Text>
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

const ActivityItem = ({ name, startTime, endTime }: { name: string; startTime: string; endTime: string }) => (
  <XStack space="$2" alignItems="center">
    <Image source={{ uri: 'https://via.placeholder.com/60x60' }} width={60} height={60} />
    <YStack>
      <Text fontSize="$4" fontWeight="bold" color={colorScheme.text.primary}>{name}</Text>
      <Text fontSize="$3" color={colorScheme.text.secondary}>Start Time: {startTime}</Text>
      <Text fontSize="$3" color={colorScheme.text.secondary}>End Time: {endTime}</Text>
    </YStack>
  </XStack>
);

const DoneActivities = ({ activities }: { activities: Array<{ name: string; startTime: string; endTime: string }> }) => (
  <YStack space="$2">
    <Text fontSize="$5" fontWeight="bold" color={colorScheme.text.primary}>Done Activities</Text>
    <YStack space="$2">
      {activities.map((activity, index) => (
        <ActivityItem key={index} {...activity} />
      ))}
    </YStack>
  </YStack>
);

const Profile = () => {
  const utils = api.useUtils()
  const { mutate: updateProfile, isLoading } = api.auth.update.useMutation()
  const [name, setName] = useState('');
  const user = useAppUser();
  const [seletectedIntrest, setSeletedIntrest] = useState([])

  // Mock data for interests and activities
 
  const doneActivities = [
    { name: 'Activity Name', startTime: '10:00 AM', endTime: '11:00 AM' },
    { name: 'Activity Name', startTime: '1:00 PM', endTime: '2:00 PM' },
  ];


  useState(() => {
     if (user && user.hasPref){
        setName(user.name)
        setSeletedIntrest(user.preference?.intrest)
     }
  }, [user])

  const handleUpdateUserProfileImg = (url: string) => {
    updateProfile({
        id: user?.id,
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
      id: user?.id,
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
    <H1 fontSize={30} fontWeight={'bold'} color={colorScheme.text.primary}> Profile</H1>
   <YStack mt={'$5' } gap={'$3'}>
         <Avatar userId={user?.id ?? ''} url={user?.image ?? ''} onChange={handleUpdateUserProfileImg} />
         <XStack alignItems="flex-start" width={'100%'} flexDirection="column">
           <Text fontSize="$4" color={colorScheme.text.primary} marginBottom="$1" alignSelf="flex-start">Name</Text>
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
                       await api.auth.me.invalidate();
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
             width="100%"
             fontWeight="bold"
             marginTop="$1"
           />
         </XStack>
     <InterestsList interests={activities} selectedInterests={seletectedIntrest} onUpdate={handleUpdateIntrest}  />
   </YStack>
 </YStack>
 </ScrollView>
  );
};

export default Profile;