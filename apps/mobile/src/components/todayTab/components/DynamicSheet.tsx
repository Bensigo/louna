import React, { type ReactNode } from "react"
import { Sheet } from "@tamagui/sheet"

interface DynamicSheetProps {
    visible: boolean
    onClose: () => void
    children: ReactNode
}

const DynamicSheet: React.FC<DynamicSheetProps> = ({
    visible,
    onClose,
    children,
}) => {
    return (
        <Sheet
             
            zIndex={100_000}
            animation="lazy"
            dismissOnSnapToBottom
            forceRemoveScrollEnabled={visible}
            open={visible}
        
            onOpenChange={onClose}
            snapPoints={[70, 90]}
        >
            <Sheet.Overlay
                animation="lazy"
                enterStyle={{ opacity: 0 }}
                exitStyle={{ opacity: 0 }}
            />
            <Sheet.Handle />
            <Sheet.Frame >{children}</Sheet.Frame>
        </Sheet>
    )
}

export default DynamicSheet
