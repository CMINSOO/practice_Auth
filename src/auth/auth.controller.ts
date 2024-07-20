import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dtos/sign-up.dto';

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
}
