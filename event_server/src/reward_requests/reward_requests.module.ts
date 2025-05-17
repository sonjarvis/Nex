import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RewardRequestsService } from './reward_requests.service';
import { RewardRequestsController } from './reward_requests.controller';
import { RewardRequest, RewardRequestSchema } from './schemas/reward_request.schema';
import { Event, EventSchema } from '../events/schemas/event.schema';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: RewardRequest.name, schema: RewardRequestSchema },
      { name: Event.name, schema: EventSchema },
    ]),
    HttpModule,
  ],
  controllers: [RewardRequestsController],
  providers: [RewardRequestsService],
})
export class RewardRequestsModule {}
