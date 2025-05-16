// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({}), // 발급은 안 하고 검증만 하므로 옵션 생략 가능
    ConfigModule, // configService 사용 가능하게
  ],
  providers: [JwtStrategy],
})
export class AuthModule {}
