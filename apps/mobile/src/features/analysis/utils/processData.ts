import {  getGroupKey, getStartTimeFromInterval } from './util';
import type { HealthDataPoint } from './util'
import type { HealthDataType } from '~/integration/healthKit';
import { eachHourOfInterval, eachDayOfInterval, eachMonthOfInterval, format } from 'date-fns';

export function processDataForChart(data: HealthDataPoint[], interval: string, dataType: HealthDataType) {
  const now = new Date();
  const startDate = getStartTimeFromInterval(interval);
  let labelFormat: string;

  switch (interval) {
    case 'D':
      labelFormat = 'HH:mm';
      break;
    case 'W':
      labelFormat = 'EEE';
      break;
    case 'M':
      labelFormat = 'dd';
      break;
    case 'Y':
      labelFormat = 'MMM';
      break;
    default:
      throw new Error('Invalid interval');
  }

  const groupedData = new Map<string, { sum: number; count: number; timestamp: Date }>();

  // Initialize all time units
  let timeUnits: Date[];
  if (interval === 'D') {
    timeUnits = eachHourOfInterval({ start: startDate, end: now });
  } else if (interval === 'W' || interval === 'month') {
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

  // Calculate final values and filter out zero values
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
  }).filter(({ value }) => value !== 0).sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  console.log({ processedData })
  return processedData;
}