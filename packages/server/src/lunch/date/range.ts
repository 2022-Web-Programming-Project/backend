import { DateTime } from 'luxon';

export function DaysFromRange(startDate: DateTime, endDate: DateTime) {
  const days: DateTime[] = [];
  let currentDate = startDate;
  while (currentDate <= endDate) {
    days.push(currentDate);
    currentDate = currentDate.plus({ days: 1 });
  }
  return days;
}
