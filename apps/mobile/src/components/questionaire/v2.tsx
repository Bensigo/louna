import React, { useState } from "react"
import { Button, H3, Text, View, YStack } from "tamagui"

import { CustomSaveAreaView } from "../CustomSaveAreaView"

type Option = {
    title: string
    subtitle: string
}

type Question = {
    question: string
    options: Option[]
}

export type QuestionnaireProps = {
    question: Question
    isMultiSelect?: boolean
    submitButtonText?: string
    route: string
    onSave: (answer: string | string[]) => void
}

const QuestionnaireV2: React.FC<QuestionnaireProps> = ({
    question,
    isMultiSelect = false,
    onSave,
    submitButtonText,
}) => {
    const [selectedOptions, setSelectedOptions] = useState<number[]>([])

    const toggleOption = (optionIndex: number) => {
        if (isMultiSelect) {
            const selectedIndex = selectedOptions.indexOf(optionIndex)
            if (selectedIndex !== -1) {
                // Deselect the option
                setSelectedOptions((prevSelectedOptions) =>
                    prevSelectedOptions.filter(
                        (index) => index !== optionIndex,
                    ),
                )
            } else if (selectedOptions.length <= 3) {
                // Select the option if the maximum limit of 2 selections is not reached
                setSelectedOptions([...selectedOptions, optionIndex])
            }
        } else {
            setSelectedOptions([optionIndex])
            const selected = question.options[optionIndex]?.title as string
            onSave(selected)
        }
    }

    const handleBtnPress = () => {
        console.log("logged")
        const answers = selectedOptions.map(
            (selected) => question.options[selected]?.title as string,
        )
        onSave(answers)
    }

    return (
        <CustomSaveAreaView>
            <View flex={1} mt={20} mb={"$1"} px="$3">
                <H3 fontSize={"$8"} fontWeight={"$15"}>
                    {question.question}
                </H3>
                <YStack mt="$5" space="$1.5" flex={1}>
                    {question.options.map((option, optionIndex) => (
                        <Button
                            key={`${option.title}-${optionIndex}`}
                            pressTheme
                            bordered
                            size={"$6"}
                            justifyContent="flex-start"
                            backgroundColor={
                                selectedOptions.includes(optionIndex)
                                    ? "$gray1Light"
                                    : undefined
                            }
                            onPress={() => toggleOption(optionIndex)}
                        >
                            {isMultiSelect ? (
                                <YStack space={5} justifyContent="flex-start">
                                    <Text fontSize={"$5"} fontWeight={"$8"}>
                                        {option.title}
                                    </Text>
                                    <Text
                                        color={"$gray11"}
                                        fontSize={"$3"}
                                        fontWeight={"$8"}
                                    >
                                        {option.subtitle}
                                    </Text>
                                </YStack>
                            ) : (
                                <YStack space={5} >
                                    <Text
                                        fontSize={"$5"}
                                        fontWeight={"$8"}
                                        color={
                                            selectedOptions.includes(
                                                optionIndex,
                                            )
                                                ? "white"
                                                : undefined
                                        }
                                    >
                                        {option.title}
                                    </Text>
                                    <Text
                                        color={
                                            selectedOptions.includes(
                                                optionIndex,
                                            )
                                                ? "$gray7"
                                                : undefined
                                        }
                                        fontSize={"$3"}
                                        fontWeight={"$8"}
                                    >
                                        {option.subtitle}
                                    </Text>
                                </YStack>
                            )}
                        </Button>
                    ))}
                </YStack>
                {isMultiSelect &&
                    submitButtonText &&
                    selectedOptions.length >= 1 && (
                        <Button
                            backgroundColor={"$green8"}
                            mb="$2.5"
                            color="white"
                            fontSize={'$6'}
                            h={"$5"}
                            onPress={handleBtnPress}
                        >
                            {submitButtonText}
                        </Button>
                    )}
            </View>
        </CustomSaveAreaView>
    )
}

export default QuestionnaireV2
