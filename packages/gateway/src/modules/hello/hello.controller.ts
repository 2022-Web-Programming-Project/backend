import {
  Controller,
  Get,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import {
  GetHelloResponse,
  HelloServiceClient,
  HELLO_PACKAGE_NAME,
  HELLO_SERVICE_NAME,
} from './hello.proto';

@Injectable()
@Controller('hello')
export class HelloController implements OnModuleInit {
  private helloService: HelloServiceClient;

  constructor(
    @Inject(HELLO_PACKAGE_NAME) private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.helloService =
      this.client.getService<HelloServiceClient>(HELLO_SERVICE_NAME);
  }

  @Get('/')
  getHello(): Observable<GetHelloResponse> {
    return this.helloService.getHello({});
  }
}
