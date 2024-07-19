import { useState } from "react"
import { TouchableOpacity } from "react-native"
import { View, Text } from "tamagui"

const ReadMoreCollapsible = ({ text, len  = 100, px}: { text: string, len?: number , px?: string}) => {
    const [isCollapsed, setIsCollapsed] = useState(true)

    const toggleCollapsible = () => {
        setIsCollapsed(!isCollapsed)
    }

    return (
        <View  py="$2" px={px? px: "unset"}>
            <Text color={'#757575'} fontSize={14}>{isCollapsed ? `${text.slice(0, len)}...` : text}</Text>
            <TouchableOpacity onPress={toggleCollapsible}>
                <Text color={"$blue10"}>
                    {isCollapsed ? "Read more" : "Read less"}
                </Text>
            </TouchableOpacity>
        </View>
    )
}

export default ReadMoreCollapsible;