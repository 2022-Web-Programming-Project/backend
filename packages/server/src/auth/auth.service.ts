import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as crypto from 'crypto';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { LoginUserDto } from './dto/login-user.dto';
import { RegistUserDto } from './dto/regist-user.dtio';

function sha256(data: string) {
  return crypto.createHash('sha256').update(data).digest('hex');
}

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  public async isUserExistByEmail(email: string): Promise<boolean> {
    return !!(await this.userRepository.findOneBy({ email }));
  }

  public async isUserExistById(id: string): Promise<boolean> {
    return !!(await this.userRepository.findOneBy({ id }));
  }

  public async loginUser(user: LoginUserDto): Promise<User | null> {
    const { email, password } = user;

    const userEntity = await this.userRepository.findOneBy({ email });

    if (!userEntity) return null;

    if (sha256(password) !== userEntity.password) return null;

    return userEntity;
  }

  public registUser(user: RegistUserDto): Promise<User> {
    const userEntity = this.userRepository.create({
      ...user,
      password: sha256(user.password),
    });
    return this.userRepository.save(userEntity);
  }
}
