import { format, startOfDay, startOfWeek, startOfMonth, startOfYear } from 'date-fns';
import type { HealthDataType } from '~/integration/healthKit';

export interface HealthDataPoint {
  timestamp: Date;
  value: number;
}

export function getStartTimeFromInterval(interval: string): Date {
  const now = new Date();
  switch (interval) {
    case 'D':
      return startOfDay(now);
    case 'W':
      return startOfWeek(now);
    case 'M':
      return startOfMonth(now);
    case 'Y':
      return startOfYear(now);
    default:
      return now;
  }
}

export function getGroupKey(date: Date, interval: string): string {
  switch (interval) {
    case 'D':
      return format(date, 'HH:00');
    case 'W':
      return format(date, 'EEEEEE');
    case 'M':
      return format(date, 'dd');
    case 'Y':
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