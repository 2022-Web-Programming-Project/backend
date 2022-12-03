import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Render,
  Res,
  Session,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Cookie } from 'reference';
import { AuthService } from './auth.service';
import { SessionAuthGuard } from './guards/auth.guard';
import { RegistUserDto } from './dto/regist-user.dtio';
import { LoginUserDto } from './dto/login-user.dto';
import { Response } from 'express';
import { HttpExceptionRedirectFilter } from 'src/filters/http-exception.filter';
import { WatchGuard } from 'src/guards/watch.guard';

const { REFRESH_TOKEN_KEY, REFRESH_TOKEN_OPTION } = Cookie;

@Controller('auth')
export class AuthController {
  constructor(
    private readonly config: ConfigService,
    private readonly authService: AuthService,
  ) {}

  @Get('/')
  @ApiBearerAuth()
  @UseGuards(SessionAuthGuard)
  hello() {
    return 'Hello World!';
  }

  @Get('login')
  @Render('auth/login')
  @UseGuards(WatchGuard)
  @UseFilters(
    new HttpExceptionRedirectFilter({
      128: '?',
      129: '?watch',
    }),
  )
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  loginRender(@Query('watch') watch: any) {
    const isWatchPage = watch !== undefined;

    return { isWatch: isWatchPage };
  }

  @Get('logout')
  async logout(@Session() session: Record<string, any>, @Res() res: Response) {
    session.user = null;

    res.redirect('/');
  }

  @Post('/login')
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async login(
    @Body() loginDto: LoginUserDto,
    @Session() session: Record<string, any>,
    @Query('watch') watch: any,
    @Res() res: Response,
  ) {
    const { email, password } = loginDto;

    const user = await this.authService.loginUser(loginDto);

    if (!user) {
      throw new HttpException('로그인에 실패했습니다.', HttpStatus.BAD_REQUEST);
    }

    session.user = user;

    res.redirect('/');
  }

  @Get('regist')
  @Render('auth/regist')
  @UseGuards(WatchGuard)
  @UseFilters(
    new HttpExceptionRedirectFilter({
      128: '?',
      129: '?watch',
    }),
  )
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  registRender(@Query('watch') watch: any) {
    const isWatchPage = watch !== undefined;

    return { isWatch: isWatchPage };
  }

  @Post('regist')
  async regist(
    @Body() registDto: RegistUserDto,
    @Session() session: Record<string, any>,
    @Res() res: Response,
  ) {
    const { email, username, password } = registDto;

    if (await this.authService.isUserExistByEmail(email)) {
      throw new HttpException(
        '이미 존재하는 이메일입니다.',
        HttpStatus.BAD_REQUEST,
      );
    }

    const user = await this.authService.registUser(registDto);

    session.userId = user.id;

    res.redirect('/');
  }
}
