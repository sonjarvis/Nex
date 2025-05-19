import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Event } from './schemas/event.schema';
import { Model } from 'mongoose';
import { CreateEventDto } from './dto/create_event.dto';
import { Reward } from '../rewards/schemas/reward.schema';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<Event>,
    @InjectModel(Reward.name) private rewardModel: Model<Reward>,
  ) {}

  // 등록
  async create(dto: CreateEventDto, user: any): Promise<Event> {
    const createdEvent = new this.eventModel({
      ...dto,
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
      createdBy: user.username,
    });
    return createdEvent.save();
  }

  // 삭제
  async delete(id: string): Promise<Event> {
    return this.eventModel.findByIdAndDelete(id);
  }

  async findAll() {
    try{
      const events = await this.eventModel.find();
      return events ?? [];
    }catch (err){
      console.error('❗ EventService findAll 오류:', err);
      throw err;
    }
  }

  async findAllWithReward(): Promise<any[]> {
    const events = await this.eventModel.find().lean();

    const rewards = await this.rewardModel.find().lean();
    const rewardMap = new Map(rewards.map(r => [r.eventId.toString(), r]));

    return events.map(event => ({
      ...event,
      reward: rewardMap.get(event._id.toString()) || null,
    }));
  }
}
