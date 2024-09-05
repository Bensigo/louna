import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, TouchableWithoutFeedback, Keyboard, TextInput } from 'react-native';
import { View, YStack, XStack, Text, Avatar, Button, Input } from 'tamagui';
import { Send, Mic } from '@tamagui/lucide-icons';
import aiImg from '../../../assets/lounaai.png';
import { colorScheme } from '~/constants/colors';
import { useAppUser } from '~/provider/user';
import { api, trpc } from '~/utils/api';
import { TRPCClientError } from '@trpc/client';

const CoachWrapper = () => {
  const [message, setMessage] = useState('');
  const user = useAppUser()
  const [msg, setMsg] = useState('')
  const [streams, setStreams] = useState<AsyncGenerator<{ message: string | undefined; }, void, unknown> | null>(null);

  React.useEffect(() => {
    const fetchStreams = async () => {
      try {
        console.log('Fetching streams...');
        const result = await trpc.coach.chat.chat.query();
        console.log('Streams fetched:', result);
        setStreams(result);
      } catch (error) {
        if (error instanceof TRPCClientError) {
          console.error('TRPC Client Error:', error.message);
          console.error('Error data:', error.data);
        } else {
          console.error('Unexpected error:', error);
        }
      }
    };
    void fetchStreams();
  }, []);
 
  React.useEffect(() => {
    console.log({ streams })
    const processStreams = async () => {
      if (streams) {
        for await (const chunk of streams) {
          console.log({ chunk });
          setMsg(prev => prev + (chunk.message || ''));
        }
      }
    };
    void processStreams();
  }, [streams]);

 

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
              <Text>{msg}</Text>
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
