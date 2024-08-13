import React, {  useImperativeHandle, useRef } from "react";
import {  TouchableOpacity } from "react-native";

import { zodResolver } from "@hookform/resolvers/zod";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Controller, useForm } from "react-hook-form";
import {
  Form,
  H3,
  Input,
  RadioGroup,
  Text,
  XStack,
  YStack,
} from "tamagui";
import { z } from "zod";

import { Colors, colorScheme } from "~/constants/colors";
import { useAppUser } from "~/provider/user";

import { RadioGroupItemWithLabel } from "./more";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  capacity: z.string().optional(),
  visibility: z.enum(["Public", "Private"]),
  startDateTime: z.date(),
  endDateTime: z.date().optional(),
});

export type FormData = z.infer<typeof schema>;

interface BasicInfoFormProps {
  onSubmit: (data: FormData, isValid: boolean) => void;
  formRef?: React.RefObject<{ submit: () => void }>;
  defaultValues: FormData;
}




export const BasicInfoForm: React.FC<BasicInfoFormProps> = ({
  onSubmit,
  formRef,
  defaultValues,
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const submitButtonRef = useRef(null);
  const user = useAppUser();

 

  // Expose submit method to parent via ref
  useImperativeHandle(formRef, () => ({
    submit: async () => {
      const isValid = await trigger();
      void handleSubmit((data) => onSubmit(data, isValid))();
    },
  }));



  return (
    <Form flex={1} padding="$4">
      <YStack gap="$4">
        <H3 textAlign="center">Create a Fun Challenge</H3>
        <Text textAlign="center" color={Colors.light.tint}>
          Start with the basic details
        </Text>

        {/* <Controller
          name="image"
          control={control}
          render={({ field: { onChange, value } }) => (
            <XStack alignItems="center" justifyContent="center" space="$4">
              <Pressable
                onPress={() =>
                  selectImageForUpload((value: string) => onChange(value))
                }
              >
                <Image
                  source={
                    value
                      ? { uri: value }
                      : require("../../../../../assets/placeholder.png")
                  }
                  width={120}
                  height={120}
                  borderRadius="$8"
                  borderWidth={1}
                  borderColor={Colors.light.border}
                  backgroundColor={Colors.light.placeholder}
                />
              </Pressable>
              <Text fontSize={"12px"} color={Colors.light.textSecondary}>
                {value ? "Change Avatar" : "Pick an Avatar"}
              </Text>
            </XStack>
          )}
        />
        {errors.image && (
          <Text color={Colors.light.error}>{errors.image.message}</Text>
        )} */}

        <Controller
          name="name"
          control={control}
          rules={{ required: "Name required" }}
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => (
            <YStack gap="$1">
              <Input
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Challenge Name"
                borderRadius="$4"
                padding="$2"
              />
              {error?.message && <Text color={"$red10"}>{error.message}</Text>}
            </YStack>
          )}
        />

        <Controller
          name="description"
          control={control}
          rules={{ required: "Description required" }}
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => (
            <YStack gap="$1">
              <Input
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="About the challenge"
                multiline
                numberOfLines={5}
                borderRadius="$4"
                padding="$2"
              />
              {error?.message && <Text color={"$red10"}>{error.message}</Text>}
            </YStack>
          )}
        />

        {/* Capacity */}
        <Controller
          name="capacity"
          control={control}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <YStack gap="$1">
              <Text>Capacity (Optional)</Text>
              <Input
                value={value}
                onChangeText={onChange}
                placeholder="Capacity"
              />
              {error?.message && <Text color="$red10">{error.message}</Text>}
            </YStack>
          )}
        />

        {/* Visibility */}
        <Controller
          name="visibility"
          control={control}
          render={({ field: { onChange, value } }) => (
            <YStack gap="$1">
              <Text>Visibility</Text>
              <RadioGroup value={value} onValueChange={onChange}>
                <XStack gap={"$3"}>
                  <RadioGroupItemWithLabel
                    size="$3"
                    value="Public"
                    label="Public"
                  />
                  <RadioGroupItemWithLabel
                    size="$3"
                    value="Private"
                    label="Private"
                  />
                </XStack>
              </RadioGroup>
              {errors.visibility && (
                <Text color="$red10">{errors.visibility.message}</Text>
              )}
            </YStack>
          )}
        />

        <Controller
          name="startDateTime"
          control={control}
          rules={{ required: "Start Tiime is required" }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <YStack gap="$1">
              <XStack alignItems="center" gap="$4">
                <Text>Start:</Text>
                <DateTimePicker
                  value={value}
                  mode="datetime"
                  accentColor={colorScheme.primary.green}
                  textColor={colorScheme.text.secondary}
                  display="compact"
                  onChange={(event, selectedDate) => {
                    onChange(selectedDate);
                  }}
                />
              </XStack>
              {error?.message && <Text color={"$red10"}>{error.message}</Text>}
            </YStack>
          )}
        />

        <Controller
          name="endDateTime"
          control={control}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <YStack gap="$1">
              <XStack alignItems="center" gap="$4">
                <YStack>
                  <Text>End :</Text>
                  <Text fontSize={8}>(Optional)</Text>
                </YStack>
                <DateTimePicker
                  value={value || new Date()}
                  mode="datetime"
                  accentColor={colorScheme.primary.green}
                  textColor={colorScheme.text.secondary}
                  display="default"
                  onChange={(event, selectedDate) => {
                    onChange(selectedDate);
                  }}
                />
              </XStack>
              {error?.message && <Text color={"$red10"}>{error.message}</Text>}
            </YStack>
          )}
        />
      </YStack>
      <TouchableOpacity
        ref={submitButtonRef}
        style={{ display: "none" }}
        onPress={async () => {
          const isValid = await trigger();
          void handleSubmit((data) => onSubmit(data, isValid))();
        }}
      />
    </Form>
  );
};
