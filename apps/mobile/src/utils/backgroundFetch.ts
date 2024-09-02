import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import { getData} from './healthkit'
// import { processSyncQueue } from "./queue";

export const BACKGROUND_HEALTH_DATA_FETCH_TASK = "background-prepare-healthdate";

TaskManager.defineTask(BACKGROUND_HEALTH_DATA_FETCH_TASK,  () => {
  try {
    const now = Date.now();

    void getData()

    // Perform the background task here
    // For example: await someAsyncFunction();

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


