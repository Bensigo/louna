import type { ReactNode } from "react";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import { Button, Progress, Text, XStack, YStack } from "tamagui";

import { Colors, colorScheme } from "~/constants/colors";

interface WizardProps {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  isSubmiting: boolean;
  onPrevious: () => void;
}

const Wizard: React.FC<WizardProps> = ({
  children,
  currentStep,
  totalSteps,
  onNext,
  onPrevious,
  isSubmiting,
}) => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <YStack flex={1} justifyContent="center" alignItems="center" padding="$4">
      <Progress
        value={((currentStep + 1) / totalSteps) * 100}
        width="100%"
        height={5}
        borderRadius="$2"
        backgroundColor={"lightgray"}
        marginVertical="$4"
      >
        <Progress.Indicator
          animation={"bouncy"}
          backgroundColor={colorScheme.primary.lightGreen}
        ></Progress.Indicator>
      </Progress>
      <KeyboardAvoidingView
        style={{ flex: 1, width: "100%" }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <YStack flex={1} width="100%">
            {React.Children.toArray(children)[currentStep]}
          </YStack>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
      <XStack
        marginTop="$4"
        gap="$1"
        marginBottom={"$6"}
        justifyContent="space-between"
      >
        {currentStep > 0 && (
          <Button
            onPress={onPrevious}
            disabled={isSubmiting}
            padding="$3"
            backgroundColor={colorScheme.primary.green}
            fontWeight={"bold"}
            minWidth={170}
            color={"white"}
          >
            <Text  color={"white"}>Previous</Text>
          </Button>
        )}
        {currentStep < totalSteps - 1 && (
          <Button
            onPress={onNext}
            backgroundColor={colorScheme.primary.green}
            color={"white"}
            fontWeight={700}
            fontSize={18}
            minWidth={170}
            padding="$3"
          >
            <Text  color={"white"}>Next</Text>
          </Button>
        )}
        {currentStep === totalSteps - 1 && (
          <Button
            onPress={onNext}
            backgroundColor={colorScheme.primary.green}
            color={"black"}
            disabled={isSubmiting}
            fontWeight={700}
            fontSize={18}
            minWidth={170}
            padding="$3"
          >
            {isSubmiting ? (
              <ActivityIndicator size="small" />
            ) : (
              <Text  color={"white"}>Finish</Text>
            )}
          </Button>
        )}
      </XStack>
    </YStack>
  );
};

export default Wizard;
