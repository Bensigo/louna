import { useState } from "react"
import { TouchableOpacity } from "react-native"
import { View, Text } from "tamagui"

const ReadMoreCollapsible = ({ text, len  = 100}: { text: string, len?: number }) => {
    const [isCollapsed, setIsCollapsed] = useState(true)

    const toggleCollapsible = () => {
        setIsCollapsed(!isCollapsed)
    }

    return (
        <View>
            <Text>{isCollapsed ? `${text.slice(0, len)}...` : text}</Text>
            <TouchableOpacity onPress={toggleCollapsible}>
                <Text color={"$blue10"}>
                    {isCollapsed ? "Read more" : "Read less"}
                </Text>
            </TouchableOpacity>
        </View>
    )
}

export default ReadMoreCollapsible;