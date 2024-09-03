import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import { getData } from './healthkit'
import { addToSyncQueue, processSyncQueue } from "./queue";
import { appApi } from "./api";

export const BACKGROUND_HEALTH_DATA_FETCH_TASK = "background-prepare-healthdate";


TaskManager.defineTask(BACKGROUND_HEALTH_DATA_FETCH_TASK,  () => {
  try {
    const healthData = void getData()
    
    if (healthData) {
       addToSyncQueue({
        ...healthData,
      });
    }

    void processSyncQueue(async (item) => {
      // send data to the backend 
      await appApi.log.syncHealthData.mutate(item)
    });

    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    console.error("Background fetch failed:", error);
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

export async function registerBackgroundFetchAsync() {
  return BackgroundFetch.registerTaskAsync(BACKGROUND_HEALTH_DATA_FETCH_TASK, {
    minimumInterval: 60 * 60, // every 1 hour
    stopOnTerminate: false,
    startOnBoot: true,
  });
}

export async function unregisterBackgroundFetchAsync() {
  return BackgroundFetch.unregisterTaskAsync(BACKGROUND_HEALTH_DATA_FETCH_TASK);
}


