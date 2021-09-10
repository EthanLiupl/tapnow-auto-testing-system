import { Controller, Get, Query } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/send')
  @ApiQuery({ name: 'channel', type: String })
  @ApiQuery({ name: 'message', type: String })
  sendMessageToSlack(@Query() payload: any): any {
    return this.appService.sendMessageToSlack(payload);
  }
}
