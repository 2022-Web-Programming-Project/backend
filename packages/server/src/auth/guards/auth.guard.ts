import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class SessionAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    if (!request.session.user) {
      throw new HttpException('로그인이 필요합니다.', HttpStatus.UNAUTHORIZED);
    }
    return true;
  }
}
