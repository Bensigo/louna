import {  getGroupKey, getStartTimeFromInterval } from './util';
import type { HealthDataPoint } from './util'
import type { HealthDataType } from '~/integration/healthKit';
import { eachHourOfInterval, eachDayOfInterval, eachMonthOfInterval, format } from 'date-fns';

export function processDataForChart(data: HealthDataPoint[], interval: string, dataType: HealthDataType) {
  const now = new Date();
  let startDate = getStartTimeFromInterval(interval);
  let labelFormat: string;

  switch (interval) {
    case 'day':
      labelFormat = 'HH:mm';
      break;
    case 'week':
      labelFormat = 'EEE';
      break;
    case 'month':
      labelFormat = 'dd';
      break;
    case 'year':
      labelFormat = 'MMM';
      break;
    default:
      throw new Error('Invalid interval');
  }

  const groupedData = new Map<string, { sum: number; count: number; timestamp: Date }>();

  // Initialize all time units
  let timeUnits: Date[];
  if (interval === 'day') {
    timeUnits = eachHourOfInterval({ start: startDate, end: now });
  } else if (interval === 'week' || interval === 'month') {
    timeUnits = eachDayOfInterval({ start: startDate, end: now });
  } else {
    timeUnits = eachMonthOfInterval({ start: startDate, end: now });
  }

  timeUnits.forEach(unit => {
    const key = getGroupKey(unit, interval);
    groupedData.set(key, { sum: 0, count: 0, timestamp: unit });
  });

  // Process actual data
  data.forEach(point => {
    const key = getGroupKey(point.timestamp, interval);
    const existingData = groupedData.get(key);
    if (existingData) {
      existingData.sum += point.value;
      existingData.count += 1;
    }
  });

  // Calculate final values
  const processedData = Array.from(groupedData, ([label, { sum, count, timestamp }]) => {
    let value: number;
    if (dataType === 'STEPS' || dataType === 'CALORIES') {
      value = sum;
    } else { // HRV or HEART_RATE
      value = count > 0 ? sum / count : 0;
    }
    return {
      value,
      label,
      timestamp,
      formattedLabel: format(timestamp, labelFormat)
    };
  }).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  return processedData;
}