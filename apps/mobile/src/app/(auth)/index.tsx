/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {  View } from "tamagui"


import { Onboarding } from "../../components/onboarding"


export default function App() {
    return (
        <View flex={1} backgroundColor={'#f5e6cf'}>
            <Onboarding />
        </View>
    )
}
