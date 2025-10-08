import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local.guard';
import { GetCurrentUser } from './decorators/getUser.decorator';
import { User } from '@prisma/client';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {}
  @UseGuards(LocalAuthGuard)
  @Post()
  async login(
    @GetCurrentUser() user: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    const token = this.authService.signUser(user);
    const expires = new Date();
    const environ = this.configService.get('NODE_ENV');
    expires.setSeconds(
      expires.getSeconds() + this.configService.get('COOKIE_EXPIRATION'),
    );
    response.cookie('AUTHENTICATION', token, {
      expires,
      httpOnly: true,
      secure: environ == 'production' ? true : false,
      sameSite: 'none',
    });
    response.sendStatus(HttpStatus.OK);
  }
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('AUTHENTICATION', {
      httpOnly: true,
    });
    response.status(HttpStatus.OK).json({ message: 'Logged out successfully' });
  }
}
