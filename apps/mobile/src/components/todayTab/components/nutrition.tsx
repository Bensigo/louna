import { useEffect, useState } from "react";
import { StyleSheet, ScrollView } from "react-native";
import AppleHealthKit from "react-native-health";
import { Text, XStack, YStack, View } from "tamagui";
import { Colors } from '../../../constants/colors';
import { PERMISSIONS } from "../../../config/healthKit.ios";
import {RecommendedRecipes} from '../../recommendedRecipes/index'
import { api } from "../../../utils/api";
import { ProgressCircle } from "react-native-svg-charts";


const convertToKg = (weightInPounds) => {
    const kg = weightInPounds * 0.45359237;
    return Number(kg.toFixed(2)); // Returning the weight in kilograms, rounded to 2 decimal places
};

// Calculate BMR using Harris-Benedict equation
const calculateBMR = (weight, height, age, gender) => {
    if (gender === "male") {
        return 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
    } else {
        return 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age;
    }
};

// Calculate TDEE based on activity level
const calculateTDEE = (bmr, activityLevel) => {
    const activityFactors = {
        sedentary: 1.2,
        lightlyActive: 1.375,
        moderatelyActive: 1.55,
        veryActive: 1.725,
        superActive: 1.9,
    };
    return bmr * activityFactors[activityLevel];
};

export const Nutrition = () => {
    const [hasPermissions, setHasPermissions] = useState(false);
    const [weight, setWeight] = useState(0);
    const [height, setHeight] = useState(0);
    const [previousDaySteps, setPreviousDaySteps] = useState(0);
    const [age, setAge] = useState(0);
    const [bmi, setBmi] = useState(0);
    const [tdee, setTDEE] = useState(1500);
    const [caloriesTaken, setCaloriesTaken] = useState(1500);

    const { data: user, isLoading } = api.auth.getProfile.useQuery();

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
        if (hasPermissions) {
            AppleHealthKit.getLatestWeight({}, (err, result) => {
                if (err) {
                    console.log({ err });
                }
                if (result) {
                    const weightInKg = convertToKg(result.value);
                    setWeight(weightInKg ?? 0);
                }
            });

            // Fetch previous day's steps data
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            AppleHealthKit.getStepCount(
                {
                    startDate: yesterday.toISOString(),
                    endDate: new Date().toISOString(),
                },
                (err, result) => {
                    if (err) {
                        console.log({ err });
                    }
                    setPreviousDaySteps(result.value ?? 0);
                },
            );

            // Fetch height data
            AppleHealthKit.getLatestHeight({}, (err, result) => {
                if (err) {
                    console.log({ err });
                }
                if (result) {
                    setHeight(result.value ?? 0);
                }
            });

            // Fetch BMI data
            AppleHealthKit.getLatestBmi({}, (err, result) => {
                if (err) {
                    console.log({ err });
                }
                if (result) {
                    setBmi(result.value ?? 0);
                }
            });

            // Fetch calories taken data
            AppleHealthKit.getActiveEnergyBurned({}, (err, result) => {
                if (err) {
                    console.log({ err });
                }
                if (result) {
                    setCaloriesTaken(result.value ?? 0);
                }
            });
        }
    }, [hasPermissions]);

    useEffect(() => {
        if (weight && height && !isLoading) {
            const bmr = calculateBMR(
                weight,
                height,
                user?.userPref?.age as number,
                "female"
            );
            const activityLevel = determineActivityLevel(previousDaySteps);
            const tdee = calculateTDEE(bmr, activityLevel); // Adjusted TDEE based on activity level
            console.log({ bmr, tdee });
            setTDEE(tdee);
        }
    }, [weight, height, age, previousDaySteps, isLoading]);

    // Determine activity level based on previous day's steps
    const determineActivityLevel = (steps) => {
        if (steps < 5000) return "sedentary";
        if (steps < 7500) return "lightlyActive";
        if (steps < 10000) return "moderatelyActive";
        if (steps < 12500) return "veryActive";
        return "superActive";
    };

    const weightLossRecommendation = () => {
        if (bmi === 0) return "";
        const weightToLose = ((bmi - 24.9) * 0.5).toFixed(2);
        console.log({ weightToLose, bmi });
        if (bmi < 18.5) return "You are underweight. Consider gaining weight.";
        if (bmi >= 18.5 && bmi <= 24.9) return "You are at a healthy weight.";
        if (bmi >= 25)
            return `You should lose ${weightToLose} kg to reach a healthy weight.`;
    };

    return (
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
            <YStack style={styles.card}>
                <XStack gap={'$4'} alignItems="center">
                    <YStack style={styles.progressContainer}>
                        <ProgressCircle
                            style={styles.progressCircle}
                            progress={(caloriesTaken / tdee) * 1}
                            startAngle={0}
                            endAngle={2 * Math.PI}
                            cornerRadius={50}
                            strokeWidth={8}
                            progressColor={Colors.light.primary}
                            backgroundColor="#fff"
                            animate
                            animateDuration={0.2}
                        />
                        <YStack style={styles.textContainer}>
                            <Text style={styles.progressText}>
                                {caloriesTaken} / {tdee.toFixed(2)}
                            </Text>
                            <Text style={styles.progressText}> calories</Text>
                        </YStack>
                    </YStack>
                    <YStack justifyContent="center" flex={1}>
                        <Text style={styles.label}>Weight</Text>
                        <Text style={styles.valueBig}>{weight} kg</Text>
                        <Text style={styles.note}>{weightLossRecommendation()}</Text>
                    </YStack>
                </XStack>
            </YStack>
            <RecommendedRecipes user={user} isUserLoading={isLoading}  />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 10,
        backgroundColor: "#f0f0f0",
    },
    card: {
        overflow: "hidden",
        elevation: 3,
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 20,
        margin: 5,
        width: '100%',
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
        justifyContent: "center",
        alignItems: "center",
        width: 150,
        height: 150,
    },
    progressCircle: {
        height: 150,
        width: 150,
    },
    textContainer: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: "center",
        alignItems: "center",
    },
    progressText: {
        fontSize: 13,
        fontWeight: "bold",
        color: Colors.light.primary,
    },
    label: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#757575",
    },
    valueBig: {
        fontSize: 18,
        fontWeight: "bold",
    },
    note: {
        fontSize: 11,
        color: "#757575",
        marginTop: 10,
     
        flexWrap: "wrap",
    },
});

export default Nutrition;
