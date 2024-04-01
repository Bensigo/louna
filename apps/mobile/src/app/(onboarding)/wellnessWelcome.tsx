import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ImageBackground } from "react-native";
import { Button, H4, Text, View, YStack, useWindowDimensions } from "tamagui";


const communityImg = require('../../../assets/yoga-woman.jpg')


const OnboardingWellnessWelcomeScreen = () => {
     const { replace } = useRouter()
    const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = useWindowDimensions();
  const handlePress = () => {
  // go to oboarding questions
     replace('/(onboarding)/questionTen')
     
  }

  return (
    <View  flex={1} style={{ width: SCREEN_WIDTH}}  bg={"#f5e6cf"}>
      <YStack >
       
      <ImageBackground
          source={communityImg}
          style={{
            height: SCREEN_HEIGHT * 0.60,
            width: SCREEN_WIDTH,
            position: "relative",
          }}
        ></ImageBackground>
      <LinearGradient
          colors={["transparent", "#f5e6cf"]}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: SCREEN_HEIGHT * 0.60,
          }}
        />
      
      <View paddingHorizontal="$4" paddingTop={4}  alignItems="center" >
          <H4 color="black" fontWeight={"$7"}>Personalize your wellness</H4>
          <Text color="black" textAlign="center" fontWeight={'$10'} lineHeight={18}>
          Welcome to Solu! 🌟 We&lsquo;re thrilled to have you join our family of health and wellness enthusiasts. Get ready to embark on a journey towards a healthier, happier you with personalized content and support tailored just for you. Let&lsquo;s achieve your wellness goals together! 💪
          </Text>
    </View>
    <View  paddingHorizontal="$4" paddingTop={'$4'} >
    <Button  
       backgroundColor={"$green10"}
       fontWeight={"$14"}
       height={"$5"}
       onPress={handlePress}
       fontSize={"$6"}
       color={"white"}
       pressStyle={{
           backgroundColor: "$dda144",
       }}
    >wellness Setup</Button>

    </View>
   
      </YStack>
    </View>
  );
}


export default OnboardingWellnessWelcomeScreen;