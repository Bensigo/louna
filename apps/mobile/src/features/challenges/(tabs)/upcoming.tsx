
import { View } from "tamagui";


import { UpcomingChallenges } from "~/features/challenge/upcoming";

const ChallengesScreen = () => {
  return( 
   <View flex={1}>
    
     <UpcomingChallenges />
   </View>
);
};

export default ChallengesScreen;
