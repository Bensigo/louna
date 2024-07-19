import { ProgressCircle } from "react-native-svg-charts";
import { Colors } from "../../constants/colors";
import { View, YStack, XStack, Text } from "tamagui";
import { useEffect, useState } from "react";
import { PERMISSIONS } from "../../config/healthKit.ios";
import AppleHealthKit from "react-native-health";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TouchableHighlight } from "react-native";
import { type RouterOutputs } from "@solu/api";
import { useRouter } from "expo-router";

const convertToKg = (weightInPounds: number): number => {
    const kg = weightInPounds * 0.45359237;
    return Number(kg.toFixed(2)); // Returning the weight in kilograms, rounded to 2 decimal places
};

function calculateBMR(weight: number, height: number, age: number): number {
    return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
}

function calculateTotalDailyCalories(weight: number, height: number, age: number, activityLevel: number): number {
    const bmr = calculateBMR(weight, height, age);
    return bmr * activityLevel;
}

// Returns the activity level based on average step count
function getActivityLevel(averageStepCount: number): number {
    if (averageStepCount < 5000) return 1.2; // Sedentary
    if (averageStepCount < 7500) return 1.375; // Lightly active
    if (averageStepCount < 10000) return 1.55; // Moderately active
    if (averageStepCount < 12500) return 1.725; // Very active
    return 1.9; // Super active
}

function getExpectedSteps(averageSteps: number, activityLevel: number): number {
    let dailyStepGoal;

    switch (activityLevel) {
        case 1.2: // Sedentary
            dailyStepGoal = 5000;
            break;
        case 1.375: // Lightly active
            dailyStepGoal = 7500;
            break;
        case 1.55: // Moderately active
            dailyStepGoal = 10000;
            break;
        case 1.725: // Very active
            dailyStepGoal = 12500;
            break;
        case 1.9: // Super active
            dailyStepGoal = 15000;
            break;
        default:
            dailyStepGoal = 10000; // Default goal
    }

    return averageSteps + ((dailyStepGoal - averageSteps) * 0.2); // Adjusting towards the daily step goal by 20%
}

export const StepCard = ({ user, maxSteps }: { user: RouterOutputs['auth']['getProfile'], maxSteps: number }) => {
    const router = useRouter()
    
    const [steps, setSteps] = useState(0);
    const [caloriesBurned, setCaloriesBurned] = useState(0);
    const [hasPermissions, setHasPermissions] = useState(false);

    useEffect(() => {
        AppleHealthKit.initHealthKit(PERMISSIONS, (err, permission) => {
            if (err) {
                console.log({ err });
                return;
            }
            console.log({ permission });
            setHasPermissions(true);
        });
    }, []);

    useEffect(() => {
        if (!hasPermissions) {
            return;
        }

        // Fetch steps data
        AppleHealthKit.getStepCount({}, (err, result) => {
            if (err) {
                console.log({ err });
                return;
            }
            setSteps(Math.round(result.value) ?? 0);
        });

        const beginningOfDay = new Date();
        beginningOfDay.setHours(0, 0, 0, 0);

        // Fetch calorie burn data
        AppleHealthKit.getActiveEnergyBurned(
            {
                startDate: beginningOfDay.toISOString(),
                endDate: new Date().toISOString()
            },
            (err, result) => {
                if (err) {
                    console.log({ err });
                    return;
                }
                console.log({ result });
                setCaloriesBurned(result[0]?.value ?? 0);
            }
        );

    }, [hasPermissions]);

    const goToStepsDetailScreen = () => {
        router.push( {
            pathname: '/today/goals/steps',
            params: {
                maxStepsCount: maxSteps,
                stepsCount: steps,
                energyBurned: caloriesBurned
            }
        })
    }

    return (
        <TouchableHighlight
            underlayColor="#e0e0e0"
            onPress={goToStepsDetailScreen}
            style={styles.card}
        >
            <YStack gap="$3">
                <XStack justifyContent="space-between" alignItems="center">
                    <Text color={Colors.light.button} fontWeight="bold" fontSize="$6">Movement</Text>
                    <Ionicons name="arrow-forward-outline" size={20} color={Colors.light.primary} />
                </XStack>
                <XStack justifyContent="space-between" alignItems="center">
                    <YStack space="$1" alignItems="flex-start">
                        <XStack gap="$2" alignItems="center">
                            <Ionicons name="walk-outline" size={24}  color={Colors.light.primary} />
                            <Text color={Colors.light.tint} fontSize="$5"> {steps} / {maxSteps}</Text>
                        </XStack>
                        <XStack mt={'$2'} gap="$2" alignItems="center">
                            <Ionicons name="flame-outline" size={24}  color={Colors.light.primary} />
                        <Text color={Colors.light.tint} fontSize="$5"> {caloriesBurned.toFixed(0)}  cal</Text>
                        </XStack>
                    </YStack>
                    <View style={styles.progressContainer}>
                        <ProgressCircle
                            style={{ height: 50, width: 50 }}
                            progress={steps / maxSteps}
                            startAngle={0}
                            endAngle={2 * Math.PI}
                            cornerRadius={50}
                            strokeWidth={7}
                            progressColor={'#00e676'}
                            backgroundColor={'#808080'}
                            animate
                            animateDuration={0.2}
                        />
                        <View style={styles.progressIconContainer}>
                            <Ionicons name="walk-outline" size={24} color="black" />
                        </View>
                    </View>
                </XStack>
            </YStack>
        </TouchableHighlight>
    );
};

export const CaloriesBurnedCard = ({ user, maxBurned }: { user: RouterOutputs['auth']['getProfile'], maxBurned: number }) => {
    const [caloriesBurned, setCaloriesBurned] = useState(0);
    const [hasPermissions, setHasPermissions] = useState(false);

    useEffect(() => {
        AppleHealthKit.initHealthKit(PERMISSIONS, (err, permission) => {
            if (err) {
                console.log({ err });
                return;
            }
            console.log({ permission });
            setHasPermissions(true);
        });
    }, []);

    useEffect(() => {
        if (!hasPermissions) {
            return;
        }

        const beginningOfDay = new Date();
        beginningOfDay.setHours(0, 0, 0, 0);

        // Fetch calorie burn data
        AppleHealthKit.getActiveEnergyBurned(
            {
                startDate: beginningOfDay.toISOString(),
                endDate: new Date().toISOString()
            },
            (err, result) => {
                if (err) {
                    console.log({ err });
                    return;
                }
                console.log({ result });
                setCaloriesBurned(result[0]?.value ?? 0);
            }
        );
    }, [hasPermissions]);

    return (
        <TouchableHighlight
            underlayColor="#e0e0e0"
            onPress={() => console.log('CaloriesBurnedCard clicked')}
            style={styles.card}
        >
            <YStack gap="$3">
                <XStack justifyContent="space-between" alignItems="center">
                    <Text color={Colors.light.button} fontWeight="bold" fontSize="$6">Energy Burned</Text>
                    <Ionicons name="arrow-forward-outline" size={20} color={Colors.light.primary} />
                </XStack>
                <XStack justifyContent="space-between" alignItems="center">
                    <YStack space="$1" alignItems="flex-start">
                        <Text color={Colors.light.tint} fontSize="$5"> {caloriesBurned.toFixed(0)} / {maxBurned} cal</Text>
                    </YStack>
                    <View style={styles.progressContainer}>
                        <ProgressCircle
                            style={{ height: 50, width: 50 }}
                            progress={caloriesBurned / maxBurned}
                            startAngle={0}
                            endAngle={2 * Math.PI}
                            cornerRadius={50}
                            strokeWidth={7}
                            progressColor={'#FFA500'}
                            backgroundColor={'#808080'}
                            animate
                            animateDuration={0.2}
                        />
                        <View style={styles.progressIconContainer}>
                            <Ionicons name="flame-outline" size={24} color="black" />
                        </View>
                    </View>
                </XStack>
            </YStack>
        </TouchableHighlight>
    );
};

const styles = StyleSheet.create({
    card: {
        overflow: "hidden",
        elevation: 3,
        backgroundColor: "#fff",
        borderRadius: 10,
        paddingVertical: 7,
        paddingHorizontal: 15,
        margin: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    progressContainer: {
        position: "relative",
        width: 70,
        height: 70,
        justifyContent: "center",
        alignItems: "center",
    },
    progressIconContainer: {
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
    },
});
