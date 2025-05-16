import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Controller('auth')
export class AuthController {
  constructor(private readonly httpService: HttpService) {}

  @Post('register')
  async register(@Body() body: any) {
    try {
      const res = await firstValueFrom(
        this.httpService.post('http://auth-service:3001/auth/register', body)
      );
      return res.data;
    } catch (err) {
      throw new HttpException(
        err.response?.data || 'Registration failed',
        err.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  @Post('login')
  async login(@Body() body: any) {
    try {
      const response = await firstValueFrom(
        this.httpService.post('http://auth-service:3001/auth/login', body)
      );
      return response.data;
    } catch (error) {
      console.error('🔥 Gateway Error:', error.response?.data || error.message);
      throw new HttpException(error.response?.data || 'Login Failed', error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
