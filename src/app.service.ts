import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { EJobName } from './enum';

@Injectable()
export class AppService {
  public scripts: {
    caseWithRegisterJob: string;
    caseWithoutRegisterJob: string;
  };

  constructor() {
    this.scripts = {
      caseWithRegisterJob: process.env.CASE_WITH_REGISTER_SCRIPT,
      caseWithoutRegisterJob: process.env.CASE_WITHOUT_REGISTER_SCRIPT,
    };
  }

  updateScript(key: EJobName, value: string) {
    this.scripts[key] = value;
  }

  getScripts() {
    return this.scripts;
  }

  getHello(): string {
    return 'Hello World!';
  }

  async sendMessageToSlack(
    options: { channel?: string; message?: string } = {},
  ) {
    const { channel, message } = options;
    const url = 'https://slack.com/api/chat.postMessage';
    const res = await axios.post(
      url,
      {
        channel: channel || '#test',
        text:
          message ||
          'Test message from TapNow Frontend Auto Tesing, please ignore it.',
        username: 'TapNow Frontend Auto Tesing Bot',
      },
      { headers: { authorization: `Bearer ${process.env.SLACK_TOKEN}` } },
    );

    console.log('sendMessageToSlack, response data:', res.data);
    return res.data;
  }
}
