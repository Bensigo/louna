// CardiovascularForm.tsx

import React, { useState } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { XStack, YStack, Button, Input, Text } from 'tamagui';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '~/constants/colors';

interface CardiovascularFormInputs {
  activityType: string;
  duration: string;
  distance: string;
  avgHeartRate: string;
}

const activities = [
  { name: 'Running', icon: 'walk' },
  { name: 'Cycling', icon: 'bicycle' },
  { name: 'Swimming', icon: 'water' },
  // Add more activities as needed
];

const CardiovascularForm: React.FC = () => {
  const { control, handleSubmit } = useForm<CardiovascularFormInputs>();
  const [selectedActivity, setSelectedActivity] = useState<string>('');

  const onSubmit: SubmitHandler<CardiovascularFormInputs> = data => {
    console.log({ ...data, activityType: selectedActivity });
  };

  return (
    <YStack space="$4" padding="$4">
      <Text fontWeight="bold" fontSize="$6" color={Colors.light.primary }>Cardiovascular Activity</Text>
      <XStack space="$4" justifyContent="space-around" alignItems="center">
        {activities.map((activity) => (
          <Button
            key={activity.name}
            onPress={() => setSelectedActivity(activity.name)}
            backgroundColor={selectedActivity === activity.name ? Colors.light.primary : '$gray6'}
          >
            <Ionicons
              name={activity.icon}
              size={30}
              color="white"
            />
            <Text color="white">{activity.name}</Text>
          </Button>
        ))}
      </XStack>
      <Controller
        name="duration"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Input
            placeholder="Duration"
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      <Controller
        name="distance"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Input
            placeholder="Distance"
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      <Controller
        name="avgHeartRate"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Input
            placeholder="Avg Heart Rate"
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      <Button onPress={handleSubmit(onSubmit)} color={'white'} backgroundColor={Colors.light.primary}>
        Save
      </Button>
    </YStack>
  );
};

export default CardiovascularForm;
