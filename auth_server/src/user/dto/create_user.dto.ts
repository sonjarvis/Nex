import { IsString, IsEnum } from 'class-validator';
import { Role } from '../schemas/user.schema';

export class CreateUserDto {
    @IsString()
    username: string;

    @IsString()
    password: string;

    @IsEnum(Role)
    role: Role;
}