
import AppleHealthKit, {type HealthKitPermissions } from 'react-native-health'


export const PERMISSIONS: HealthKitPermissions = {
    permissions: {
        read: [
            AppleHealthKit.Constants.Permissions.BodyMass,
            AppleHealthKit.Constants.Permissions.BodyMassIndex,
            AppleHealthKit.Constants.Permissions.Vo2Max,
            AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
            AppleHealthKit.Constants.Permissions.BloodPressureDiastolic,
            AppleHealthKit.Constants.Permissions.RestingHeartRate,
            AppleHealthKit.Constants.Permissions.HeartbeatSeries,
            AppleHealthKit.Constants.Permissions.WalkingHeartRateAverage,
            AppleHealthKit.Constants.Permissions.BloodPressureSystolic,
            AppleHealthKit.Constants.Permissions.Steps,
            AppleHealthKit.Constants.Permissions.Weight,
            AppleHealthKit.Constants.Permissions.DateOfBirth,
            AppleHealthKit.Constants.Permissions.HeartRate,
            AppleHealthKit.Constants.Permissions.SleepAnalysis,
            AppleHealthKit.Constants.Permissions.MindfulSession,
            AppleHealthKit.Constants.Permissions.DistanceCycling,
            AppleHealthKit.Constants.Permissions.Height,
            AppleHealthKit.Constants.Permissions.HeartRateVariability


        ],
        write: []
    }
}
