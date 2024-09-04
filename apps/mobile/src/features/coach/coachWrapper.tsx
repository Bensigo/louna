import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard, TextInput } from 'react-native';
import { View, YStack, XStack, Text, Avatar, Button, Input } from 'tamagui';
import { Send, Mic } from '@tamagui/lucide-icons';
import aiImg from '../../../assets/lounaai.png';
import { colorScheme } from '~/constants/colors';
import { useAppUser } from '~/provider/user';

const CoachWrapper = () => {
  const [message, setMessage] = useState('');
  const user = useAppUser()

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <YStack flex={1} backgroundColor="$background">
          <XStack padding="$2" alignItems="center" space="$2">
            <Avatar circular size="$4">
              <Avatar.Image source={{ uri: aiImg }} />
              <Avatar.Fallback backgroundColor="$blue10" />
            </Avatar>
            <Text fontSize="$5" fontWeight="bold">Louna</Text>
            <View marginLeft="auto">
              <Button icon={<Mic size={30} color={colorScheme.primary.green}/>} circular transparent />
            </View>
          </XStack>
          
          <ScrollView style={{ flex: 1 }}>
            <YStack flex={1} padding="$2" space="$2">
              {/* Chat messages would go here */}
            </YStack>
          </ScrollView>
          
          <XStack padding="$2" space="$2" alignItems="center">
          <Avatar circular size="$3">
              <Avatar.Image source={{ uri: user?.image }} />
              <Avatar.Fallback backgroundColor="$gray10" />
            </Avatar>
            <Input

              style={{
                flex: 1,
                borderWidth: 1,
                color: 'white',
                borderRadius: 20,
                padding: 10,
                maxHeight: 100,
              }}
              multiline
              placeholder="Message Louna"
              value={message}
              onChangeText={setMessage}
            />
            <Button icon={<Send color={colorScheme.primary.green} />} circular />
          </XStack>
        </YStack>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default CoachWrapper;
