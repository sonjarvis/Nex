import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RewardRequestsController } from './reward_requests.controller';

@Module({
  imports: [HttpModule],
  controllers: [RewardRequestsController],
})
export class RewardRequestsModule {}
