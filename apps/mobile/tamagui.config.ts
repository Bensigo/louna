// the v2 config imports the css driver on web and react-native on native

// for reanimated: @tamagui/config/v2-reanimated

// for react-native only: @tamagui/config/v2-native

import { createAnimations } from "@tamagui/animations-react-native"
import { config } from "@tamagui/config/v2"
import { createTamagui } from "tamagui"

const animations = createAnimations({
    bouncy: {
        type: "spring",
        damping: 10,
        mass: 0.9,
        stiffness: 100,
    },
    lazy: {
        type: "spring",
        damping: 20,
        stiffness: 60,
    },
    quick: {
        type: "spring",
        damping: 20,
        mass: 1.2,
        stiffness: 250,
    },
})

const tamaguiConfig = createTamagui({
    ...config,
    animations,
})
// this makes typescript properly type everything based on the config

type Conf = typeof tamaguiConfig

declare module "tamagui" {
    interface TamaguiCustomConfig extends Conf {}
}
export default tamaguiConfig
// depending on if you chose tamagui, @tamagui/core, or @tamagui/web

// be sure the import and declare module lines both use that same name
