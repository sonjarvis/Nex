import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { JwtAuthGuard } from '../auth/jwt_auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('events')
@UseGuards(JwtAuthGuard, RolesGuard)
export class EventsController {
    constructor(private readonly httpService: HttpService) {}

    @Get()
    @Roles('USER', 'OPERATOR', 'ADMIN')
    async getEvents(@Req() req) {
        const response = await firstValueFrom(
            this.httpService.get('http://event-service:3002/events')
        );
        return response.data;
    }

    @Get()
    @Roles('USER', 'ADMIN', 'OPERATOR')
    async findAll(@Req() req) {
        console.log('🔥 Request User:', req.user);
        return { message: `Hello ${req.user.username} (role: ${req.user.role})` };
    }

    @Post()
    @Roles('OPERATOR', 'ADMIN')
    async createEvent(@Body() body: any, @Req() req) {
        const response = await firstValueFrom(
            this.httpService.post('http://event-service:3002/events', body)
        );
        return response.data;
    }
}
