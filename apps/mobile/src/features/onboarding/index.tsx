import React, { useState } from "react";
import { WheelPicker } from "react-native-wheel-pick";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Check } from "@tamagui/lucide-icons";
import { Controller, useForm } from "react-hook-form";
import { Checkbox, Input, Text, View, XStack, YStack } from "tamagui";

import Pill from "~/components/pill";
import Wizard from "~/components/wizard";
import Step from "~/components/wizard/step";
import activities from "~/constants/activities";
import { colorScheme } from "~/constants/colors";
import { api } from "~/utils/api";
import { Alert } from "react-native";
import { router } from "expo-router";

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 6;


  const { mutate , isLoading } = api.preference.create.useMutation()

  const { control, handleSubmit, getValues, setError, clearErrors } = useForm({
    defaultValues: {
      username: "",
      age: new Date(),
      height: "",
      weight: "",
      interests: [],
      healthDataConsent: false,
    },
  });




  const onSubmit = (data: {
    username: string;
    age: Date;
    height: string;
    weight: string;
    interests: string[];
    healthDataConsent: boolean;
  }) => {
    console.log(data);
    // Handle form submission
    mutate({
      username: data.username,
      age: data.age,
      height: data.height,
      weight: data.weight,
      intrest: data.interests,
      isHealthKitAuthorize: data.healthDataConsent
    }, {
          onSuccess(){
            router.push('/(tabs)/home')
          },
          onError(error){
            Alert.alert('Error', error.message)
          }
    })
  };

  const handleNext = () => {
    const isValid = validateCurrentStep();

    if (isValid && currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    }else {
      // If on the last step, call handleSubmit with onSubmit
     void  handleSubmit(onSubmit)();
    }
  };

  const validateCurrentStep = () => {
    const values = getValues();
    let isValid = false;

    switch (currentStep) {
      case 0:
        isValid = !!values.username;
        if (!isValid)
          setError("username", {
            type: "manual",
            message: "Username is required",
          });
        break;
      case 1:
        isValid = !!values.age;
        if (!isValid)
          setError("age", { type: "manual", message: "Age is required" });
        break;
      case 2:
        isValid = !!values.height;
        if (!isValid)
          setError("height", { type: "manual", message: "Height is required" });
        break;
      case 3:
        isValid = !!values.weight;
        if (!isValid)
          setError("weight", { type: "manual", message: "Weight is required" });
        break;
      case 4:
        isValid = values.interests.length > 0;
        if (!isValid)
          setError("interests", {
            type: "manual",
            message: "Select at least one interest",
          });
        break;
      case 5:
        isValid = values.healthDataConsent;
        if (!isValid)
          setError("healthDataConsent", {
            type: "manual",
            message: "You must agree to share health data",
          });
        break;
      default:
        isValid = true;
    }

    if (isValid) {
      clearErrors();
    }

    return isValid;
  };

  const handlePrev = () => {
    if (currentStep < totalSteps - 1 && currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // const heightOptions = Array.from({ length: 121 }, (_, i) =>
  //   (i + 100).toString(),
  // );

  return (
    <View flex={1}>
      <Wizard
        isSubmiting={false}
        currentStep={currentStep}
        totalSteps={totalSteps}
        onNext={handleNext}
        onPrevious={handlePrev}
      >
        <Step>
          <Controller
            name="username"
            control={control}
            rules={{ required: "Username is required" }}
            render={({
              field: { onChange, onBlur, value },
              fieldState: { error },
            }) => (
              <View flex={1} justifyContent="center">
                <YStack gap={"$1"}>
                  <Text fontSize={24} color={colorScheme.text.secondary}>
                    What's your name?
                  </Text>
                  <Input
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    borderWidth={0}
                    placeholder="John Doe"
                  />

                  {error && (
                    <Text color={colorScheme.accent.red}>{error.message}</Text>
                  )}
                </YStack>
              </View>
            )}
          />
        </Step>

        <Step>
          <Controller
            name="age"
            control={control}
            rules={{
              required: "Age is required",
              pattern: {
                value: /^\d+$/,
                message: "Please enter a valid number",
              },
            }}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <View flex={1} justifyContent="center">
                <YStack gap={"$1"}>
                  <Text fontSize={24} color={colorScheme.text.secondary}>
                    What's your age?
                  </Text>

                  <DateTimePicker
                    value={value}
                    mode="date"
                    accentColor={colorScheme.primary.green}
                    textColor={colorScheme.text.secondary}
                    display="spinner"
                    onChange={(event, selectedDate) => {
                      onChange(selectedDate);
                    }}
                  />
                  {error && <Text color="red">{error.message}</Text>}
                </YStack>
              </View>
            )}
          />
        </Step>
        <Step>
          <Controller
            name="height"
            control={control}
            rules={{
              required: "Height is required",
              min: {
                value: 150,
                message: "Height must be at least 0 cm",
              },
              max: {
                value: 200,
                message: "Height must be at most 200 cm",
              },
            }}
            render={({
              field: { value, onBlur, onChange },
              fieldState: { error },
            }) => (
              <View flex={1} justifyContent="center">
                <YStack gap={"$1"}>
                  <Text fontSize={24} color={colorScheme.text.secondary}>
                    Height (CM)
                  </Text>

                  <Input
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Enter your Height in CM"
                    keyboardType="numeric"
                  />

                  {error && <Text color="red">{error.message}</Text>}
                </YStack>
              </View>
            )}
          />
        </Step>

        <Step>
   
          <Controller
            name="weight"
            control={control}
            rules={{
              required: "Weight is required",
              pattern: {
                value: /^\d+$/,
                message: "Please enter a valid number",
              },
            }}
            render={({
              field: { value, onBlur, onChange },
              fieldState: { error },
            }) => (
              <View flex={1} justifyContent="center">
                <YStack gap={"$1"}>
                  <Text fontSize={24} color={colorScheme.text.secondary}>
                    Height (CM)
                  </Text>

                  <Input
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    placeholder="Enter your Weight in KG"
                    keyboardType="numeric"
                  />

                  {error && <Text color="red">{error.message}</Text>}
                </YStack>
              </View>
            )}
          />
        </Step>

        <Step>
          <Controller
            name="interests"
            control={control}
            rules={{ required: "Select at least one interest" }}
            render={({ field, fieldState: { error } }) => (
              <>
                <Text fontSize={20} color={colorScheme.text.secondary}>
                  Select list of Activities you will be intrested in.
                </Text>
                <View flexDirection="row" flexWrap="wrap">
                  {activities.map((activity) => (
                    <Pill
                      key={activity}
                      onPress={() => {
                        const updatedInterests = field.value.includes(activity)
                          ? field.value.filter((i) => i !== activity)
                          : [...field.value, activity];
                        field.onChange(updatedInterests);
                      }}
                      bg={
                        field.value.includes(activity)
                          ? colorScheme.primary.lightGreen
                          : "white"
                      }
                      color={
                        field.value.includes(activity)
                          ? "white"
                          : colorScheme.primary.lightGreen
                      }
                    >
                      <Text>{activity}</Text>
                    </Pill>
                  ))}
                </View>
                {error && <Text color="red">{error.message}</Text>}
              </>
            )}
          />
        </Step>
        <Step>
          <Controller
            name="healthDataConsent"
            control={control}
            rules={{
              required:
                "You must agree to share health data for a better experience",
            }}
            render={({ field, fieldState: { error } }) => (
              <View flex={1} justifyContent="center">
                <YStack gap="md" mt={"$3"}>
                  <Text fontSize={20} color={colorScheme.primary.lightGreen}>
                    Health Data Access
                  </Text>
                  <XStack gap="sm" alignItems="center">
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(checked)}
                      size="$5"
                      backgroundColor={field.value ? colorScheme.primary.green : 'transparent'}
                      borderColor={colorScheme.primary.green}
                    >
                      <Checkbox.Indicator>
                        <Check size={20} color="white" />
                      </Checkbox.Indicator>
                    </Checkbox>
                    <Text marginLeft={3} fontSize={12} color={colorScheme.secondary.darkGray}>
                      I agree to share my health data for a better experience
                    </Text>
                  </XStack>
                  {error && <Text color="red">{error.message}</Text>}
                </YStack>
              </View>
            )}
          />
        </Step>
      </Wizard>
    </View>
  );
};

export default Onboarding;
