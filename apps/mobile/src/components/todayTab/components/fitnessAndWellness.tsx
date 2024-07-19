import { useEffect, useState } from "react";
import { StyleSheet, ScrollView } from "react-native";
import AppleHealthKit from "react-native-health";
import { ProgressCircle } from "react-native-svg-charts";
import { Text, XStack, YStack, View } from "tamagui";
import { Colors } from '../../../constants/colors';
import ReadMoreCollapsible from "../../collapable";

import { PERMISSIONS } from "../../../config/healthKit.ios";
import { ActivityList } from "../../RecommendedActivities";

import DynamicSheet from "./DynamicSheet"
import CardiovascularForm from "./cardiovascular";
import  MuscleTrainingForm from './muscleTraining'


const getProgressColor = (steps) => {
  const percentage = (steps / 10000) * 100;
  if (percentage >= 75) {
    return "#00e676"; // Green for good
  } else if (percentage >= 50) {
    return "#FFD700"; // Yellow for fair
  } else {
    return "#FF6347"; // Red for poor
  }
};

export const FitnessAndWellnessActivity = () => {
  const [hasPermissions, setHasPermissions] = useState(false);
  const [steps, setSteps] = useState(0);
  const [stressLevel, setStressLevel] = useState<string>();

  const [sheetVisible, setSheetVisible] = useState(false)
  const [currentCategory, setCurrentCategory] = useState<'cardiovascular' | 'muscle training' | 'stress relief' | 'HIIT'>("")



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

    // Fetch stress level data
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
  }, [hasPermissions]);

  const openSheet = (category: string) => {
    setCurrentCategory(category)
    setSheetVisible(true)
}
 

  // Calculate Stress Level
  const calculateStressLevel = (heartRateSamples) => {
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


  const renderTracking = () => {
     if (currentCategory === 'cardiovascular'){
      return <CardiovascularForm />
     }
     if (currentCategory === 'muscle training'){
      return <MuscleTrainingForm />
     }
     return null;
  }

  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <XStack    >
        <YStack>
          <Text style={styles.label}>Steps</Text>
          <YStack style={styles.card}>
            <YStack style={styles.progressContainer}>
              <ProgressCircle
                style={styles.progressCircle}
                progress={(5000 / 10000) * 1}
                startAngle={0}
                endAngle={2 * Math.PI}
                cornerRadius={50}
                strokeWidth={8}
                progressColor={getProgressColor(steps)}
                backgroundColor={Colors.light.secondray}
                animate
                animateDuration={0.2}
              />
              <YStack style={styles.textContainer}>
                <Text style={styles.progressText}>
                  5000 / 10000
                </Text>
              </YStack>
            </YStack>
          </YStack>
        </YStack>
        <YStack>
          <Text style={styles.label}>HRV</Text>
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
        </YStack>
      </XStack>
      <ReadMoreCollapsible
        text={`This card provides an overview of your key health metrics including steps and stress level. Stay on top of your health by monitoring these vital signs regularly.`}
        len={100}
      
      />
       <ActivityList openSheet={openSheet}  />
     </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 10,
    backgroundColor: "#f0f0f0",
  },
  card: {
    overflow: "hidden",
    elevation: 3,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    margin: 5,
    alignItems: "center",
    width: 170,
    height: 170,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 10,
    color: "#757575",
  },
  progressCircle: {
    height: 140,
    width: 140,
  },
  progressContainer: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    width: 140,
    height: 140,
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
    fontSize: 15,
    fontWeight: "bold",
    color: Colors.light.primary,
  },
  valueBig: {
    fontSize: 18,
    fontWeight: "bold",
  },
  note: {
    fontSize: 11,
    color: "#757575",
    marginTop: 10,
    textAlign: "center",
  },
});

export default FitnessAndWellnessActivity;
