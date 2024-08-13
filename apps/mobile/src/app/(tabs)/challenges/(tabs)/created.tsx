import {  View } from "tamagui";

import { OwnedChallenges } from "~/features/challenge/owned";

const ChallengesScreen = () => {
  return( 
   <View flex={1}>
     {/* <Button elevation={5} zIndex={1000} onPress={gotoCreate} position="absolute"  backgroundColor={Colors.light.primary} size={45} icon={<Plus size={20}/>} bottom={35} right={20}/> */}
     <OwnedChallenges />
   </View>
);
};

export default ChallengesScreen;
