import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Event extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({
    type: {
      type: String, // LOGIN, QUEST 등
      required: true,
      enum: ['LOGIN', 'QUEST', 'BOSS'],
    },
    count: {
      type: Number,
      required: true,
    },
  })
  condition: {
    type: string;
    count: number;
  };

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  createdBy: string;

}

export const EventSchema = SchemaFactory.createForClass(Event);
