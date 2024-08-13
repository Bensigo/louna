import React, { useImperativeHandle, useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import {
  Button,
  H3,
  Input,
  Label,
  RadioGroup,
  Text,
  XStack,
  YStack,
} from "tamagui";
import { z } from "zod";

import { LocationSearch } from "~/components/locationSearch";
import Pill from "~/components/pill";
import activities from "~/constants/activities";
import { Colors } from "~/constants/colors";

const schema = z.object({
  locationName: z.string().optional(),
  locationLat: z.number().optional(),
  locationLng: z.number().optional(),
  activities: z.array(z.string()).min(1, "At least one activity is required"),
});

export type FormData = z.infer<typeof schema>;

interface AdditionalDetailsFormProps {
  onSubmit: (data: FormData) => void;
  defaultValues?: FormData;
  formRef?: React.RefObject<{ submit: () => void }>;
}

export function RadioGroupItemWithLabel(props: {
  size: SizeTokens;
  value: string;
  label: string;
}) {
  const id = `radiogroup-${props.value}`;
  return (
    <XStack alignItems="center" gap="$4">
      <RadioGroup.Item value={props.value} id={id} size={props.size}>
        <RadioGroup.Indicator />
      </RadioGroup.Item>
      <Label size={props.size} htmlFor={id}>
        {props.label}
      </Label>
    </XStack>
  );
}

export const AdditionalDetailsForm: React.FC<AdditionalDetailsFormProps> = ({
  onSubmit,
  defaultValues = {},
  formRef,
}) => {
  const [showMore, setShowMore] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      ...defaultValues,
      activities: defaultValues.activities || [],
    },
  });

  const handleLocationSelect = (location: {
    title: string;
    position: { lat: number; lng: number };
  }) => {
    setValue("locationName", location.title);
    setValue("locationLat", location.position.lat);
    setValue("locationLng", location.position.lng);
  };

  const submitButtonRef = useRef(null);

  // Expose submit method to parent via ref
  useImperativeHandle(formRef, () => ({
    submit: () => {
      handleSubmit(onSubmit)();
    },
  }));

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <YStack gap="$4" padding="$4">
        <H3>Additional Details</H3>
        {/* Location Search */}

        {/* Activities */}
        <Controller
          name="activities"
          control={control}
          render={({ field: { value, onChange }, formState: { errors } }) => (
            <View>
              <Text>Activities</Text>
              <Text fontSize={"$2"} color={Colors.light.tint}>
                Select one or more activities
              </Text>
              {errors.activities && (
                <Text marginVertical={"$2"} fontSize={10} color="$red10">
                  {errors.activities.message}
                </Text>
              )}
              <FlatList
                data={activities.slice(0, showMore ? activities.length : 10)}
                keyExtractor={(item, i) => item + i}
                extraData={value}
                numColumns={3}
                renderItem={({ item: activity }) => (
                  <Pill
                    onPress={() => {
                      const newActivities = value.includes(activity)
                        ? value.filter((a) => a !== activity)
                        : [...value, activity];
                      onChange(newActivities);
                    }}
                    bg={value.includes(activity) ? Colors.light.primary : "white"}
                    style={{ margin: 4 }}
                  >
                    {activity}
                  </Pill>
                )}
              />
              {activities.length > 10 && (
                <TouchableOpacity onPress={() => setShowMore(!showMore)}>
                  <Text style={{ color: Colors.light.tint }}>
                    {showMore ? "See Less" : "See More"}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />

        <View>
          <LocationSearch onLocationSelect={handleLocationSelect} />
        </View>

        <TouchableOpacity
          ref={submitButtonRef}
          style={{ display: "none" }}
          onPress={() => {
            void handleSubmit(onSubmit)();
          }}
        />
      </YStack>
    </KeyboardAvoidingView>
  );
};
