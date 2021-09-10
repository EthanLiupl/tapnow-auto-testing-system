import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AppService } from './app.service';
import { UpdateScriptRequest } from './dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: '发送Slack消息' })
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

  @ApiOperation({ summary: '获取当前配置的 shell 脚本信息' })
  @Get('/scripts')
  getScript(): any {
    return this.appService.getScripts();
  }

  @ApiOperation({ summary: '更新当前配置的 shell 脚本信息' })
  @Post('/scripts')
  updateScript(@Body() payload: UpdateScriptRequest): any {
    const { jobName, script } = payload;
    return this.appService.updateScript(jobName, script);
  }
}
