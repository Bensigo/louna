import { useEffect, useState } from "react"
import { Alert, FlatList, StyleSheet, TouchableHighlight, TouchableOpacity } from "react-native"
import { useRouter } from "expo-router"
import Ionicons from "@expo/vector-icons/Ionicons"
import { styled } from "@tamagui/core"
import { useMutation } from "@tanstack/react-query"
import { Skeleton } from "moti/skeleton"
import { Button, Card, Text, XStack, YStack } from "tamagui"

import { getSuggestedActivityCategory, sampleData } from "../../api/activities"

const ScoreCircle = styled(YStack, {
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
    borderRadius: 25,
    borderWidth: 3,
})

const getColor = (score) => {
    if (score >= 60) return "#32CD32" // green
    if (score >= 40) return "#FFD700" // yellow
    return "#FF6347" // red
}

const getScoreLabel = (score) => {
    return score * 10
}

const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: "#fff", // Light beige background color
        borderRadius: 10,
        overflow: "hidden",
        marginBottom: 10,
        elevation: 3,
        marginHorizontal: 5,
        padding: 10, // Increase padding for bigger card
    },
    cardTitle: {
        fontSize: 14, // Reduced font size
        fontWeight: "bold",
        color: "#333",
    },
    cardSubtitle: {
        fontSize: 16,
        color: "#666",
    },
    scoreText: {
        fontSize: 12, // Slightly larger score text
        fontWeight: "bold",
        color: "#333", // Dark gray text color
    },
})

const ActivityCard = ({ activity, score }) => {
    const scoreLabel = getScoreLabel(score)
    
    const handleActivityPress = () => {}
 
    return (
        <>
            <TouchableOpacity onPress={handleActivityPress}>
            <Card style={styles.cardContainer}>
                <XStack alignItems="center" justifyContent="space-between" gap="$2">
                    <YStack>
                        <Text style={styles.cardTitle}>Activity </Text>
                        <Text style={styles.cardSubtitle}>{activity}</Text>
                    </YStack>
                    <XStack gap={"$2"}>
                        <ScoreCircle borderColor={getColor(scoreLabel)}>
                            <Text style={[styles.scoreText, { color: "#333" }]}>
                                {scoreLabel}
                            </Text>
                        </ScoreCircle>
                      
                    </XStack>
                </XStack>
            </Card>
            </TouchableOpacity>
          
        </>
    )
}

const LoadingSkeleton = () => (
    <Card style={styles.cardContainer}>
        <XStack gap="$4" alignItems="center">
            <YStack gap={"$0.75"}>
                <Skeleton width={100} height={20} colorMode="light" />
                <Skeleton width={150} height={20} colorMode="light" />
            </YStack>
            <Skeleton width={50} height={50} radius="round" colorMode="light" />
        </XStack>
    </Card>
)

const ActivityList = () => {
    const router = useRouter()

 
    
    const {
        mutateAsync: getActivity,
        data,
        isLoading,
    } = useMutation(getSuggestedActivityCategory, {
        onError(error) {
            console.log({ error })
            Alert.alert("Error", JSON.stringify(error))
        },
    })

    useEffect(() => {
        getActivity(sampleData)
    }, [getActivity])

    // const handleGoToDetail = (category: string) => {
    //     router.push(`today/activities/${category}`)
    // }

    const renderItem = ({ item }) => (
        <ActivityCard
            activity={(item.activity as string).replace("_", " ")}
            score={item.score}
        />
    )

  

    return (
        <YStack mt={"$3"}>
            <YStack marginBottom="$2">
                <Text fontSize="$5" fontWeight="bold" color="#333">
                    Made for you
                </Text>
                <Text fontSize="$2" color="#666">
                    Activities best for you based on your health data with score
                    ranking. press to view activities.
                </Text>
            </YStack>
            {isLoading ? (
                <FlatList
                    data={[{}, {}, {}, {}]} // Just a placeholder to show skeletons
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    renderItem={() => <LoadingSkeleton />}
                    keyExtractor={(_, index) => index.toString()}
                />
            ) : (
              <>
                  <FlatList
                    data={data}
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    renderItem={renderItem}
                    keyExtractor={(item) => item.activity}
                />
              
              </>

            )}
        </YStack>
    )
}

export { ActivityList }
