import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import { router, useNavigation } from "expo-router";
import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ChevronDown, ChevronUp } from "@tamagui/lucide-icons";
import { Controller, useForm, useFormState } from "react-hook-form";
import {
  Button,
  Input,
  Label,
  ScrollView,
  Select,
  Text,
  View,
  XStack,
  YStack,
} from "tamagui";
import { util, z } from "zod";

import Pill from "~/components/pill";
import { colorScheme } from "~/constants/colors";
import { useAppUser } from "~/provider/user";
import { api, type RouterInputs } from "~/utils/api";

const CHALLENGE_TYPES = [
  "BREATHWORK",
  "MEDITATION",
  "YOGA",
  "SOCCER",
  "BOXING",
  "RUNNING",
  "CYCLING",
  "PILATES",
  "HIKING",
  "FASTING",
];

// const CHALLENGE_TYPES = ["BREATHWORK", "MEDITATION", "YOGA", "ICE_BATH"];
// const GOAL_TYPES = ["HRV", "DURATION", "HEART_RATE", "RESTING_HEART_RATE"];
const GOAL_TYPES = ["STRESS_RELIEF", "DISTANCE","DURATION", "STEPS", "CALORIES_BURN"];

const GOAL_UNITS = {
  STRESS_RELIEF: "%(Decrease)",
  DURATION: "minutes",
  STEPS: "Steps",
  CALORIES_BURN: "Cal",
  DISTANCE: 'KM'
};

type Input = RouterInputs["challenges"]["create"];

const schema = z.object({
  title: z.string().min(1, "title is required"),
  goalValue: z.string().refine((val) => parseFloat(val)),
  start: z.date(),
  end: z.date().refine((data) => {
    const { start, end } = data;
    if (start && end && end< start) {
      return false;
    }
    return true;
  }, "End date must be after start date").optional(),
  goalType: z.enum(GOAL_TYPES as [string, ...string[]]),
  type: z.enum(CHALLENGE_TYPES as [string, ...string[]]),
});

const CreateChallenge = () => {
  const user = useAppUser();
  const { control, handleSubmit, setValue, watch, setError } = useForm<Input>({
    defaultValues: {
      title: "",
      type: undefined,
      start: undefined,
      end: undefined,
      goalType: undefined,
      goalValue: undefined,
    },
    mode: "onChange",
    resolver: zodResolver(schema),
  });

  const { isValid } = useFormState({ control });
  const navigation = useNavigation()
  const utils = api.useUtils()

  const [showDates, setShowDates] = useState(false);
  const [showGoals, setShowGoals] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const { mutate: createChallenge, isLoading } =
    api.challenges.create.useMutation();
  // const { mutate: generateImage } = api.challenges.generateImage.useMutation();

  const goalType = watch("goalType");

  const onSubmit = async (data: z.infer<typeof schema>) => {
    console.log({ data });
    if (data) {
      const tempId = `${new Date().getTime()}-${user?.id}`;
      createChallenge({
        title: data.title,
        type: data.type,
        tempId,
        start: data.start,
        end: data.end,
        goalType: data.goalType,
        goalValue: parseFloat(data?.goalValue),
      }, {
        async onSuccess(){
          // router.push("/(tabs)/challenges/");
          await utils.challenges.invalidate()
          navigation.navigate("(tabs)")
          
        },
        onError(){
          Alert.alert("Error", "Unable to create challenge ");
        }
      })
      // Promise.all([
      //   ,
      //   // generateImage({
      //   //   tempId,
      //   //   name: data.title!,
      //   // }),
      // ])
      //   .then(([createChallengeResult]) => {
      //     r
      //   })
      //   .catch((error) => {
      //     console.log({ error });
      //     Alert.alert("Error", "Unable to create challenge or generate image");
      //   });
    }
  };

  const handleStartDateChange = (onChange, date) => {
    onChange(date);
    setShowStartDatePicker(false);
    // Clear end date if it's less than the new start date
    const end = watch("end");
    if (end && end < date) {
      setValue("end", null);
    }
  };

  const handleEndDateChange = (onChange, date) => {
    onChange(date);
    setShowEndDatePicker(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
    >
      <View flex={1} padding={16}>
        <ScrollView flex={1} pt={"$5"}>
          <Text
            fontSize={24}
            fontWeight="bold"
            color={colorScheme.secondary.darkGray}
            marginBottom={16}
          >
            Create Challenge
          </Text>
          <Controller
            name="title"
            control={control}
            rules={{ required: "Title is required" }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <>
                <Label color={colorScheme.secondary.darkGray}>Title</Label>
                <Input
                  placeholder="Challenge Title"
                  color={colorScheme.secondary.darkGray}
                  value={value}
                  onChangeText={onChange}
                  backgroundColor={colorScheme.background.light}
                  marginBottom={8}
                />
                {error && <Text color="red">{error.message}</Text>}
              </>
            )}
          />

          <Text fontSize={18} fontWeight="bold" marginVertical={5}>
            Challenge Type
          </Text>
          <Controller
            name="type"
            control={control}
            rules={{ required: "Challenge type is required" }}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <>
                <Label color={colorScheme.secondary.darkGray}>
                  Challenge Type
                </Label>
                <FlatList
                  data={CHALLENGE_TYPES}
                  numColumns={3}
                  renderItem={({ item }) => (
                    <Pill
                      key={item}
                      onPress={() => {
                        console.log({ item });
                        onChange(item);
                      }}
                      bg={value === item ? colorScheme.primary.green : "white"}
                      color={
                        value === item
                          ? "white"
                          : colorScheme.secondary.darkGray
                      }
                      style={{ marginRight: 8, marginBottom: 8 }}
                    >
                      {item.replace("_", " ")}
                    </Pill>
                  )}
                 
                  showsHorizontalScrollIndicator={false}
                />
                {error && <Text color="red">{error.message}</Text>}
              </>
            )}
          />

          <XStack
            justifyContent="space-between"
            alignItems="center"
            marginVertical={16}
          >
            <Text
              color={colorScheme.text.secondary}
              fontSize={18}
              fontWeight="bold"
            >
              Dates
            </Text>
            <Button
              backgroundColor={"white"}
              icon={
                showDates ? <ChevronUp size={20} /> : <ChevronDown size={20} />
              }
              circular
              size="$2"
              pressStyle={{
                backgroundColor: "white",
              }}
              onPress={() => setShowDates(!showDates)}
            />
          </XStack>
          {showDates && (
            <YStack space={16}>
              <Controller
                name="start"
                control={control}
                rules={{
                  required: true,
                }}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <YStack>
                    <XStack justifyContent="space-between" alignItems="center">
                      <Text color={colorScheme.secondary.darkGray}>
                        Start Time:
                      </Text>
                      <Pressable onPress={() => setShowStartDatePicker(true)}>
                        <Text color={colorScheme.secondary.darkGray}>
                          {value ? value.toLocaleDateString() : "None"}
                        </Text>
                      </Pressable>
                    </XStack>
                    {showStartDatePicker && (
                      <DateTimePicker
                        value={value ?? new Date()}
                        mode="datetime"
                        display="spinner"
                        textColor={colorScheme.secondary.darkGray}
                        onChange={(_, date) =>
                          handleStartDateChange(onChange, date)
                        }
                      />
                    )}
                    {error && <Text color="red">{error.message}</Text>}
                  </YStack>
                )}
              />
              <Controller
                name="end"
                control={control}
                rules={{
                  required: true,
                }}
                render={({
                  field: { onChange, value },
                  fieldState: { error },
                }) => (
                  <YStack>
                    <XStack justifyContent="space-between" alignItems="center">
                      <Text color={colorScheme.secondary.darkGray}>
                       End Time:
                      </Text>
                      <Pressable onPress={() => setShowEndDatePicker(true)}>
                        <Text color={colorScheme.secondary.darkGray}>
                          {value ? value.toLocaleDateString() : "None"}
                        </Text>
                      </Pressable>
                    </XStack>
                    {showEndDatePicker && (
                      <DateTimePicker
                        value={value ?? new Date()}
                        mode="datetime"
                        display="spinner"
                        textColor={colorScheme.secondary.darkGray}
                        onChange={(_, date) =>
                          handleEndDateChange(onChange, date)
                        }
                      />
                    )}
                    {error && <Text color="red">{error.message}</Text>}
                  </YStack>
                )}
              />
            </YStack>
          )}

          <XStack
            justifyContent="space-between"
            alignItems="center"
            marginVertical={16}
          >
            <Text
              color={colorScheme.text.secondary}
              fontSize={18}
              fontWeight="bold"
            >
              Goal
            </Text>
            <Button
              backgroundColor={"white"}
              icon={
                showGoals ? <ChevronUp size={20} /> : <ChevronDown size={20} />
              }
              circular
              size="$2"
              onPress={() => setShowGoals(!showGoals)}
              pressStyle={{
                backgroundColor: "white",
              }}
            />
          </XStack>
          {showGoals && (
            <YStack>
              <Controller
                name="goalType"
                control={control}
                rules={{ required: "Goal type is required" }}
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => (
                  <>
                    <Label color={colorScheme.secondary.darkGray}>
                      To Track
                    </Label>
                    <FlatList
                      data={GOAL_TYPES}
                      renderItem={({ item }) => (
                        <Pill
                          key={item}
                          onPress={() => {
                            onChange(item);
                            setValue("goalValue", ""); // Reset goal value when changing type
                          }}
                          bg={
                            value === item ? colorScheme.primary.green : "white"
                          }
                          color={
                            value === item
                              ? "white"
                              : colorScheme.secondary.darkGray
                          }
                          style={{ marginRight: 8, marginBottom: 8 }}
                        >
                          {item.replaceAll("_", " ")}
                        </Pill>
                      )}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                    />
                    {error && <Text color="red">{error.message}</Text>}
                  </>
                )}
              />
              {goalType && (
                <Controller
                  name="goalValue"
                  control={control}
                  rules={{
                    required: "Goal value is required",
                    validate: (value) => {
                      const numValue = parseFloat(value);
                      return (
                        (!isNaN(numValue) && numValue > 0) ||
                        "Goal value must be a positive number"
                      );
                    },
                  }}
                  render={({
                    field: { value, onChange },
                    fieldState: { error },
                  }) => (
                    <>
                      <XStack alignItems="center" space="$2" marginTop={8}>
                        <Input
                          width={200}
                          keyboardType="numeric"
                          backgroundColor={"white"}
                          placeholder="Goal Value"
                          color={colorScheme.secondary.darkGray}
                          value={value}
                          onChangeText={onChange}
                        />
                        <Text color={colorScheme.secondary.darkGray}>
                          {GOAL_UNITS[goalType]}
                        </Text>
                      </XStack>
                      {error && <Text color="red">{error.message}</Text>}
                    </>
                  )}
                />
              )}
            </YStack>
          )}
        </ScrollView>

        <Button
          onPress={handleSubmit(onSubmit)}
          backgroundColor={colorScheme.primary.green}
          color="white"
          marginBottom={20}
          pressStyle={{
            backgroundColor: colorScheme.primary.green,
            borderColor: isValid
              ? colorScheme.primary.green
              : colorScheme.secondary.lightGray,
          }}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size={"small"} color={"white"} />
          ) : (
            "Create Challenge"
          )}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};

export default CreateChallenge;
