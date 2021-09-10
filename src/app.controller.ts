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
  @ApiQuery({ name: 'channel', type: String, example: '#tapnow-deploy-alert' })
  @ApiQuery({
    name: 'message',
    type: String,
    example: 'Test message from TapNow Frontend Auto Tesing, Pease ignore it.',
  })
  sendMessageToSlack(@Query() payload: any): any {
    return this.appService.sendMessageToSlack(payload);
  }
}
