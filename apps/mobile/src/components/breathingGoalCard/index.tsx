import { useEffect, useState } from "react";
import { StyleSheet, TouchableHighlight, TouchableOpacity } from "react-native";
import AppleHealthKit, { type HealthValue } from "react-native-health";
import { Ionicons } from "@expo/vector-icons";
import { Text, XStack, YStack } from "tamagui";

import { PERMISSIONS } from "../../config/healthKit.ios";
import { Colors } from "../../constants/colors";
import { useRouter } from "expo-router";

export const StressCard = ({ maxValue }: { maxValue: number }) => {
    const router = useRouter()
    const [hasPermissions, setHasPermissions] = useState(false);
    const [stressLevel, setStressLevel] = useState<string>();

    const [breathCount, setbreathCount] = useState(0);

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
        if (!hasPermissions) return;

        // Fetch stress level data
        AppleHealthKit.getHeartRateSamples(
            { startDate: new Date().toISOString() },
            (err, result) => {
                if (err) {
                    console.log({ err });
                    return;
                }
                console.log({ result }, "======== heart rate samples");
                
                setStressLevel(calculateStressLevel(result));
            }
        );
    }, [hasPermissions]);



    const calculateStressLevel = (heartRateSamples: HealthValue[]) => {
        if (heartRateSamples.length < 2) return "Low"; // Default stress level
        const sumOfDifferences = heartRateSamples.slice(1).reduce(
            (acc, curr, index) => acc + Math.abs(curr.value - heartRateSamples[index].value),
            0
        );
        const averageDifference = sumOfDifferences / (heartRateSamples.length - 1);
        if (averageDifference > 10) return "High";
        if (averageDifference > 5) return "Medium";
        return "Low";
    };

    

    const incrementbreathCount = () => {
        setbreathCount((prevCount) => Math.min(prevCount + 1, maxValue));
    };

    const decrementbreathCount = () => {
        setbreathCount((prevCount) => Math.max(prevCount - 1, 0));
    };


    const goToDetailScreen = () => {
        router.push( {
            pathname: '/today/goals/breathing',
            params: {
                breathCount,
                stressLevel,
                maxBreathCount: maxValue
            }
        })
    }
   

    return (
        <TouchableHighlight
        underlayColor="#e0e0e0"
            onPress={goToDetailScreen}
            style={styles.card}
        >
            <YStack gap="$3">
                <XStack justifyContent="space-between" alignItems="center">
                    <Text color={Colors.light.button} fontWeight="bold" fontSize="$6">Breathing Exercise</Text>
                    <Ionicons name="arrow-forward-outline" size={20} color={Colors.light.primary} />
                </XStack>
                <XStack justifyContent="space-between">
                <XStack alignItems="center">
                            <TouchableOpacity
                          
                                onPress={decrementbreathCount}
                                style={styles.incrementButton}
                            >
                                <Ionicons
                                    name="remove-circle-outline"
                                    size={30}
                                    color={Colors.light.primary}
                                />
                            </TouchableOpacity>
                            <Text style={styles.progressText}>
                            {breathCount} of {maxValue}
                        </Text>
                            <TouchableOpacity
                              
                                onPress={incrementbreathCount}
                                style={styles.incrementButton}
                            >
                                <Ionicons
                                    name="add-circle-outline"
                                    size={30}
                                    color={Colors.light.primary}
                                />
                            </TouchableOpacity>
                        </XStack>
                    <YStack gap="$1" alignItems="flex-end">
                        <Text style={styles.valueBig}>{stressLevel}</Text>
                        <Text>Stress Level</Text>
                    </YStack>
                </XStack>
            </YStack>
        </TouchableHighlight>
    );
};

const styles = StyleSheet.create({
    card: {
        overflow: "hidden",
        backgroundColor: "#fff",
        borderRadius: 10,
        paddingVertical: 7,
        paddingHorizontal: 15,
        margin: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    valueBig: {
        fontSize: 18,
        fontWeight: "bold",
    },
    note: {
        fontSize: 11,
        color: "#757575",
        marginTop: 10,
    },
    incrementButton: {
        padding: 5,
    },

  
    progressText: {
        fontSize: 14,
        color: "#000",
        marginBottom: 5,
    },
});
