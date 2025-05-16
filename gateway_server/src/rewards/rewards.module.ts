import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RewardsController } from './rewards.controller';

@Module({
  imports: [HttpModule],
  controllers: [RewardsController],
})
export class RewardsModule {}
