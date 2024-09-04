import React from "react";
import {  YStack } from "tamagui";
import StressWrapper from "~/features/stats/stressWrapper";

const Screen = () => {
  return (
    <YStack flex={1} >
      <StressWrapper />
    </YStack>
  );
};

export default Screen;


