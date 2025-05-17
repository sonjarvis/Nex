import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum Role {
    USER = 'USER',
    OPERATOR = 'OPERATOR',
    AUDITOR = 'AUDITOR',
    ADMIN = 'ADMIN',
}

@Schema()
export class User {
    @Prop({ required: true, unique: true })
    username: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true, enum: Role })
    role: Role;

    @Prop({ default: 0 })
    loginCount: number;

    @Prop({ default: 0 })
    questCount: number;

    @Prop({ default: 0 })
    bossClearCount: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
