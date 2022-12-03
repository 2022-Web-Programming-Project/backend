import {
  Controller,
  Get,
  HttpStatus,
  Query,
  Render,
  Req,
  Res,
  Session,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { SessionAuthGuard } from 'src/auth/guards/auth.guard';
import { HttpExceptionRedirectFilter } from 'src/filters/http-exception.filter';
import { WatchGuard } from 'src/guards/watch.guard';
import { TimetableService } from './timetable.service';

@Controller('timetable')
export class TimetableController {
  constructor(private readonly service: TimetableService) {}

  @Get('/api')
  async getTimetable() {
    return this.service.resolveJsonText(
      await this.service.getTimetable('41896', 1),
    );
  }

  @Get()
  @Render('timetable/index')
  @UseGuards(WatchGuard, SessionAuthGuard)
  @UseFilters(
    new HttpExceptionRedirectFilter({
      [HttpStatus.UNAUTHORIZED]: '/auth/login',
      128: '?',
      129: '?watch',
    }),
  )
  async root(
    @Session() session: Record<string, any>,
    @Query('watch') watch: any,
  ) {
    const isWatchPage = watch !== undefined;
    const timetable = await this.service
      .getTimetable('41896', 1)
      .then((text) => this.service.resolveJsonText(text))
      .then((x: any) =>
        x['자료147'][session.user.grade][session.user.class]
          .map((y: any) =>
            y
              .map((z: any) => [Math.floor(z / 100), z % 100])
              .map(([a, b]: number[]) => [
                x['자료492'][b],
                x['자료446'][a].substr(0, 2),
              ])
              .slice(1, -1),
          )
          .slice(1, -1),
      );
    return { user: session.user, isWatch: isWatchPage, timetable };
  }
}
