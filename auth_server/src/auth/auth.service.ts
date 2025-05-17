import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dto/create_user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
    ) {}

    async register(createUserDto: CreateUserDto) {
        return this.userService.createUser(createUserDto);
    }

    async login(username: string, password: string) {
        const user = await this.userService.findByUsername(username);
        if (!user) {
            throw new UnauthorizedException('회원 정보가 없습니다.');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('비밀번호를 확인 해 주세요.');
        }

        user.loginCount = (user.loginCount || 0) + 1;
        await user.save();

        const payload = { username: user.username, role: user.role, sub: user._id };
        const token = this.jwtService.sign(payload);

        return {
            access_token: token,
            user: {
                username: user.username,
                role: user.role,
            },
        };
    }
}
