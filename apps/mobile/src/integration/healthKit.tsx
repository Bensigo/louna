import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import AppleHealthKit, { HealthPermission } from 'react-native-health';
import type { HealthInputOptions, HealthKitPermissions } from 'react-native-health';

export const healthKitPermission: HealthKitPermissions = {
   permissions: {
    read: [
        AppleHealthKit.Constants.Permissions.HeartRate,
       AppleHealthKit.Constants.Permissions.HeartRateVariability,
       AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
       AppleHealthKit.Constants.Permissions.StepCount,
       AppleHealthKit.Constants.Permissions.Steps,

      ],
      write: [
    
      ],
   }
} as const;

interface HealthKitContextType {
  hasPermissions: boolean;
  requestPermissions: () => void;
  readData: (dataType: HealthPermission, options: HealthInputOptions) => Promise<any>;
  writeData: (dataType: HealthPermission, value: number, options: HealthInputOptions) => Promise<void>;
}

const HealthKitContext = createContext<HealthKitContextType | null>(null);

export const HealthKitProvider = ({ children }: { children: ReactNode }) => {
  const [hasPermissions, setHasPermissions] = useState(false);

  const requestPermissions =  () => {
      AppleHealthKit.initHealthKit(healthKitPermission, (error, result) => {
        if (error){
            console.error('Error initializing HealthKit:', error);
            return 
        }
         setHasPermissions(true)
    });
    
  };

  const readData = async (dataType: HealthPermission, options: HealthInputOptions) => {
    if (!hasPermissions) {
      throw new Error('HealthKit permissions not granted');
    }
    return new Promise((resolve, reject) => {
      switch (dataType) {
        case HealthPermission.HeartRate:
          AppleHealthKit.getHeartRateSamples(options, (err, results) => {
            if (err) {
              reject(err);
            } else {
              resolve(results);
            }
          });
          break;
        case HealthPermission.StepCount:
          AppleHealthKit.getStepCount(options, (err, results) => {
            if (err) {
              reject(err);
            } else {
              resolve(results);
            }
          });
          break;
        case HealthPermission.HeartRateVariability:
          AppleHealthKit.getHeartRateVariabilitySamples(options, (err, results) => {
            if (err) {
              reject(err);
            } else {
              resolve(results);
            }
          });
          break;
        case HealthPermission.ActiveEnergyBurned:
          AppleHealthKit.getActiveEnergyBurned(options, (err, results) => {
            if (err) {
              reject(err);
            } else {
              resolve(results);
            }
          });
          break;
        default:
          reject(new Error('Unsupported data type'));
      }
    });
  };

  const writeData = async (dataType: HealthPermission, value: number, options: HealthInputOptions) => {
    if (!hasPermissions) {
      throw new Error('HealthKit permissions not granted');
    }
    return new Promise<void>((resolve, reject) => {
      switch (dataType) {
        case HealthPermission.HeartRate:
          AppleHealthKit.saveHeartRateSample(
            { ...options, value },
            (err, results) => {
              if (err) {
                reject(err);
              } else {
                resolve();
              }
            }
          );
          break;
        case HealthPermission.StepCount:
          AppleHealthKit.saveSteps(
            { ...options, value },
            (err, results) => {
              if (err) {
                reject(err);
              } else {
                resolve();
              }
            }
          );
          break;
        // Add cases for other data types as needed
        default:
          reject(new Error('Unsupported data type'));
      }
    });
  };

  useEffect(() => {
   void requestPermissions();
  }, []);

  
  return (
    <HealthKitContext.Provider value={{ writeData, readData, hasPermissions, requestPermissions }}>
      {children}
    </HealthKitContext.Provider>
  );
};

export const useHealthKit = () => {
  return useContext(HealthKitContext);
};