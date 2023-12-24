import React, { useState } from "react";
import { Button, H3, Spinner, Text, View, XStack, YStack } from "tamagui";

import { CustomSaveAreaView } from "../CustomSaveAreaView";

type Option = {
  label: string;
};

type Question = {
  question: string;
  options: Option[];
};

export type QuestionnaireProps = {
  question: Question;
  isMultiSelect?: boolean;
  submitButtonText?: string;
  route: string;
  onSave: (answer: string | string[]) => void;
  isLoading?: boolean;
};

const Questionnaire: React.FC<QuestionnaireProps> = ({
  question,
  isMultiSelect = false,
  onSave,
  submitButtonText,
  isLoading,
}) => {
  const [selectedOptions, setSelectedOptions] = useState<number[]>([]);

  const toggleOption = (optionIndex: number) => {
    if (isMultiSelect) {
      const selectedIndex = selectedOptions.indexOf(optionIndex);
      if (selectedIndex !== -1) {
        // Deselect the option
        setSelectedOptions((prevSelectedOptions) =>
          prevSelectedOptions.filter((index) => index !== optionIndex)
        );
      } else if (selectedOptions.length < 2) {
        // Select the option if the maximum limit of 2 selections is not reached
        setSelectedOptions([...selectedOptions, optionIndex]);
      }
    } else {
      setSelectedOptions([optionIndex]);
      const selected = question.options[optionIndex]?.label as string;
      onSave(selected);
    }
  };

  const handleBtnPress = () => {
    console.log("logged");
    const answers = selectedOptions.map(
      (selected) => question.options[selected]?.label as string
    );
    console.log({ answers });
    onSave(answers);
  };

  return (
    <CustomSaveAreaView>
      <View flex={1} mt={20} mb={"$1"} px="$3">
        <H3 fontSize={"$8"} fontWeight={"$15"}>
          {question.question}
        </H3>
        <YStack mt="$5" space="$2" flex={1}>
          {question.options.map((option, optionIndex) => (
            <Button
              key={`${option.label}-${optionIndex}`}
              pressTheme
              bordered
              size={"$6"}
              backgroundColor={
                selectedOptions.includes(optionIndex) ? "$gray1Light" : undefined
              }
              onPress={() => toggleOption(optionIndex)}
            >
              {isMultiSelect ? (
                <Text fontSize={"$5"} fontWeight={"$8"}>
                  {option.label}
                </Text>
              ) : (
                <XStack space>
                  <Text
                    fontSize={"$5"}
                    fontWeight={"$8"}
                    color={'$gray12Light'}
                  >
                    {option.label}
                  </Text>
                  {isLoading && selectedOptions.includes(optionIndex) && (
                    <Spinner size="small" color="black" style={{ marginLeft: 5 }} />
                  )}
                </XStack>
              )}
            </Button>
          ))}
        </YStack>
        {submitButtonText && (
          <Button
            backgroundColor={"$green7"}
            mb="$2"
            color="white"
            fontSize={"$6"}
            h={"$5"}
            onPress={handleBtnPress}
          >
            {submitButtonText}
          </Button>
        )}
      </View>
    </CustomSaveAreaView>
  );
};

export default Questionnaire;
