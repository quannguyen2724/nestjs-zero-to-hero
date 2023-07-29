import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from './user.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
  ) {}

  async signUp(AuthCredentialsDto: AuthCredentialsDto): Promise<any> {
    return this.usersRepository.createUser(AuthCredentialsDto);
  }

  async signIn(AuthCredentialsDto: AuthCredentialsDto): Promise<string> {
    const { username, password } = AuthCredentialsDto;
    console.log(username, password);
    //know if user exists without username
    const user = await this.usersRepository.findOne({
      where: { username },
    });

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (user) {
      if (passwordMatches) {
        return 'success';
      }
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }
}
