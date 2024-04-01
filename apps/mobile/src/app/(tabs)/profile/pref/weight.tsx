import React, { useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { ActivityIndicator, Text, TextInput } from "react-native";
import { H3, YStack, Button, XStack, View } from "tamagui";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LeftBackButton } from "../../../../app/_layout";

import { api } from "../../../../utils/api"
import { useRouter } from "expo-router"

const schema = z.object({
  weight: z.string().nonempty(),
  unit: z.string().nonempty(),
});

const WeightConverterScreen = () => {
  const { control, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(schema),
  });

  const [convertedWeight, setConvertedWeight] = useState("");


  const unit = useWatch({ name: 'unit', control })
  const router = useRouter()

  const { mutate, isLoading } =  api.preference.update.useMutation()


  const onChange = (val: string) => {
    setValue("unit", val)
  }

  const onSubmit = ({ weight, unit }: { weight: number, unit: string }) => {
    let weightInKg = 0
    if (unit === "kg") {
      // Convert kg to lbs
      const kg = parseFloat(weight);
      weightInKg = kg
      const lbs = kg * 2.20462; // 1 kg = 2.20462 lbs
      setConvertedWeight(lbs.toFixed(2) + " lbs");
    } else {
      // Convert lbs to kg
      const lbs = parseFloat(weight);
      const kg = lbs / 2.20462; // 1 lb = 0.453592 kg
      weightInKg = kg
      setConvertedWeight(kg.toFixed(2) + " kg");
    }
    mutate({
      weight: weightInKg
  }, {
      onError: (err) => {
          Alert.alert("Error", err.message, [
              {
                  text: "Ok",
                  onPress: () => {
                      console.log("close")
                  }
              }
          ])
      },
      onSuccess: () => {
          router.push("/profile/preference")
      }
  })
  };

  return (
    <View flex={1} px="$4" py={'$3'}>
      <LeftBackButton route="/profile/preference" bg="black" />  
      <H3 fontSize="$8" fontWeight="$15">
        What is your weight?
      </H3>
      <YStack flex={1}>
        <XStack gap="$1" style={{ flexDirection: 'row', marginBottom: 10 }}>
          <Button
            bg="black"
            onPress={() => onChange("kg")}
            color={unit === "kg" ? "$green8" : "white"}
          >
            KG
          </Button>
          <Button
            bg="black"
            onPress={() => onChange("lbs")}
            color={unit === "lbs" ?  "$green8":  "white" }
          >
            LBS
          </Button>
        </XStack>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <View>
              <Text>Enter your weight:</Text>
              <TextInput
                style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginTop: 5, marginBottom: 10, paddingHorizontal: 10 }}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType="numeric"
                placeholder="Weight"
              />
              {errors.weight && <Text style={{ color: 'red' }}>Weight is required</Text>}
            </View>
          )}
          name="weight"
          rules={{ required: true }}
          defaultValue=""
        />
        <Button
          bg="$green10"
          disabled={isLoading}
          onPress={handleSubmit(onSubmit)}
          mb="$2"
          color="white"
          fontSize="$6"
          h="$5"
        >
          {isLoading ? <ActivityIndicator color="white" size="small" /> : 'Save'}
        </Button>
        <Text style={{ fontSize: 20, marginTop: 20 }}>{convertedWeight}</Text>
      </YStack>
    </View>
  );
};

export default WeightConverterScreen;
