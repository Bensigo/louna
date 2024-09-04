import { ScrollView } from "tamagui";

import HealthCardList from "~/features/analysis/listHealthCards";


const HomeScreen =   () => {





  return (
    <ScrollView flex={1}>
      <HealthCardList />
    </ScrollView>
  );
};

export default HomeScreen;