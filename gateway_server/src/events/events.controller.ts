import {
    Controller,
    Post,
    Get,
    Body,
    Req,
    UseGuards,
    HttpException,
    HttpStatus, Put, Param, Delete,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AuthGuard } from '@nestjs/passport';
import { firstValueFrom } from 'rxjs';

@Controller('events')
@UseGuards(AuthGuard('jwt'))
export class EventsController {
    constructor(private readonly httpService: HttpService) {}

    @Post()
    async create(@Req() req, @Body() body: any) {
        try {
            const token = req.headers.authorization;
            const response = await firstValueFrom(
              this.httpService.post('http://event-service:3002/events', body, {
                  headers: { Authorization: token },
              }),
            );
            return response.data;
        } catch (error: any) {
            throw new HttpException(
              error.response?.data || 'Event create failed',
              error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() body: any, @Req() req) {
        const token = req.headers.authorization;
        const response = await firstValueFrom(
          this.httpService.put(`http://event-service:3002/events/${id}`, body, {
              headers: { Authorization: token },
          }),
        );
        return response.data;
    }

    @Delete(':id')
    async delete(@Param('id') id: string, @Req() req) {
        const token = req.headers.authorization;
        const response = await firstValueFrom(
          this.httpService.delete(`http://event-service:3002/events/${id}`, {
              headers: { Authorization: token },
          }),
        );
        return response.data;
    }

    @Get()
    async findAll(@Req() req) {
        try {
            const token = req.headers.authorization;
            const response = await firstValueFrom(
              this.httpService.get('http://event-service:3002/events', {
                  headers: { Authorization: token },
              }),
            );
            return response.data;
        } catch (error: any) {
            throw new HttpException(
              error.response?.data || 'Event fetch failed',
              error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
}
