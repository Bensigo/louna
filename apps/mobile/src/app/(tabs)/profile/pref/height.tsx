import React, { useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { ActivityIndicator, Text, TextInput } from "react-native";
import { H3, YStack, Button, XStack, View } from "tamagui";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LeftBackButton } from "../../../_layout";

import { api } from "../../../../utils/api"
import { Alert } from "react-native"
import { useRouter } from "expo-router"

const schema = z.object({
  height: z.string().nonempty(),
  unit: z.string().nonempty(),
});

const HeightConverterScreen = () => {
  const { control, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: zodResolver(schema),
  });

  const router = useRouter()

  const { mutate, isLoading } =  api.preference.update.useMutation()

  const [convertedHeight, setConvertedHeight] = useState("");



  const unit = useWatch({ name: 'unit', control })


  const onChange = (val: string) => {
    setValue("unit", val)
  }

  const onSubmit = ({ height, unit }: { height: number, unit: string }) => {
     let heightInCm = 0
    if (unit === "cm") {
      // Convert cm to feet
      const cm = parseFloat(height);
      heightInCm = cm
      const feet = cm / 30.48; // 1 foot = 30.48 cm
      setConvertedHeight(feet.toFixed(2) + " ft");
    } else {
      // Convert feet to cm
      const feet = parseFloat(height);
      const cm = feet * 30.48; // 1 foot = 30.48 cm
      heightInCm = cm;
      setConvertedHeight(cm.toFixed(2) + " cm");
    }
    mutate({
      height: heightInCm
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
        What is your height?
      </H3>
      <YStack flex={1}>
        <XStack gap="$1" style={{ flexDirection: 'row', marginBottom: 10 }}>
          <Button
            bg="black"
            onPress={() => onChange("cm")}
            color={unit === "cm" ? "$green8" : "white"}
          >
            CM
          </Button>
          <Button
            bg="black"
            onPress={() => onChange("ft")}
            color={unit === "ft" ?  "$green8":  "white" }
          >
            FT
          </Button>
        </XStack>
        <Controller
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <View>
              <Text>Enter your height:</Text>
              <TextInput
                style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginTop: 5, marginBottom: 10, paddingHorizontal: 10 }}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType="numeric"
                placeholder="Height"
              />
              {errors.height && <Text style={{ color: 'red' }}>Height is required</Text>}
            </View>
          )}
          name="height"
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
        <Text style={{ fontSize: 20, marginTop: 20 }}>{convertedHeight}</Text>
      </YStack>
    </View>
  );
};

export default HeightConverterScreen;
