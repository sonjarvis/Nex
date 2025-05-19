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
    private readonly requestModel: Model<RewardRequest>,

    @InjectModel(Event.name)
    private readonly eventModel: Model<Event>,

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

    // 유저 정보 조회 (username, loginCount)
    const userRes = await this.httpService.axiosRef.get(`http://auth-service:3001/users/${userId}`);
    const user = userRes.data;

    // 이벤트 정보 조회
    const event = await this.eventModel.findById(eventId);
    if (!event || !event.condition) {
      throw new HttpException('이벤트가 존재하지 않거나 조건이 없습니다', HttpStatus.BAD_REQUEST);
    }

    const { type, count } = event.condition;

    if (!user || typeof user.loginCount !== 'number') {
      return {
        status: 'FAILED',
        reason: '존재하지 않는 유저 또는 loginCount 누락',
      } as any;
    }

    // 이벤트 기간 및 상태 체크
    const now = new Date();
    if (!event.isActive) {
      return await this.requestModel.create({
        userId,
        username: user.username || '알 수 없음',
        eventId,
        eventTitle: event.title || '제목 없음',
        status: 'FAILED',
        reason: '비활성화된 이벤트입니다',
      });
    }

    if (event.startDate && new Date(event.startDate) > now || event.endDate && new Date(event.endDate) < now) {
      return await this.requestModel.create({
        userId,
        username: user.username || '알 수 없음',
        eventId,
        eventTitle: event.title || '제목 없음',
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
      username: user.username,
      eventId,
      eventTitle : event.title,
      status: meetsCondition ? 'SUCCESS' : 'FAILED',
      reason: meetsCondition
        ? undefined
        : `${type} 횟수 ${count}회 미만 (현재 ${userValue})`,
    });

    return result;
  }

  async findByUser(userId: string) {
    return this.requestModel.find({ userId }).populate(['eventId', 'userId']);
  }

  async findAll() {
    return this.requestModel.find().sort({ createdAt: -1 });
  }

  // 관리자 보상 조회 필터
  async findAllWithFilter(filter: { eventId?: string; status?: string }) {
    const query: any = {};
    if (filter.eventId) query.eventId = filter.eventId;
    if (filter.status) query.status = filter.status;

    return this.requestModel
      .find(query)
      .populate(['eventId', 'userId'])
      .sort({ createdAt: -1 });
  }
}
