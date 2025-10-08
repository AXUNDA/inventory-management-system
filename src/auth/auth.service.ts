import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as argon from 'argon2';
import { UserRepoService } from '@app/repos';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepo: UserRepoService,
    private readonly jwtService: JwtService,
  ) {}
  async login(email: string, password: string): Promise<any> {
    const user = await this.userRepo.findOne({
      email: email,
    });
    if (!user) throw new NotFoundException('No such user');
    if (await argon.verify(user.password, password)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id } = user;
      return { id };
    }
    throw new HttpException('Invalid Credentials', HttpStatus.BAD_REQUEST);
  }
  signUser(payload: User) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
