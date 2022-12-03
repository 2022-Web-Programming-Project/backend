import { Controller, Get } from '@nestjs/common';
import { TimetableService } from './timetable.service';

@Controller('timetable')
export class TimetableController {
  constructor(private readonly service: TimetableService) {}

  @Get('/')
  async getTimetable() {
    const host = await this.service.getHost();
    if (!host) return { error: 'host not found' };
    const script = await this.service.getScript(`${host.host}:${host.port}`);
    const callConst = this.service.getFirstScDataArguments(
      await this.service.findScDataCall(script),
    );
    const baseConst = await this.service.getScDataBaseConst(
      await this.service.findScDataDeclaration(script),
    );
    const school_code = '41896';
    const week = 1;
    return await this.service.requestScData(
      `${host.host}:${host.port}`,
      baseConst,
      callConst,
      school_code,
      week,
    );
  }
}
