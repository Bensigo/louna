import type { ReactNode } from "react";
import { TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Text } from "tamagui";

import { Colors } from "~/constants/colors";

export function HeaderBackButton() {
  const router = useRouter();

  const goBack = () => router.back();
  return (
    <TouchableOpacity onPress={goBack}>
      <Ionicons name="arrow-back" size={32} color={Colors.light.tint} />
    </TouchableOpacity>
  );
}

export function HeaderTitle(props: { children: ReactNode }) {
  return <Text fontSize={"unset"}>{props.children}</Text>;
}
