import React, { useEffect, useState } from "react";
import { View } from "react-native";
import AppleHealthKit from "react-native-health";
import { FontAwesome5 } from "@expo/vector-icons";
import { H5, XStack, YStack, Text } from "tamagui";

import { PERMISSIONS } from "../../config/healthKit.ios";

// Assume there's a `VitalDisplay` component that standardizes the display of each vital type.
const VitalDisplay = ({ icon, iconColor, label, value }) => {
    return (
        <XStack alignItems="center" gap="$3" width={150}>
            <FontAwesome5 name={icon} size={23} color={iconColor} />
            <YStack gap="$1">
                <H5>{value || "N/A"}</H5>
                <Text fontWeight="bold">{label}</Text>
            </YStack>
        </XStack>
    );
};

const HealthVitalsCard = ({ onVitalsData }) => {
    const [hasPermissions, setHasPermissions] = useState(false);
    const [steps, setSteps] = useState<number>();
    const [heartRate, setHeartRate] = useState<number>();
    const [sleepHours, setSleepHours] = useState<number>();
    const [stressLevel, setStressLevel] = useState<number>();
    const [vo2Max, setVo2Max] = useState<number>();
    const [bloodPressure, setBloodPressure] = useState<number>();
    const [height, setHeight] = useState<number>();
    const [weight, setWeight] = useState<number>();

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
            setSteps(result.value);
        });

        // Fetch heart rate data
        AppleHealthKit.getHeartRateSamples({}, (err, result) => {
            console.log("heart rate", result);
            if (err) {
                console.log({ err });
            }
            if (result?.length > 0) {
                setHeartRate(result[0].value);
                // Calculate stress level
                const stressLevel = calculateStressLevel(result);
                setStressLevel(stressLevel);
            }
        });

        // Fetch VO2 max data
        AppleHealthKit.getVo2MaxSamples({}, (err, result) => {
            if (err) {
                console.log({ err });
            }
            if (result?.length > 0) {
                setVo2Max(result[0].value);
            }
        });

        // Fetch sleep hours data
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1); // Fetch sleep data for the past day
        AppleHealthKit.getSleepSamples(
            {
                startDate: new Date(2024, 0, 0).toISOString(), // required
                endDate: new Date().toISOString(), // optional; default now
                limit: 10, // optional; default no limit
                ascending: true, // optional; default false
            },
            (err, result) => {
                if (err) {
                    console.log({ err });
                }
                console.log({ result });
                if (result?.length > 0) {
                    // Calculate total sleep hours
                    const totalSleepHours = result.reduce((acc, curr) => {
                        return (
                            acc +
                            (curr.endDate - curr.startDate) / (1000 * 60 * 60)
                        ); // Convert milliseconds to hours
                    }, 0);
                    setSleepHours(totalSleepHours);
                }
            }
        );

        // Fetch blood pressure data
        AppleHealthKit.getBloodPressureSamples({}, (err, result) => {
            if (err) {
                console.log({ err });
            }
            if (result?.length > 0) {
                setBloodPressure(result[0].value);
            }
        });

        AppleHealthKit.getLatestHeight({}, (err, result) => {
            if (err) {
                console.log({ err });
            }
            if (result?.length > 0) {
                setHeight(result.value);
            }
        });

        AppleHealthKit.getLatestWeight({}, (err, result) => {
            if (err) {
                console.log({ err });
            }
            if (result?.length > 0) {
                setHeight(result.value);
            }
        });
    }, [hasPermissions]);

    // Calculate Stress Level
    const calculateStressLevel = (heartRateSamples: any[]) => {
        if (heartRateSamples.length < 2) {
            return null; // Not enough data to calculate stress level
        }
        const sumOfDifferences = heartRateSamples
            .slice(1)
            .reduce((acc, curr, index) => {
                return (
                    acc + Math.abs(curr.value - heartRateSamples[index].value)
                );
            }, 0);
        const averageDifference =
            sumOfDifferences / (heartRateSamples.length - 1);
        return Math.round(averageDifference * 100); // Multiply by a scaling factor for better readability
    };

    return (
        <View
            style={{
                padding: 20,
                backgroundColor: "#fff",
                borderRadius: 10,
                shadowColor: "#000",
            }}
        >
            <YStack space="$4">
                <XStack justifyContent="space-between">
                    <VitalDisplay
                        icon="heartbeat"
                        iconColor="#f05454" // Cool and matching minimalist color
                        label="Heart Rate"
                        value={heartRate}
                    />
                    <VitalDisplay
                        icon="bed"
                        iconColor="#5c5cff" // Cool and matching minimalist color
                        label="Sleep Hours"
                        value={sleepHours}
                    />
                </XStack>
                <XStack justifyContent="space-between">
                    <VitalDisplay
                        icon="tired"
                        iconColor="#41b883" // Cool and matching minimalist color
                        label="Stress Level"
                        value={stressLevel}
                    />
                    <VitalDisplay
                        icon="running"
                        iconColor="#ff9f1a" // Cool and matching minimalist color
                        label="Steps Count"
                        value={steps}
                        fontFamily="FontAwesome5"
                    />
                </XStack>
                <XStack justifyContent="space-between">
                    <VitalDisplay
                        icon="wind"
                        iconColor="#a55eea" // Cool and matching minimalist color
                        label="VO2 Max"
                        value={vo2Max}
                    />
                    <VitalDisplay
                        icon="tint"
                        iconColor="#ff6b6b" // Cool and matching minimalist color
                        label="Blood Pressure"
                        value={`${bloodPressure ? bloodPressure : "N/A"}`}
                    />
                </XStack>
                <XStack justifyContent="space-between">
                    <VitalDisplay
                        icon="female"
                        iconColor="#a55eea" // Cool and matching minimalist color
                        label="Height"
                        value={height}
                    />
                    <VitalDisplay
                        icon="weight"
                        iconColor="#ff6b6b" // Cool and matching minimalist color
                        label="Weight"
                        value={weight}
                    />
                </XStack>
            </YStack>
        </View>
    );
};

export { HealthVitalsCard };
