import { useState } from "react";
import { StyleSheet, TouchableHighlight, TouchableOpacity } from "react-native";
import { ProgressCircle } from "react-native-svg-charts";
import { Ionicons } from "@expo/vector-icons";
import { Text, View, XStack, YStack } from "tamagui";

import { Colors } from "../../constants/colors";
import { useRouter } from "expo-router";

type StretchingCardProps = {
    maxValue: number;
};

export const StretchingCard = ({ maxValue }: StretchingCardProps) => {
    const router = useRouter()
    const [stretchCount, setStretchCount] = useState(0);

    const incrementStretchCount = () => {
        setStretchCount((prevCount) => Math.min(prevCount + 1, maxValue));
    };

    const decrementStretchCount = () => {
        setStretchCount((prevCount) => Math.max(prevCount - 1, 0));
    };

    const goToDetailScreen = () => {
        router.push( {
            pathname: '/today/goals/flexibility',
            params: {
                maxFlexibilityCount:  maxValue,
                flexibilityCount: stretchCount
            }
        })
    }

    return (
        <TouchableHighlight
            underlayColor="#e0e0e0"
            onPress={goToDetailScreen}
            style={styles.card}
        >
            <YStack gap="$3" padding={10}>
                <XStack justifyContent="space-between" alignItems="center">
                    <Text
                        color={Colors.light.button}
                        fontWeight="bold"
                        fontSize="$6"
                    >
                        Flexibility Exercise
                    </Text>
                    <Ionicons
                        name="arrow-forward-outline"
                        size={20}
                        color={Colors.light.primary}
                    />
                </XStack>
                <XStack justifyContent="space-between" alignItems="center">
                    <YStack alignItems="flex-start">
                       
                        <XStack alignItems="center">
                            <TouchableOpacity
                                onPress={decrementStretchCount}
                                style={styles.incrementButton}
                            >
                                <Ionicons
                                    name="remove-circle-outline"
                                    size={30}
                                    color={Colors.light.primary}
                                />
                            </TouchableOpacity>
                            <Text style={styles.progressText}>
                            {stretchCount} of {maxValue}
                        </Text>
                            <TouchableOpacity
                                onPress={incrementStretchCount}
                                style={styles.incrementButton}
                            >
                                <Ionicons
                                    name="add-circle-outline"
                                    size={30}
                                    color={Colors.light.primary}
                                />
                            </TouchableOpacity>
                        </XStack>
                        {/* <Text style={styles.helpText}>
                            Stretching improves flexibility and reduces muscle tension.
                        </Text> */}
                    </YStack>
                    <View style={styles.progressContainer}>
                        <ProgressCircle
                            style={{ height: 50, width: 50 }}
                            progress={stretchCount / maxValue}
                            startAngle={0}
                            endAngle={2 * Math.PI}
                            cornerRadius={50}
                            strokeWidth={5}
                            progressColor={'#00e676'}
                            backgroundColor={"#808080"}
                            animate
                            animateDuration={0.2}
                        />
                        <View style={styles.progressIconContainer}>
                            <Ionicons name="accessibility-outline" size={24} color="black" />
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
    buttonContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    incrementButton: {
        padding: 5,
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
    progressText: {
        fontSize: 14,
        color: "#000",
        marginBottom: 5,
    },
    helpText: {
        fontSize: 11,
        color: "#757575",
        textAlign: "left",
        marginTop: 5,
        width: 200,
    },
    textContainer: {
        width: 150,
        justifyContent: "center",
    },
    arrowIcon: {
        marginLeft: 10,
    },
});
