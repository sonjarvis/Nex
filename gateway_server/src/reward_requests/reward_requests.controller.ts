import {
  Controller, Post, Get, Req, UseGuards, Body, HttpException, HttpStatus
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AuthGuard } from '@nestjs/passport';
import { firstValueFrom } from 'rxjs';

@Controller('reward-requests')
@UseGuards(AuthGuard('jwt'))
export class RewardRequestsController {
  constructor(private readonly httpService: HttpService) {}

  @Post()
  async create(@Req() req, @Body() body: any) {
    try {
      const token = req.headers.authorization;
      const response = await firstValueFrom(
        this.httpService.post('http://event-service:3002/reward-requests', body, {
          headers: { Authorization: token },
        })
      );
      return response.data;
    } catch (error: any) {
      throw new HttpException(
        error.response?.data || '보상 요청 실패',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get()
  async findAll(@Req() req) {
    try {
      const token = req.headers.authorization;
      const response = await firstValueFrom(
        this.httpService.get('http://event-service:3002/reward-requests', {
          headers: { Authorization: token },
        })
      );
      return response.data;
    } catch (error: any) {
      throw new HttpException(
        error.response?.data || '보상 이력 조회 실패',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
