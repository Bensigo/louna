import { useState } from "react"
import { TouchableOpacity } from "react-native"
import { View, Text } from "tamagui"

const ReadMoreCollapsible = ({ text }: { text: string }) => {
    const [isCollapsed, setIsCollapsed] = useState(true)

    const toggleCollapsible = () => {
        setIsCollapsed(!isCollapsed)
    }

    return (
        <View>
            <Text>{isCollapsed ? `${text.slice(0, 100)}...` : text}</Text>
            <TouchableOpacity onPress={toggleCollapsible}>
                <Text color={"$blue10"}>
                    {isCollapsed ? "Read more" : "Read less"}
                </Text>
            </TouchableOpacity>
        </View>
    )
}

export default ReadMoreCollapsible;