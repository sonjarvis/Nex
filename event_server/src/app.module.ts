// src/app.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { EventsModule } from './events/events.module';
import { AuthModule } from './auth/auth.module';
import { RewardsModule } from './rewards/rewards.module';
import { RewardRequestsModule } from './reward_requests/reward_requests.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI || 'mongodb://mongo:27017/eventdb'),
    EventsModule,
    AuthModule,
    RewardsModule,
    RewardRequestsModule
  ],
})
export class AppModule {}
