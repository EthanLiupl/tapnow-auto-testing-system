import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { EJobName } from './enum';
import AWS from 'aws-sdk';
import moment from 'moment';
import { run } from './utils';

@Injectable()
export class AppService {
  public scripts: {
    caseWithRegisterJob: string;
    caseWithoutRegisterJob: string;
    syncReportToS3: string;
  };

  private s3: AWS.S3;

  constructor() {
    this.scripts = {
      caseWithRegisterJob: process.env.CASE_WITH_REGISTER_SCRIPT,
      caseWithoutRegisterJob: process.env.CASE_WITHOUT_REGISTER_SCRIPT,
      syncReportToS3: process.env.SYNC_REPORT_TO_S3,
    };
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
      region: process.env.AWS_S3_REGION,
    });
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

  async sendReportToS3() {
    const subDirectory = moment().format('YYYYMMDDHHmmss');
    try {
      await run(`${this.scripts.syncReportToS3} ${subDirectory}`, {
        cwd: process.env.CASE_RUNNING_CWD,
        stdio: 'inherit',
      });
      return `https://tapnow-dev.s3.ap-southeast-1.amazonaws.com/doc/testing-reports/${subDirectory}/index.html`;
    } catch (error) {
      console.log('sendReportToS3 error', error);
    }
  }
}
