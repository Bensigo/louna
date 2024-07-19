import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { StyleSheet, TouchableHighlight, TextInput, Button, Alert, ActivityIndicator } from "react-native";
import { View, XStack, Text, Progress, YStack } from "tamagui";
import { Colors } from "../../constants/colors";
import { api } from "../../utils/api";
import { util } from "zod";

interface EditGoal {
    name: "steps" | "flexibility" | "breathing";
    currentValue: number;
    goal: number;
    message: string;
    valPercent: number;
}

export const EditGoalCard: React.FC<EditGoal> = ({ name, currentValue, goal, valPercent }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editGoal, setEditGoal] = useState(goal);

    const { mutate, isLoading } = api.goal.update.useMutation({
      
    })
    const utils = api.useUtils()

    const incrementGoal = () => {
        setEditGoal(prevGoal => prevGoal + 1);
    };

    const decrementGoal = () => {
        setEditGoal(prevGoal => (prevGoal > 0 ? prevGoal - 1 : 0));
    };

    const saveGoal = () => {
        mutate({
            value: editGoal,
            name
        }, {
            onError(err){
                Alert.alert('Error', err.message)

            },
            onSuccess(){
                utils.goal.invalidate()
                setIsEditing(false);
                Alert.alert("Success","Updated successfully")
            } 
        })
        
    };

    return (
        <View style={styles.card}>
            <XStack justifyContent="space-between" mb="$3">
                <XStack alignItems="center">
                    <Text fontSize={'$7'} fontWeight={'bold'}>{currentValue}</Text>
                    <Text> of {editGoal} {name} achieved</Text>
                </XStack>
                <TouchableHighlight onPress={() => setIsEditing(!isEditing)}>
                    <Ionicons color={Colors.light.primary} name="pencil-outline" size={20}/>
                </TouchableHighlight>
            </XStack>
            {isEditing ? (
                <YStack>
                    <XStack alignItems="center" mb="$2">
                        <TouchableHighlight onPress={decrementGoal}>
                            <Ionicons name="remove-circle-outline" size={30} color={Colors.light.primary} />
                        </TouchableHighlight>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            value={editGoal.toString()}
                            onChangeText={text => {
                                const value = parseInt(text, 10);
                                setEditGoal(isNaN(value) ? 0 : value);
                            }}
                        />
                        <TouchableHighlight onPress={incrementGoal}>
                            <Ionicons name="add-circle-outline" size={30} color={Colors.light.primary} />
                        </TouchableHighlight>
                    </XStack>
                    <Button  title="Save" onPress={saveGoal} color={Colors.light.button} >{isLoading && (
                        <ActivityIndicator size={'small'} color={Colors.light.button}/>
                    )}</Button>
                </YStack>
            ) : (
                <Progress size={'$6'} value={valPercent}  >
                    <Progress.Indicator animation="bouncy" bg={Colors.light.primary} />
                </Progress>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        overflow: "hidden",
        elevation: 3,
        backgroundColor: "#fff",
        borderRadius: 10,
        paddingVertical: 20,
        paddingHorizontal: 15,
        margin: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        justifyContent: "center",
        elevation: 5,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginHorizontal: 10,
        paddingHorizontal: 10,
        textAlign: 'center',
        width: 100,
    },
});
