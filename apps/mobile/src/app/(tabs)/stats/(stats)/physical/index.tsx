import React from "react";
import { YStack } from "tamagui";
import PhysicalWrapper from "~/features/stats/physicalWrapper";

const Screen = () => {
  return (
    <YStack flex={1} >
      <PhysicalWrapper />
    </YStack>
  );
};

export default Screen;
