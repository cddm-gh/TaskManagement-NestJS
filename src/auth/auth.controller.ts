import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  signUp(@Body(ValidationPipe) body: AuthCredentialsDto): Promise<void> {
    return this.authService.signUp(body);
  }

  @Post('/signin')
  signIn(@Body(ValidationPipe) body: AuthCredentialsDto): Promise<{ accessToken: string }> {
    console.log('entrando aquí');
    return this.authService.signIn(body);
  }
}
