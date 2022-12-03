import {
  Controller,
  Get,
  Query,
  Render,
  Res,
  Session,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { DateTime } from 'luxon';
import { HttpExceptionRedirectFilter } from 'src/filters/http-exception.filter';
import { WatchGuard } from 'src/guards/watch.guard';
import { LunchService } from './lunch.service';

@Controller('lunch')
export class LunchController {
  constructor(private readonly service: LunchService) {}

  @Get()
  @Render('lunch/index')
  @UseGuards(WatchGuard)
  @UseFilters(
    new HttpExceptionRedirectFilter({
      128: '?',
      129: '?watch',
    }),
  )
  async getLunch(
    @Session() session: Record<string, any>,
    @Query('watch') watch: any,
  ) {
    const isWatchPage = watch !== undefined;
    const lunch = await this.service.getDay(
      'B10',
      '7010536',
      DateTime.now().minus({ days: 2 }).toFormat('yyyy-MM-dd'),
    );

    return { user: session.user, isWatch: isWatchPage, lunch };
  }
}
