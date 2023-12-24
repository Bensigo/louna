import { type ReactNode } from "react"
import {
    SafeAreaView,
    StatusBar,
    StyleSheet,
    type ViewStyle,
} from "react-native"

interface CustomSaveAreaViewProps {
    children: ReactNode
}

const CustomSaveAreaView = ({ children }: CustomSaveAreaViewProps) => {
    return <SafeAreaView style={style.safeArea}>{children}</SafeAreaView>
}

const style = StyleSheet.create({
    safeArea: {
        marginTop: StatusBar.currentHeight || 0,
        flex: 1,
    } as ViewStyle,
})

export { CustomSaveAreaView }
