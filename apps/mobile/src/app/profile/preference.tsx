// UserPrefScreen.tsx
import React, { useEffect } from "react";
import { StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { H3, View, YStack, Text} from "tamagui";
import { useCustomTabbar } from "../../context/useCustomTabbar";
import { LeftBackButton } from "../_layout";

const prefs = [
  {
    question: "What are your fitness goals?",
    route: '/profile/pref/fitnessGoal'

  },
  {
    question: "What is your current fitness level?",
    route:  '/profile/pref/fitnessLevel'
  },
  {
    question: "Do you have any health conditions or injuries?",
    route: '/profile/pref/existingInjury'
  },
  {
    question: "Foods you dislike?",
    route: '/profile/pref/foodDislike'
  },
  {
    question: "What is your diet type?",
    route: '/profile/pref/dietPref'
  },
  {
    question: "What is your height?",
    route: '/profile/pref/height'
  },
  {
    question: "What is your weight?",
    route: '/profile/pref/weight'
  },

];

const UserPrefScreen = () => {
  const router = useRouter();
  const { hideTabBar, showTabBar } = useCustomTabbar();

  useEffect(() => {
    hideTabBar();
    return () => {
      showTabBar();
    };
  }, []);

  const handleQuestionPress = (route: string) => {
    router.push(route);
  };

  return (
    <View flex={1} px={"$4"}>
   
      <YStack flex={1} py={'$3'}>
        <FlatList
          data={prefs}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <QuestionItem
              question={item.question}
              onPress={() => handleQuestionPress(item.route)}
            />
          )}
          contentContainerStyle={styles.container}
        />
      </YStack>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
});

export default UserPrefScreen;


const QuestionItem = ({ question, onPress }) => {
    return (
      <TouchableOpacity style={questionStyle.container} onPress={onPress}>
        <Text style={questionStyle.question}>{question}</Text>
      </TouchableOpacity>
    );
  };
  
  const questionStyle = StyleSheet.create({
    container: {
      paddingVertical: 10,
      borderBottomWidth: 1,
      borderBottomColor: "#ccc",
    },
    question: {
      fontSize: 18,
    },
  });