import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Event extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop()
  condition: string;

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
