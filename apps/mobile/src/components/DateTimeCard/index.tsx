import React, { useEffect, useState } from "react"
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    useWindowDimensions,
} from "react-native"
import { addDays, format, startOfDay,  setHours } from "date-fns"
import {  YStack , ScrollView} from "tamagui"
import { Colors } from "~/constants/colors";



const DateCalendarTabs = ({ onDatePress }: { onDatePress: (date: Date) => void}) => {
    const [dates, setDates] = useState<string[]>([]);
    const [selectedDateIndex, setSelectedDateIndex] = useState(0);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const { width: DEVICE_WIDTH } = useWindowDimensions();




    useEffect(() => {
        const currentDate = startOfDay(new Date());
        const nextDays = Array.from({ length: 10 }, (_, index) =>
            format(addDays(currentDate, index), "MMM dd")
        );
        setDates(nextDays);
    }, []);

    const handleDatePress = (index: number) => {
        setSelectedDateIndex(index);
        const selectedD = addDays(startOfDay(new Date()), index);
        setSelectedDate(selectedD);
       
        const curr = setHours(selectedD, 5)
        console.log({ curr })
        onDatePress(selectedD);
    }
   


 

    return (
        <YStack >
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                width={DEVICE_WIDTH}
                flexDirection="row"
            >
                {dates.map((date, index) => (
                    <TouchableOpacity
                        key={index}
                        onPress={() => handleDatePress(index)}
                        style={[
                            styles.tab,
                            index === selectedDateIndex && { backgroundColor: Colors.light.secondray },
                        ]}
                    >
                        <Text
                            style={[
                                styles.tabText,
                                index === selectedDateIndex && { color: Colors.light.primary  },
                            ]}
                        >
                            {index === 0 ? "Today" : date}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
          
        </YStack>
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
})

export default DateCalendarTabs
