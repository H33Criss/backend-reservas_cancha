import { Body, Controller, HttpCode, HttpStatus, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }
  @HttpCode(HttpStatus.OK)
  @Post('google/validate')
  async googleValidate(@Body('idToken') idToken: string) {
    const userData = await this.authService.verifyGoogleToken(idToken);
    if (userData) {
      console.log({ userData });
      // Aquí puedes manejar la creación o actualización del perfil del usuario en tu base de datos
      return { user: userData };
    } else {
      throw new UnauthorizedException();
    }
  }
}
