import {
  Controller, Get, Post, Put, Delete,
  Body, Param, Req, UseGuards,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create_event.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../common/roles.decorator';
import { RolesGuard } from '../common/roles.guard';

@Controller('events')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @Roles('ADMIN', 'OPERATOR')
  async create(@Body() dto: CreateEventDto, @Req() req) {
    return this.eventsService.create(dto, req.user);
  }

  @Get()
  async findAll() {
    return this.eventsService.findAll();
  }

  @Delete(':id')
  @Roles('ADMIN', 'OPERATOR')
  async delete(@Param('id') id: string) {
    return this.eventsService.delete(id);
  }
}
