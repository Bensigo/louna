// MuscleTrainingForm.tsx

import React, { useState } from 'react';
import { useForm, Controller, type SubmitHandler } from 'react-hook-form';
import { XStack, YStack, Button, Input, Text } from 'tamagui';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '~/constants/colors';

interface MuscleTrainingFormInputs {
  activityType: string;
  duration: string;
  weight: string;
  reps: string;
}

const activities = [
  { name: 'Weightlifting', icon: 'barbell' },
  { name: 'Bodyweight', icon: 'fitness' },
  { name: 'Resistance Bands', icon: 'bandage' },
  // Add more activities as needed
];

const MuscleTrainingForm: React.FC = () => {
  const { control, handleSubmit } = useForm<MuscleTrainingFormInputs>();
  const [selectedActivity, setSelectedActivity] = useState<string>('');

  const onSubmit: SubmitHandler<MuscleTrainingFormInputs> = data => {
    console.log({ ...data, activityType: selectedActivity });
  };

  return (
    <YStack space="$4" padding="$4">
      <Text fontWeight="bold" fontSize="$6" color={Colors.light.primary}>Muscle Training Activity</Text>
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
        name="weight"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Input
            placeholder="Weight"
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      <Controller
        name="reps"
        control={control}
        render={({ field: { onChange, value } }) => (
          <Input
            placeholder="Reps"
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

export default MuscleTrainingForm;
