import { Get, Controller, Render, Session } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Render('index')
  root(@Session() session: Record<string, any>) {
    console.log(session);
    return { message: 'Hello world!', user: session.user };
  }
}
