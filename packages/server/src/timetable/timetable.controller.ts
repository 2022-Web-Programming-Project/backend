import {
  Controller,
  Get,
  Query,
  Render,
  Req,
  Res,
  Session,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { HttpExceptionRedirectFilter } from 'src/filters/http-exception.filter';
import { WatchGuard } from 'src/guards/watch.guard';
import { TimetableService } from './timetable.service';

@Controller('timetable')
export class TimetableController {
  constructor(private readonly service: TimetableService) {}

  @Get('/api')
  async getTimetable() {
    return await this.service.getTimetable('41896', 1);
  }

  @Get()
  @Render('timetable/index')
  @UseGuards(WatchGuard)
  @UseFilters(
    new HttpExceptionRedirectFilter({
      128: '?',
      129: '?watch',
    }),
  )
  root(@Session() session: Record<string, any>, @Query('watch') watch: any) {
    const isWatchPage = watch !== undefined;
    return { user: session.user, isWatch: isWatchPage };
  }
}
