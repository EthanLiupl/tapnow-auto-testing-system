import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { AppService } from './app.service';
import { UpdateScriptRequest } from './dto';
import moment from 'moment-timezone';
import { ctry } from './utils';

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

  @ApiOperation({ summary: 'send html to s3' })
  @Post('/html-to-s3')
  sendHtmlToS3(): any {
    return this.appService.sendReportToS3();
  }

  @ApiOperation({ summary: 'send html to s3' })
  @Post('/uploadHtmlAndNoice')
  async uploadHtmlAndNotice() {
    const url = await ctry(3, () => this.appService.sendReportToS3());
    // const url = await this.appService.sendReportToS3();
    return this.appService.sendMessageToSlack({
      channel: '#tapnow-deploy-alert',
      message: `Newest TapNow frontend auto testing report has generated, link: ${url}\nGenerated At: ${moment()
        .tz('Asia/Hong_Kong')
        .format('YYYY/MM/DD HH:mm:ss ')}
      `,
    });
  }
}
