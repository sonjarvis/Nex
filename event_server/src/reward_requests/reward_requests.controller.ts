import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';
import { RewardRequestsService } from './reward_requests.service';
import { CreateRewardRequestDto } from './dto/create_reward_request.dto';

@Controller('reward-requests')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class RewardRequestsController {
  constructor(private readonly rewardRequestService: RewardRequestsService) {}

  @Post()
  create(@Req() req, @Body() body: CreateRewardRequestDto) {
    const userId = req.user.userId;
    return this.rewardRequestService.create(userId, body.eventId);
  }

  // 본인 요청 이력 조회
  @Get('me')
  @Roles('USER')
  findMyRequests(@Req() req) {
    const userId = req.user.userId;
    return this.rewardRequestService.findByUser(userId);
  }

  // 전체 요청 이력 (ADMIN, OPERATOR, AUDITOR만 가능)
  @Get()
  @Roles('ADMIN', 'OPERATOR', 'AUDITOR')
  findAll() {
    return this.rewardRequestService.findAll();
  }

}