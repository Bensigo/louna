import { useEffect, useState } from "react"
import { Card, Text } from "tamagui"
import  AppleHealthKit , {
  } from 'react-native-health'
import {  PERMISSIONS } from "../../config/healthKit.ios"


type HealthVitalsCard = {
    onVitalsData: (vitals: { [key:string]:  any}) => void 

}
export const HealthVitalsCard: React.FC<HealthVitalsCard> = ({ onVitalsData }) => {
    const [hasPermissions, setHasPermissions] = useState(false)
    const [steps, setSteps] = useState<number>()


    useEffect(() => {
        AppleHealthKit.initHealthKit(PERMISSIONS,(err, permission) => {
            if(err){
                console.log({err})
                return
            }
            console.log({ permission })
            setHasPermissions(true)
        })
    }, [])


    useEffect(() => {
        if (!hasPermissions){
            return;
        }
        const now = new Date().toISOString()
            AppleHealthKit.getStepCount({
                startDate: now,
            }, (err, result) => {
                if(err){
                    console.log({ err })
                }
                setSteps(result.value)
            })
    }, [hasPermissions])
    return (
        <Card>
            <Text>steps: {steps}</Text>
        </Card>
    )
}