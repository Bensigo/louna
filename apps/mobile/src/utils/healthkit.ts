import  AppleHealthKit , {
    HealthValue,
  type  HealthKitPermissions,
  HealthInputOptions,
  HealthObserver,
  } from 'react-native-health'

export class HealthKit {
    constructor(permissions: HealthKitPermissions){
        AppleHealthKit.initHealthKit(permissions, (err) => {
            if (err){
                console.log(err);
                console.log('[ERROR] Cannot grant permissions!')
            }
        })
    }
   
    getHealthOptions (observer?: HealthObserver){
        return {
            startDate: new Date().toISOString(),
           ...(observer ? { type: observer }: {})

        } as HealthInputOptions
    }
    
   async getData(){
      const stepsHelathOptions = this.getHealthOptions()

      const cb = (err: any, result: any) => {
         if(err){
            console.log(err)
            return;
         }
         return result;
      }

      const steps =  AppleHealthKit.getStepCount(stepsHelathOptions, cb)
   }

   
}