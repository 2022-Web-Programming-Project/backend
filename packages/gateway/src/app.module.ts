import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HelloModule } from './modules/hello/hello.module';

@Module({
  imports: [
    HelloModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env`],
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
