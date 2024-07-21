import { Body, Controller, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dtos/sign-up.dto';
import { SignInDto } from './dtos/sign-in.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() signUpDto:SignupDto ) {
    const data = await this.authService.signUp(signUpDto);
    return{
      statusCode: HttpStatus.CREATED,
      message: "회원가입에 성공하였습니다",
      data
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('/signin')
  signIn(@Request() req, @Body() signInDto: SignInDto) {
    const data = this.authService.signIn(req.user.id, req.user.email);
    return {
      statusCode: HttpStatus.OK,
      message: '로그인에 성공하였습니다',
      data,
    };
  }
}
