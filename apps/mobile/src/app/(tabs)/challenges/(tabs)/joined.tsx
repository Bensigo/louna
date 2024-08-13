import {  View } from "tamagui";


import { JoinedChallenges } from "~/features/challenge/joined";

const ChallengesScreen = () => {
  return( 
   <View flex={1}>
     <JoinedChallenges />
   </View>
);
};

export default ChallengesScreen;
