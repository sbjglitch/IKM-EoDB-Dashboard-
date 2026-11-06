import type { Service } from '../data/services';
import { formatDays, limitPhrase } from './format';

export type TimeStatus = 'within' | 'slowest-over' | 'average-over';

export interface TimeTrack {
  /** Positions as % of the track, which runs from 0 to max(limit, maxDays). */
  min: number;
  median: number;
  average: number;
  max: number;
  limit: number;
  status: TimeStatus;
  statusText: string;
  /** Screen-reader summary of the whole track. */
  label: string;
}

/** Where one service's processing times sit against its RTS limit. Never mixes services. */
export function timeTrack(s: Service): TimeTrack {
  const scale = Math.max(s.rtsLimitDays, s.maxDays, 1);
  const pos = (days: number) => (Math.min(days, scale) / scale) * 100;
  const status: TimeStatus =
    s.avgDays > s.rtsLimitDays ? 'average-over' : s.maxDays > s.rtsLimitDays ? 'slowest-over' : 'within';
  const phrase = limitPhrase(s);
  const statusText = {
    within: `All within the ${phrase}`,
    'slowest-over': `Slowest exceeded the ${phrase}`,
    'average-over': `Average exceeds the ${phrase}`,
  }[status];

  return {
    min: pos(s.minDays),
    median: pos(s.medianDays),
    average: pos(s.avgDays),
    max: pos(s.maxDays),
    limit: pos(s.rtsLimitDays),
    status,
    statusText,
    label:
      `Time to process ${s.name}: minimum ${formatDays(s.minDays)}, median ${formatDays(s.medianDays)}, ` +
      `average ${formatDays(s.avgDays)}, maximum ${formatDays(s.maxDays)}. ` +
      `RTS limit ${s.rtsLimitLabel.toLowerCase()}. ${statusText}.`,
  };
}
