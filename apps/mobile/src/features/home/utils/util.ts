import { format, startOfDay, startOfWeek, startOfMonth, startOfYear } from 'date-fns';
import type { HealthDataType } from '~/integration/healthKit';

export interface HealthDataPoint {
  timestamp: Date;
  value: number;
}

export function getStartTimeFromInterval(interval: string): Date {
  const now = new Date();
  switch (interval) {
    case 'day':
      return startOfDay(now);
    case 'week':
      return startOfWeek(now);
    case 'month':
      return startOfMonth(now);
    case 'year':
      return startOfYear(now);
    default:
      return now;
  }
}

export function getGroupKey(date: Date, interval: string): string {
  switch (interval) {
    case 'day':
      return format(date, 'HH:00');
    case 'week':
      return format(date, 'EEEEEE');
    case 'month':
      return format(date, 'dd');
    case 'year':
      return format(date, 'MMM');
    default:
      return '';
  }
}

export function getUnit(name: HealthDataType): string {
  switch (name) {
    case 'STEPS':
      return 'Steps';
    case 'HRV':
      return 'ms';
    case 'HEART_RATE':
      return 'BPM';
    case 'CALORIES':
      return 'Cal';
    default:
      return '';
  }
}