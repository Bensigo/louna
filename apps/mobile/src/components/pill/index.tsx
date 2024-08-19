import React from "react";
import { Text, TouchableOpacity,  } from "react-native";
import { styled, View } from "tamagui";

import { Colors, colorScheme } from "~/constants/colors";

interface PillProps {
  children: React.ReactNode;
  onPress?: () => void;
  bg?: string;
  color?: string;
  borderColor?: string;
}

const PillContainer = styled(View, {
  borderRadius: 12,
  padding: 5,
  minWidth: 100,
  height: 35,
  alignItems: "center",
  justifyContent: "center",
  borderWidth: 1,
  flex: 1,
  margin: 4,
});

const PillText = styled(Text, {
  fontSize: "$3",
  fontWeight: "500",
});

const Pill: React.FC<PillProps> = ({
  children,
  onPress,
  bg = "white",
  color = colorScheme.text.secondary,
  borderColor =colorScheme.border.secondary
}) => {
  return (
    <PillContainer
      onPress={onPress}
      style={{
        backgroundColor: bg,
        borderColor: borderColor,
       
        
      }}
    >
      <PillText style={{ color }}>{children}</PillText>
    </PillContainer>
  );
};

export default Pill;
