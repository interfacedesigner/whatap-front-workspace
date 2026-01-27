export const TimePos = {
  START: 'start',
  END: 'end',
} as const;

export function createDefaultTimestamp(timePos: TimePos) {
  switch (timePos) {
    case TimePos.START:
      /** Default duration is set to 10 minutes */
      return getBeforeFiveSecondTime() - 1000 * 10 * 60;
    case TimePos.END:
    default:
      return getBeforeFiveSecondTime();
  }
}

export function getBeforeFiveSecondTime() {
  const now = Date.now();
  return now - (now % 5000);
}
