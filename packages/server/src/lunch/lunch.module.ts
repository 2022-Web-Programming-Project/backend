import { Module } from '@nestjs/common';
import { LunchController } from './lunch.controller';
import { LunchService } from './lunch.service';

@Module({
  controllers: [LunchController],
  providers: [LunchService]
})
export class LunchModule {}
