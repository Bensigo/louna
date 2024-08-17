import { ScrollView } from "tamagui";

import HealthCardList from "~/features/home/listHealthCards";


const HomeScreen =   () => {





  return (
    <ScrollView flex={1}>
      <HealthCardList />
    </ScrollView>
  );
};

export default HomeScreen;