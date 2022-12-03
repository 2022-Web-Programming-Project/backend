import { IsEmail, IsNumber, IsString } from '@nestjs/class-validator';

export class RegistUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  username!: string;

  @IsString()
  password!: string;

  @IsNumber()
  grade!: number;

  @IsNumber()
  class!: number;
}
