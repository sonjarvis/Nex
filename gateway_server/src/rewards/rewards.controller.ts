import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Req,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';

@Controller()
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class RewardsController {
  constructor(private readonly httpService: HttpService) {}

  // 보상 등록
  @Post('events/:eventId/rewards')
  @Roles('ADMIN', 'OPERATOR')
  async create(
    @Param('eventId') eventId: string,
    @Body() body: any,
    @Req() req,
  ) {
    try {
      const token = req.headers.authorization;
      const response = await firstValueFrom(
        this.httpService.post(
          `http://event-service:3002/events/${eventId}/rewards`,
          body,
          {
            headers: { Authorization: token },
          },
        ),
      );
      return response.data;
    } catch (error: any) {
      throw new HttpException(
        error.response?.data || 'Reward create failed',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 🔹 보상 목록 조회
  @Get('events/:eventId/rewards')
  async getRewards(@Param('eventId') eventId: string, @Req() req) {
    try {
      const token = req.headers.authorization;
      const response = await firstValueFrom(
        this.httpService.get(
          `http://event-service:3002/events/${eventId}/rewards`,
          {
            headers: { Authorization: token },
          },
        ),
      );
      return response.data;
    } catch (error: any) {
      throw new HttpException(
        error.response?.data || '보상 조회 실패',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 유저 본인 보상 요청 이력 조회
  @Get('reward-requests/me')
  @Roles('USER')
  async findMy(@Req() req) {
    try {
      const token = req.headers.authorization;
      const response = await firstValueFrom(
        this.httpService.get(
          'http://event-service:3002/reward-requests/me',
          {
            headers: { Authorization: token },
          },
        ),
      );
      return response.data;
    } catch (error: any) {
      throw new HttpException(
        error.response?.data || '내 보상 요청 조회 실패',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // 관리자 전체 보상 요청 이력 조회
  @Get('reward-requests')
  @Roles('ADMIN', 'OPERATOR', 'AUDITOR')
  async findAll(@Req() req) {
    try {
      const token = req.headers.authorization;
      const response = await firstValueFrom(
        this.httpService.get(
          'http://event-service:3002/reward-requests',
          {
            headers: { Authorization: token },
          },
        ),
      );
      return response.data;
    } catch (error: any) {
      throw new HttpException(
        error.response?.data || '전체 보상 요청 조회 실패',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
