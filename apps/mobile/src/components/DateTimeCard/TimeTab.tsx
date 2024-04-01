import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { useTheme } from "tamagui";

const TimeTab = ({ time, onPress, selected }) => {
    const theme = useTheme();
    return (
        <TouchableOpacity
            onPress={onPress}
            style={[styles.tab, selected && { backgroundColor: 'black' }]}
        >
            <Text  style={[styles.tabText, selected && { color: 'white' }]}>
                {time}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    tab: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginRight: 10,
        backgroundColor: "white",
    },
    tabText: {
        color: "black",
    },
});

export default TimeTab;
