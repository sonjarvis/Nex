import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RewardRequest } from './schemas/reward_request.schema';
import { Event } from '../events/schemas/event.schema';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class RewardRequestsService {
  constructor(
    @InjectModel(RewardRequest.name)
    private requestModel: Model<RewardRequest>,

    @InjectModel(Event.name)
    private eventModel: Model<Event>,

    private readonly httpService: HttpService,
  ) {}

  async create(userId: string, eventId: string): Promise<RewardRequest> {
    // 중복 요청 방지
    const already = await this.requestModel.findOne({ userId, eventId });
    if (already) {
      return {
        ...already.toObject(),
        status: 'FAILED',
        reason: '이미 요청한 보상입니다',
      } as any;
    }

    // 이벤트 정보 조회
    const event = await this.eventModel.findById(eventId);
    if (!event || !event.condition) {
      throw new HttpException('이벤트가 존재하지 않거나 조건이 없습니다', HttpStatus.BAD_REQUEST);
    }

    const { type, count } = event.condition;

    // 유저 정보 조회
    let user;
    try {
      const res = await firstValueFrom(
        this.httpService.get(`http://auth-service:3001/users/${userId}`)
      );
      user = res.data;
    } catch (err) {
      throw new HttpException('유저 정보를 불러올 수 없습니다', HttpStatus.BAD_REQUEST);
    }

    // 이벤트 기간 및 상태 체크
    const now = new Date();
    if (!event.isActive) {
      return await this.requestModel.create({
        userId,
        eventId,
        status: 'FAILED',
        reason: '비활성화된 이벤트입니다',
      });
    }

    if (event.startDate && new Date(event.startDate) > now || event.endDate && new Date(event.endDate) < now) {
      return await this.requestModel.create({
        userId,
        eventId,
        status: 'FAILED',
        reason: '이벤트 기간이 아닙니다',
      });
    }

    // 조건별 유저 값 비교
    let userValue = 0;
    switch (type) {
      case 'LOGIN':
        userValue = user.loginCount;
        break;
      case 'QUEST':
        userValue = user.questCount;
        break;
      case 'BOSS':
        userValue = user.bossClearCount;
        break;
      default:
        throw new HttpException('지원하지 않는 조건 타입입니다', HttpStatus.BAD_REQUEST);
    }

    const meetsCondition = userValue >= count;

    const result = await this.requestModel.create({
      userId,
      eventId,
      status: meetsCondition ? 'SUCCESS' : 'FAILED',
      reason: meetsCondition
        ? undefined
        : `${type} 횟수 ${count}회 미만 (현재 ${userValue})`,
    });

    return result;
  }

  async findByUser(userId: string) {
    return this.requestModel.find({ userId });
  }
}
