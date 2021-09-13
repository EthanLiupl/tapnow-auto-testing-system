import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { EJobName } from './enum';
import AWS from 'aws-sdk';
import fs from 'fs';
import moment from 'moment';

@Injectable()
export class AppService {
  public scripts: {
    caseWithRegisterJob: string;
    caseWithoutRegisterJob: string;
  };

  private s3: AWS.S3;

  constructor() {
    this.scripts = {
      caseWithRegisterJob: process.env.CASE_WITH_REGISTER_SCRIPT,
      caseWithoutRegisterJob: process.env.CASE_WITHOUT_REGISTER_SCRIPT,
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

  async sendHtmlToS3() {
    const file = fs.readFileSync(process.env.LOCAL_HTML_REPORT_DIR);
    console.log(file);
    try {
      const { Key } = await this.s3
        .upload({
          Bucket: 'tapnow-dev',
          Key: `doc/frontend-auto-testing-report-${moment().format(
            'YYYYMMDD',
          )}.html`,
          Body: file,
          ACL: 'public-read',
          ContentType: 'text/html',
        })
        .promise();
      return `https://tapnow-dev.s3.ap-southeast-1.amazonaws.com/${Key}`;
    } catch (error) {
      console.log('error:', error);
    }
  }
}
