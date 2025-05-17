import { Controller, Post, Body, UseGuards, Req, Get } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RewardRequestsService } from './reward_requests.service';
import { CreateRewardRequestDto } from './dto/create_reward_request.dto';

@Controller('reward-requests')
@UseGuards(AuthGuard('jwt'))
export class RewardRequestsController {
  constructor(private readonly rewardRequestService: RewardRequestsService) {}

  @Post()
  create(@Req() req, @Body() body: CreateRewardRequestDto) {
    const userId = req.user.userId;
    return this.rewardRequestService.create(userId, body.eventId);
  }

  @Get()
  findMyRequests(@Req() req) {
    const userId = req.user.userId;
    return this.rewardRequestService.findByUser(userId);
  }
}
