import AsyncStorage from '@react-native-async-storage/async-storage';
import type { getData } from './healthkit';

const SYNC_QUEUE_KEY = 'health_data_sync_queue';

type QUEUE_DATA_TYPE = Awaited<ReturnType<typeof getData>>;

export const getSyncQueue = async (): Promise<QUEUE_DATA_TYPE[]> => {
  try {
    const queue = await AsyncStorage.getItem(SYNC_QUEUE_KEY);
    return queue ? JSON.parse(queue) as QUEUE_DATA_TYPE[] : [];
  } catch (error) {
    console.error('Failed to get sync queue', error);
    return [];
  }
};

export const addToSyncQueue = async (data: QUEUE_DATA_TYPE): Promise<void> => {
  try {
    const queue = await getSyncQueue();
    queue.push(data);
    await AsyncStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(queue));
  } catch (error) {
    console.error('Failed to add to sync queue', error);
  }
};

// Clear the queue after successful sync
export const clearSyncQueue = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(SYNC_QUEUE_KEY);
  } catch (error) {
    console.error('Failed to clear sync queue', error);
  }
};

// Process items in the queue
export const processSyncQueue = async (fn: (item: QUEUE_DATA_TYPE) => Promise<void>): Promise<void> => {
  const queue = await getSyncQueue();
  for (const item of queue) {
    try {
      await fn(item);
    } catch (error) {
      console.error('Failed to process sync queue item', error);
      // If it fails, leave it in the queue for next attempt
      continue;
    }
  }
  await clearSyncQueue();
};