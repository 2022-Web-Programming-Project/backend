import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { HttpException } from '@nestjs/common/exceptions';
import { Request } from 'express';
import parser from 'ua-parser-js';

export const WATCH_DEVICES = [
  'SM-R840', // Galaxy Watch 3 45mm
  'SM-R850', // Galaxy Watch 3 41mm
  'SM-R860', // Galaxy Watch 4 40mm
  'SM-R870', // Galaxy Watch 4 44mm
  'SM-R880', // Galaxy Watch 4 Classic 42mm
  'SM-R890', // Galaxy Watch 4 Classic 46mm
  'SM-R900', // Galaxy Watch 5 40mm
  'SM-R910', // Galaxy Watch 5 44mm
  'SM-R920', // Galaxy Watch 5 Pro
];

export const WATCH_DEVICE_REGEX = /^SM-R[0-9]{3}$/;

export function isWatchUserAgent(userAgent: string): boolean {
  const { device } = parser(userAgent);
  if (device && device.model) {
    return WATCH_DEVICES.includes(device.model);
  }
  return false;
}

@Injectable()
export class WatchGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const ua = parser(request.headers['user-agent']);
    const isWatchPage = request.query.watch !== undefined;
    if (
      ua.device &&
      ua.device.model &&
      WATCH_DEVICE_REGEX.test(ua.device.model)
    ) {
      if (isWatchPage) {
        return true;
      } else {
        throw new HttpException('Not a watch page', 129);
      }
    }
    if (isWatchPage) {
      throw new HttpException('Not a watch device', 128);
    }
    return true;
  }
}
