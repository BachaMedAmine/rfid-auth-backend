import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body('rfidKey') rfidKey: string) {
    return this.authService.register(rfidKey);
  }

  @Post('login')
  async login(@Body('rfidKey') rfidKey: string) {
    return this.authService.login(rfidKey);
  }
}