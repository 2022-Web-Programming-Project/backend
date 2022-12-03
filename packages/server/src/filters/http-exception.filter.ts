import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionRedirectFilter implements ExceptionFilter {
  constructor(private readonly redirectMap: Record<number, string>) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status = exception.getStatus();

    if (!this.redirectMap[status]) {
      return;
    }

    response.redirect(this.redirectMap[status]);
  }
}
