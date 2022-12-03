import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionRedirectFilter implements ExceptionFilter {
  constructor(
    private readonly redirectUrl: string,
    private readonly filteringStatus: number[] | undefined,
  ) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();

    if (this.filteringStatus && !this.filteringStatus.includes(status)) {
      return;
    }

    response.redirect(this.redirectUrl);
  }
}
