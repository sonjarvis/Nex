import { Controller, Get } from '@nestjs/common';

@Controller('events')
export class EventsController {
  @Get()
  findAll() {
    return { message: 'This is event-service response' };
  }
}