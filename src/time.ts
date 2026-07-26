import type { CalculateInput } from './types.js';

export function parseLocal(input: CalculateInput) {
  if (!Number.isInteger(input.timezoneOffsetMinutes)
    || input.timezoneOffsetMinutes < -840
    || input.timezoneOffsetMinutes > 840) {
    throw new Error('timezoneOffsetMinutes must be an integer from -840 to 840');
  }
  const match = input.localDateTime.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?$/
  );
  if (!match) throw new Error('localDateTime must be ISO-8601 local wall-clock');
  const [, year, month, day, hour, minute, second = '0', millisecond = '0'] = match;
  const wall = Date.UTC(
    +year,
    +month - 1,
    +day,
    +hour,
    +minute,
    +second,
    +(millisecond + '00').slice(0, 3)
  );
  const check = new Date(wall);
  if (check.getUTCFullYear() !== +year
    || check.getUTCMonth() !== +month - 1
    || check.getUTCDate() !== +day
    || check.getUTCHours() !== +hour
    || check.getUTCMinutes() !== +minute
    || check.getUTCSeconds() !== +second) {
    throw new Error('localDateTime contains an invalid calendar date or time');
  }
  const date = new Date(wall);
  if (Number.isNaN(date.getTime())) throw new Error('Invalid localDateTime');
  return date;
}

export function hourBranch(date: Date) {
  return Math.floor(((date.getUTCHours() + 1) % 24) / 2);
}

export function equationOfTimeMinutes(date: Date) {
  const start = Date.UTC(date.getUTCFullYear(), 0, 1);
  const day = Math.floor((date.getTime() - start) / 86400000) + 1;
  const angle = 2 * Math.PI * (day - 81) / 364;
  return 9.87 * Math.sin(2 * angle) - 7.53 * Math.cos(angle) - 1.5 * Math.sin(angle);
}
