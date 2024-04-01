import React, { useState } from "react";
import { H3, View, Button, YStack } from "tamagui";
import DateTimePicker from "@react-native-community/datetimepicker";
import { CustomSaveAreaView } from "../../components/CustomSaveAreaView";
import { usePref } from "../../context/usePref";
import { useRouter } from "expo-router";


export const FITNESS_AGE_QUE = ' What is your Age?'

const QuestionOneScreen = () => {
    const router = useRouter()
    const { update, data  } = usePref()

    const [dateOfBirth, setDateOfBirth] = useState(new Date()); // Default date of birth to current date
    const [isDateSelected, setIsDateSelected] = useState(false);

    const handleDateChange = (event: any, selectedDate: Date | undefined) => {
        if (selectedDate) {
            setDateOfBirth(selectedDate);
            const age = calculateAge(selectedDate);
            if (age >= 18 ){
                setIsDateSelected(true);
            }

        }
    };

    const calculateAge = (date: Date) => {
        const diffInMs = Date.now() - date.getTime();
        const ageDate = new Date(diffInMs);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    };

    const handleNext = () => {
        update({ fitness: {  ...data?.fitness,  quetionOne: { question: FITNESS_AGE_QUE, answer: calculateAge(dateOfBirth)}}})
        router.replace('/(onboarding)/questionTwo')
    };

    return (
        <CustomSaveAreaView>
            <View flex={1} mt={20} mb={"$6"} py={"$6"} px="$3">
                <H3 fontSize={"$8"} fontWeight={"$15"}>
                   {FITNESS_AGE_QUE}
                </H3>
                <YStack flex={1} justifyContent="space-between">
                <DateTimePicker
                    value={dateOfBirth}
                    onChange={handleDateChange}
                    mode="date"
                    display="spinner"
                />
                {isDateSelected && (
                       <Button  
                       backgroundColor={"$green10"}
                       mt="$5"
                       fontWeight={"$14"}
                       height={"$5"}
                       onPress={handleNext}
                       fontSize={"$6"}
                       color={"white"}
                       pressStyle={{
                           backgroundColor: "$dda144",
                       }}
                    >Next</Button>
                )}
                </YStack>
               
            </View>
        </CustomSaveAreaView>
    );
};

export default QuestionOneScreen;
