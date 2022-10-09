export class InvalidGoogleTrendsApiTimeError extends Error {
  constructor({ time, reason }: { time: string; reason: string }) {
    super(
      `
The following is not a valid google trends api time constraint: '${time}'. This is because ${reason}.

Here are some valid examples:
 - 'now 4-h' = past 4 hours
 - 'now 1-d' = past day
 - 'now 7-d' = past 7 days
 - 'today 1-m' = past 30 days
 - 'today 3-m' = past 90 days
 - 'today 12-m' = past 12 months
 - 'today 5-y' = past 5 years
 - 'all' = 2004 to present
    `.trim(),
    );
  }
}
export const assertValidGoogleTrendsApiTime = (time: string): string => {
  // break up into parts
  const [start, stop, ...rest] = time.split(' ');
  if (rest.length)
    throw new InvalidGoogleTrendsApiTimeError({
      time,
      reason: 'too many spaces',
    });

  // validate the start option
  const validStartOptions = ['now', 'today', 'all'];
  if (!validStartOptions.includes(start))
    throw new InvalidGoogleTrendsApiTimeError({
      time,
      reason: `start option must be one of ${validStartOptions}`,
    });

  // validate the stop option
  if (start === 'all') {
    if (!stop) return time;
    throw new InvalidGoogleTrendsApiTimeError({
      time,
      reason: `can not define stop condition when start is 'all'`,
    });
  }
  const [stopMagnitude, stopUnit, ...stopRest] = stop.split('-');
  if (stopRest.length)
    throw new InvalidGoogleTrendsApiTimeError({
      time,
      reason: 'too many dashes in time stop constraint',
    });
  const validUnitsForStartMap = {
    now: ['h', 'd'],
    today: ['m', 'y'],
  };
  if (!(start in validUnitsForStartMap))
    throw new InvalidGoogleTrendsApiTimeError({
      time,
      reason: 'could not find valid units for this start constraint ',
    });
  const validUnitsForThisStart =
    validUnitsForStartMap[start as 'now' | 'today'];
  if (!validUnitsForThisStart.includes(stopUnit))
    throw new InvalidGoogleTrendsApiTimeError({
      time,
      reason: `the stop unit, '${stopUnit}'', is not valid for this start constraint, '${start}'.'`,
    });
  if (Number.isNaN(parseInt(stopMagnitude, 10)))
    throw new InvalidGoogleTrendsApiTimeError({
      time,
      reason: `the stop magnitude, '${stopMagnitude}', is not a number'`,
    });

  // if we reached here, we're good to go
  return time;
};
