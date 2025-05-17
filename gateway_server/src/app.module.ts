import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { RewardsModule } from './rewards/rewards.module';
import { RewardRequestsModule } from './reward_requests/reward_requests.module';
import { JwtStrategy } from './auth/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HttpModule,
    AuthModule,
    EventsModule,
    RewardsModule,
    RewardRequestsModule
  ],
  providers: [JwtStrategy],
})
export class AppModule {}