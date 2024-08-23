import React, { useImperativeHandle, useRef, useState } from "react";
import { TouchableOpacity } from "react-native";

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
  description: z.string().optional(),
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
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  useImperativeHandle(formRef, () => ({
    submit: async () => {
      const isValid = await trigger();
      void handleSubmit((data) => onSubmit(data, isValid))();
    },
  }));

  return (
    <Form flex={1} padding="$2">
      <YStack gap="$4">
        <H3 textAlign="center" color={colorScheme.secondary.darkGray}>
          Create a Challenge
        </H3>
        <Text textAlign="center" color={Colors.light.tint}>
          Start with the basic details
        </Text>

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
                backgroundColor={'white'}
                onBlur={onBlur}
                borderColor={colorScheme.border.secondary}
                onBlur={onBlur}
                placeholder="Challenge Name"
                color={colorScheme.text.secondary}
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
        
          render={({
            field: { onChange, value, onBlur },
            fieldState: { error },
          }) => (
            <YStack gap="$1">
              <Input
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                backgroundColor={'white'}
                borderColor={colorScheme.border.secondary}
                color={colorScheme.text.secondary}
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

        <Controller
          name="capacity"
          control={control}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <YStack gap="$1">
              <Text>Capacity (Optional)</Text>
              <Input
                value={value}
                backgroundColor={'white'}
                borderColor={colorScheme.border.secondary}
                color={colorScheme.text.secondary}
                onChangeText={onChange}
                placeholder="Capacity"
              />
              {error?.message && <Text color="$red10">{error.message}</Text>}
            </YStack>
          )}
        />

        <Controller
          name="visibility"
          control={control}
          render={({ field: { onChange, value } }) => (
            <YStack gap="$1">
              <Text>Visibility</Text>
              <RadioGroup value={value} onValueChange={onChange} >
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
          rules={{ required: "Start Time is required" }}
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <YStack gap="$1">
              <XStack alignItems="center" gap="$4">
                <Text color={colorScheme.secondary.darkGray}>Start:</Text>
                <TouchableOpacity onPress={() => setShowStartPicker(true)}>
                  <Text color={value ? colorScheme.secondary.darkGray : colorScheme.secondary.gray}>
                    {value ? value.toLocaleString() : "Select Start Time"}
                  </Text>
                </TouchableOpacity>
                </XStack>

                {showStartPicker && (
                  <DateTimePicker
                    value={value || new Date()}
                    mode="datetime"
                    accentColor={colorScheme.primary.green}
                    textColor={colorScheme.text.secondary}
                    display="default"
                    onChange={(event, selectedDate) => {
                      if (event.type === "set"){
                        onChange(selectedDate);
                        setShowEndPicker(false);
                       }
                    }}
                  />
                )}
          
              {error?.message && <Text color={Colors.error.text}>{error.message}</Text>}
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
                  <Text color={colorScheme.secondary.darkGray}>End :</Text>
                  <Text fontSize={8} color={colorScheme.secondary.darkGray}>(Optional)</Text>
                </YStack>
                <TouchableOpacity onPress={() => setShowEndPicker(true)}>
                  <Text color={value ? colorScheme.secondary.darkGray :  colorScheme.secondary.gray}>
                    {value ? value.toLocaleString() : "Select End Time"}
                  </Text>
                </TouchableOpacity>
                </XStack>
                {showEndPicker && (
                  <DateTimePicker
                    value={value || new Date()}
                    mode="datetime"
                    accentColor={colorScheme.primary.green}
                    textColor={colorScheme.text.secondary}
                    display="default"
                    onChange={(event, selectedDate) => {
                       if (event.type === "set"){
                        onChange(selectedDate);
                        setShowEndPicker(false);
                       }
                    }}
                  />
                )}
            
              {error?.message && <Text color={ colorScheme.accent.red}>{error.message}</Text>}
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