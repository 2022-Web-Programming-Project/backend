import { DateTime } from 'luxon';

export default class DateWrapper {
  private readonly dateFrom: DateTime;
  private readonly dateTo?: DateTime;

  constructor(dateFrom: DateTime, dateTo?: DateTime) {
    this.dateFrom = dateFrom;
    this.dateTo = dateTo;
  }

  public toObject(dateKey: string, dateFromKey: string, dateToKey: string) {
    if (this.dateTo) {
      return {
        [dateFromKey]: this.dateFrom.toFormat('yyyyMMdd'),
        [dateToKey]: this.dateTo.toFormat('yyyyMMdd'),
      };
    }
    return {
      [dateKey]: this.dateFrom.toFormat('yyyyMMdd'),
    };
  }
}

export * from './range';
