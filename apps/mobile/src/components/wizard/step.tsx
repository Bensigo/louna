import type { ReactNode } from "react";
import React from "react";
import { YStack } from "tamagui";

interface StepProps {
  children: ReactNode;
}

const Step: React.FC<StepProps> = ({ children }) => {
  return <YStack flex={1}>{children}</YStack>;
};

export default Step;
