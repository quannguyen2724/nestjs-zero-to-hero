import { Injectable } from '@nestjs/common';
import { UsersRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
  ) {}

  async signUp(AuthCredentialsDto: AuthCredentialsDto): Promise<any> {
    await this.usersRepository.createUser(AuthCredentialsDto);
    return 'User Created';
  }
}
