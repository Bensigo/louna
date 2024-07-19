import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import AppleHealthKit from "react-native-health";
import { ProgressCircle } from "react-native-svg-charts";
import { XStack, YStack } from "tamagui";

import { PERMISSIONS } from "../../config/healthKit.ios";
import { type RouterOutputs } from "../../utils/api";
import ReadMoreCollapsible from "../collapable";

const convertToKg = (weightInPounds: number) => {
    const kg = weightInPounds * 0.45359237;
    return Number(kg.toFixed(2)); // Returning the weight in kilograms, rounded to 2 decimal places
};

// Calculate BMR using Harris-Benedict equation
const calculateBMR = (
    weight: number,
    height: number,
    age: number,
    gender: string
) => {
    if (gender === "male") {
        return 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age;
    } else {
        return 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age;
    }
};

// Calculate TDEE based on activity level
const calculateTDEE = (bmr: number, activityLevel: string) => {
    const activityFactors = {
        sedentary: 1.2,
        lightlyActive: 1.375,
        moderatelyActive: 1.55,
        veryActive: 1.725,
        superActive: 1.9,
    };
    return bmr * activityFactors[activityLevel];
};

// Determine the color of the progress circle based on steps
const getProgressColor = (steps: number) => {
    const percentage = (steps / 10000) * 100;
    if (percentage >= 75) {
        return "#00e676"; // Green for good
    } else if (percentage >= 50) {
        return "#FFD700"; // Yellow for fair
    } else {
        return "#FF6347"; // Red for poor
    }
};

const HealthVitalsCard = ({
    lodingUserPref,
    user,
}: {
    lodingUserPref: boolean;
    user: RouterOutputs["auth"]["getProfile"];
}) => {
    const [hasPermissions, setHasPermissions] = useState(false);
    const [steps, setSteps] = useState<number>(0);
    const [previousDaySteps, setPreviousDaySteps] = useState<number>(0);
    const [caloriesBurnt, setCaloriesBurnt] = useState<number>(0);
    const [stressLevel, setStressLevel] = useState<string>();
    const [weight, setWeight] = useState<number>(0);
    const [height, setHeight] = useState<number>(0);
    const [age, setAge] = useState<number>(0);
    const [bmi, setBmi] = useState<number>(0);
    const [tdee, setTDEE] = useState<number>(1500); // Default daily calorie goal

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
            }
            setSteps(Math.round(result.value) ?? 0);
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
            }
        );

        // Fetch calories burnt data
        AppleHealthKit.getActiveEnergyBurned(
            {
                startDate: new Date().toISOString(),
            },
            (err, result) => {
                if (err) {
                    console.log({ err });
                }
                console.log(
                    { result },
                    "=========== active energy========"
                );
                setCaloriesBurnt(result[0]?.value ?? 0);
            }
        );

        // Fetch stress level data (this should be derived from heart rate variability or another relevant metric)
        AppleHealthKit.getHeartRateSamples(
            {
                startDate: new Date().toISOString(),
            },
            (err, result) => {
                if (err) {
                    console.log({ err });
                }
                console.log({ result }, "======== heart rate samples");
                const stressLevel = calculateStressLevel(result);
                setStressLevel(stressLevel);
            }
        );

        // Fetch weight data
        AppleHealthKit.getLatestWeight({}, (err, result) => {
            if (err) {
                console.log({ err });
            }
            if (result) {
                const weightInKg = convertToKg(result.value);
                setWeight(weightInKg ?? 0);
            }
        });

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
    }, [hasPermissions]);

    useEffect(() => {
        if (weight && height && !lodingUserPref) {
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
    }, [weight, height, age, previousDaySteps, lodingUserPref]);

    // Calculate Stress Level
    const calculateStressLevel = (heartRateSamples: any[]) => {
        if (heartRateSamples.length < 2) {
            return "Low"; // Default stress level
        }
        const sumOfDifferences = heartRateSamples.slice(1).reduce(
            (acc, curr, index) => {
                return acc + Math.abs(curr.value - heartRateSamples[index].value);
            },
            0
        );
        const averageDifference = sumOfDifferences / (heartRateSamples.length - 1);
        if (averageDifference > 10) return "High";
        if (averageDifference > 5) return "Medium";
        return "Low";
    };

    // Determine activity level based on previous day's steps
    const determineActivityLevel = (steps: number) => {
        if (steps < 5000) return "sedentary";
        if (steps < 7500) return "lightlyActive";
        if (steps < 10000) return "moderatelyActive";
        if (steps < 12500) return "veryActive";
        return "superActive";
    };

    const weightLossRecommendation = () => {
        if (bmi == 0) return "";
        const weightToLoss = ((bmi - 24.9) * 0.5).toFixed(2);
        console.log({ weightToLoss, bmi });
        if (bmi < 18.5) return "You are underweight. Consider gaining weight.";
        if (bmi >= 18.5 && bmi <= 24.9) return "You are at a healthy weight.";
        if (bmi >= 25)
            return `You should lose ${weightToLoss} kg to reach a healthy weight.`;
    };

    return (
        <YStack>
            <Text style={styles.title}>Health Monitor Overview</Text>
            <ReadMoreCollapsible
                text={`This card provides an overview of your key health metrics including steps, calorie intake, stress level, and weight. Stay on top of your health by monitoring these vital signs regularly.`}
                len={100}
            />
            <YStack gap={"$1"}>
                <XStack gap={"$1"}>
                    <YStack style={styles.card}>
                        <YStack style={styles.progressContainer}>
                            <ProgressCircle
                                style={styles.progressCircle}
                                progress={(steps / 10000) * 1}
                                startAngle={0}
                                endAngle={100}
                                cornerRadius={50}
                                strokeWidth={8}
                                progressColor={getProgressColor(steps)}
                                backgroundColor="#fff"
                                animate
                                animateDuration={0.2}
                            />
                            <YStack style={styles.textContainer}>
                                <Text style={styles.progressText}>
                                    {steps} / 10000
                                </Text>
                            </YStack>
                        </YStack>
                        <Text style={styles.label}>Steps</Text>
                    </YStack>

                    <YStack style={styles.card}>
                        <Text style={styles.label}>Calories Intake</Text>
                        <Text style={styles.valueBig}>
                            {" "}
                            {Math.round(tdee)} Cal
                        </Text>
                        <Text style={styles.note}>
                            Max Calories intake for the day
                        </Text>
                    </YStack>
                </XStack>
                <XStack gap={"$1"}>
                    <YStack style={styles.card}>
                        <Text style={styles.label}>Stress Level</Text>
                        <Text style={styles.valueBig}>{stressLevel}</Text>
                        <Text style={styles.note}>
                            {stressLevel === "High" &&
                                "Your stress level is high. Consider taking breaks, practicing mindfulness, and ensuring you get enough sleep."}
                            {stressLevel === "Medium" &&
                                "Your stress level is moderate. It's a good idea to engage in relaxing activities and monitor your stress."}
                            {stressLevel === "Low" &&
                                "Your stress level is low. Keep up the good work maintaining a balanced lifestyle."}
                        </Text>
                    </YStack>

                    <YStack style={styles.card}>
                        <Text style={styles.label}>Weight</Text>
                        <Text style={styles.valueBig}>{weight} kg</Text>
                        <Text style={styles.note}>
                            {weightLossRecommendation()}
                        </Text>
                    </YStack>
                </XStack>
            </YStack>
        </YStack>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: "#fff",
        borderRadius: 10,
        shadowColor: "#000",
        flexDirection: "column",
        flexWrap: "wrap",
        justifyContent: "space-around",
    },
    title: {
        fontSize: 15,
        fontWeight: "bold",
    },
    description: {
        fontSize: 14,
        color: "#757575",
        marginBottom: 20,
        flexWrap: "wrap", // Ensure the text wraps properly
    },
    card: {
        overflow: "hidden",
        elevation: 3,
        backgroundColor: "#f5f5f5",
        borderRadius: 10,
        padding: 15,
        margin: 10,
        alignItems: "center",
        width: 150,
        height: 150,
    },
    label: {
        fontSize: 12,
        fontWeight: "bold",
        marginTop: 10,
    },
    value: {
        fontSize: 15,
        fontWeight: "bold",
    },
    valueBig: {
        fontSize: 18,
        fontWeight: "bold",
    },
    progressCircle: {
        height: 120,
        width: 120,
    },
    note: {
        fontSize: 9,
        color: "#757575",
        marginTop: 10,
        textAlign: "center",
    },
    progressContainer: {
        position: "relative",
        justifyContent: "center",
        alignItems: "center",
        width: 100,
        height: 100,
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
        color: "#333",
    },
});

export { HealthVitalsCard };
