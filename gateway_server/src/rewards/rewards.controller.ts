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

@Controller('events/:eventId/rewards')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class RewardsController {
  constructor(private readonly httpService: HttpService) {}

  @Post()
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

  @Get()
  async findAll(@Param('eventId') eventId: string, @Req() req) {
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
        error.response?.data || 'Reward fetch failed',
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
