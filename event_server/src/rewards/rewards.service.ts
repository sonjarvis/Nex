import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reward } from './schemas/reward.schema';
import { CreateRewardDto } from './dto/create_reward.dto';

@Injectable()
export class RewardsService {
  constructor(
    @InjectModel(Reward.name) private rewardModel: Model<Reward>,
  ) {}

  async create(eventId: string, dto: CreateRewardDto): Promise<Reward> {
    return this.rewardModel.create({ ...dto, eventId });
  }

  async findByEvent(eventId: string): Promise<Reward[]> {
    return this.rewardModel.find({ eventId });
  }
}
