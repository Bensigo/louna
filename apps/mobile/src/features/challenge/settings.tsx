import React, { useState } from "react";
import { View, Text, Button, Input, YStack, XStack } from "tamagui";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Colors, colorScheme } from "~/constants/colors";
import { Cog, Trash } from "@tamagui/lucide-icons";
import { api } from "~/utils/api";
import { ActivityIndicator, Alert } from "react-native";
import { router } from "expo-router";

interface ChallengeSettingsProps {
    id: string;
    endDate: string;
    startDate: string
}

const ChallengeSettings: React.FC<ChallengeSettingsProps> = ({ id, startDate: start, endDate: end }) => {
    const [startDate, setStartDate] = useState(new Date(start ?? new Date()));
    const [endDate, setEndDate] = useState(new Date( end?? new Date()));
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);


    const utils = api.useUtils()

    const { mutate: updateChallenge} = api.challenges.update.useMutation()
    const { mutate: deleteChallenge, isLoading } = api.challenges.delete.useMutation()


    const handleStartChange = (event: Event, selectedDate?: Date) => {
        setShowStartPicker(false);
        if (selectedDate) {
            setStartDate(selectedDate);
            updateChallenge({
                id,
                startDateTime: selectedDate
            }, {
                onError(err: Error) {
                    Alert.alert('Error', err.message);
                },
                onSuccess(){
                    utils.challenges.get.invalidate()
                }
            });
        }
    };

    const handleEndChange = (event: Event, selectedDate?: Date) => {
        setShowEndPicker(false);
        if (selectedDate) {
            if (selectedDate > startDate) {
                setEndDate(selectedDate);
                updateChallenge({
                    id,
                    endDateTime: selectedDate
                }, {
                    onError(err: Error){
                        Alert.alert('Error', err.message)
                    },
                    onSuccess(){
                        utils.challenges.get.invalidate()
                    }
                })
            } else {
                Alert.alert('Error', 'End date must be after start date')
            }
        }
    };




    const handleDeleteChallenge = () => {
        deleteChallenge({ id }, {
            onError(err: Error){
                Alert.alert('Error', err.message)
            },
            onSuccess(){
                utils.challenges.get.invalidate()
                router.push('/(tabs)/challenges/(tabs)/created')
            }
        })
    }



    return (
        <YStack flex={1} padding="$4" mt={60} gap="$4">
            <XStack gap='$1' alignItems="center">
                 <Text fontSize="$5" fontWeight="bold" color={colorScheme.secondary.darkGray}>Configuration</Text>
                    <Cog size={17} color={colorScheme.text.secondary}/>
           </XStack>
            <XStack gap="$2" alignItems="center">
                <Text color={colorScheme.text.secondary}>Start:</Text>
                <Input
                    flex={1}
                    value={startDate.toLocaleString()}
                    onPressIn={() => setShowStartPicker(true)}
                />
            </XStack>
            {showStartPicker && (
                <DateTimePicker
                    value={startDate}
                    mode="datetime"
                    onChange={handleStartChange}
                />
            )}

            <XStack space="$2" alignItems="center">
                <Text color={colorScheme.text.secondary}>End:</Text>
                <Input
                    flex={1}
                    value={endDate.toLocaleString()}
                    onPressIn={() => setShowEndPicker(true)}
                />
            </XStack>
            {showEndPicker && (
                <DateTimePicker
                    value={endDate}
                    mode="datetime"
                    onChange={handleEndChange}
                />
            )}

            <View height={1} backgroundColor={Colors.light.text} marginVertical="$4" />

           <XStack gap='$1' alignItems="center">
                 <Text fontSize="$5" fontWeight="bold" color={colorScheme.secondary.darkGray}>Danger Zone</Text>
                    <Trash size={17} color={colorScheme.text.secondary}/>
           </XStack>

            <Button
                backgroundColor={colorScheme.accent.red}
                color="white"
                onPress={handleDeleteChallenge}
            >
               {isLoading ? <ActivityIndicator size={'small'} /> :  "Delete Challenge"}
            </Button>
        </YStack>
    );
};

export default ChallengeSettings;