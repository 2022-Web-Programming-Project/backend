import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class SessionAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    return !!request.session.userId;
  }
}
