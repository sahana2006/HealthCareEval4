import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { SignupInput, UsersService } from './users.service';

type LoginBody = {
  email: string;
  password: string;
};

type SignupBody = SignupInput;

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  signup(@Body() body: Partial<SignupBody>) {
    return this.usersService.signupPatient({
      firstName: body.firstName?.trim() ?? '',
      lastName: body.lastName?.trim() ?? '',
      email: body.email?.trim() ?? '',
      phone: body.phone?.trim() ?? '',
      dob: body.dob?.trim() ?? '',
      gender: body.gender?.trim() ?? '',
      bloodGroup: body.bloodGroup?.trim() ?? '',
      guardianName: body.guardianName?.trim() ?? '',
      password: body.password ?? '',
    });
  }

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
