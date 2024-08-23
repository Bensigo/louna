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
import { Colors, colorScheme } from "~/constants/colors";

const schema = z.object({
  locationName: z.string().optional(),
  locationLat: z.number().optional(),
  locationLng: z.number().optional(),
  activity: z.string(),
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
      <RadioGroup.Item value={props.value} id={id} size={props.size}  backgroundColor={colorScheme.border.secondary}>
        <RadioGroup.Indicator />
      </RadioGroup.Item>
      <Label size={props.size} htmlFor={id}  color={colorScheme.secondary.darkGray}>
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
      activity: defaultValues.activities[0],
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
    <ScrollView>
      <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <YStack gap="$4" padding="$4">
        <H3>Additional Details</H3>
        {/* Location Search */}
        
        <View>
          <LocationSearch onLocationSelect={handleLocationSelect} />
        </View>
        {/* Activities */}
        <Controller
          name="activity"
          control={control}
          render={({ field: { value, onChange }, formState: { errors } }) => (
            <View>
              <Text>Activities</Text>
              <Text fontSize={"$2"} color={Colors.light.tint}>
                Select an activity
              </Text>
              {errors.activity && (
                <Text marginVertical={"$2"} fontSize={10} color="$red10">
                  {errors.activity.message}
                </Text>
              )}
              <FlatList
                data={activities.slice(0, showMore ? activities.length : 10)}
                keyExtractor={(item, i) => item + i}
                extraData={value}
                numColumns={2}
                renderItem={({ item: activity }) => (
                  <Pill
                    onPress={() => {
                      // const newActivities = value.includes(activity)
                      //   ? value.filter((a) => a !== activity)
                      //   : [...value, activity];
                      onChange(activity);
                    }}
                    color={value ===(activity) ?  "white": colorScheme.secondary.gray }
                    bg={value === (activity) ? colorScheme.primary.lightGreen : "white"}
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


        <TouchableOpacity
          ref={submitButtonRef}
          style={{ display: "none" }}
          onPress={() => {
            void handleSubmit(onSubmit)();
          }}
        />
      </YStack>
    </KeyboardAvoidingView>
    </ScrollView>
  );
};
