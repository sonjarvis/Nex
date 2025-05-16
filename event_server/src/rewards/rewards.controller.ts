import { Controller, Post, Get, Param, Body, UseGuards } from '@nestjs/common';
import { RewardsService } from './rewards.service';
import { CreateRewardDto } from './dto/create_reward.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';

@Controller('events/:eventId/rewards')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Post()
  @Roles('ADMIN', 'OPERATOR')
  create(
    @Param('eventId') eventId: string,
    @Body() dto: CreateRewardDto,
  ) {
    return this.rewardsService.create(eventId, dto);
  }

  @Get()
  findAll(@Param('eventId') eventId: string) {
    return this.rewardsService.findByEvent(eventId);
  }
}
