import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database.module';
import { AppController } from './app.controller';
import { TimetableModule } from './timetable/timetable.module';
import { LunchModule } from './lunch/lunch.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`../../.env`, `.env`],
    }),
    DatabaseModule,
    UserModule,
    AuthModule,
    TimetableModule,
    LunchModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
