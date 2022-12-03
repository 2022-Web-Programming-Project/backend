import {
  Get,
  Controller,
  Session,
  Req,
  UseGuards,
  UseFilters,
  Query,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpExceptionRedirectFilter } from './filters/http-exception.filter';
import { WatchGuard } from './guards/watch.guard';

@Controller()
export class AppController {
  @Get()
  @UseGuards(WatchGuard)
  @UseFilters(
    new HttpExceptionRedirectFilter({
      128: '/',
      129: '/?watch',
    }),
  )
  root(
    @Session() session: Record<string, any>,
    @Query('watch') watch: boolean,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const isWatchPage = watch !== undefined;
    res.render('index', { user: session.user, isWatch: isWatchPage });
  }
}
