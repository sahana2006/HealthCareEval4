import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';

type LoginBody = {
  email: string;
  password: string;
};

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('login')
  login(@Body() body: LoginBody) {
    const email = body?.email?.trim();
    const password = body?.password;
    if (!email || !password) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const user = this.usersService.login(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return user;
  }
}
