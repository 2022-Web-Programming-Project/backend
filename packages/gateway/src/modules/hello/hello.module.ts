import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { HELLO_PACKAGE_NAME } from './hello.proto';
import { HelloController } from './hello.controller';

export const serviceHost = 'localhost';
export const servicePort = 10001;

@Module({
  imports: [
    ClientsModule.register([
      {
        name: HELLO_PACKAGE_NAME,
        transport: Transport.GRPC,
        options: {
          url: `${serviceHost}:${servicePort}`,
          package: 'hello',
          protoPath: 'src/hello/hello.proto',
        },
      },
    ]),
  ],
  controllers: [HelloController],
  providers: [],
})
export class HelloModule {}
