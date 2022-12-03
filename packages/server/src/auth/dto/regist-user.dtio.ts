import { IsEmail, IsString } from '@nestjs/class-validator';

export class RegistUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  username!: string;

  @IsString()
  password!: string;
}
