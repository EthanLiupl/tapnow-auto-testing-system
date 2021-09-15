import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AppService } from './app.service';
import { run } from './utils';

const EVERY_1_HOURS = '0 0 */1 * * *';
const EVERY_12_HOURS = '0 0 12 * * *';

// const EVERY_1_HOURS = '*/1 * * * * *';
// const EVERY_12_HOURS = '*/1 * * * * *';

@Injectable()
export class AppSchedule {
  constructor(private readonly appService: AppService) {}
  // Delete unused mersure info, default 2 hours ago.
  async runCaseWithRegister() {
    try {
      await run(`${this.appService.scripts.caseWithRegisterJob}`, {
        cwd: process.env.CASE_RUNNING_CWD,
        stdio: 'inherit',
      });
    } catch (error) {
      console.log('runCaseWithRegister error', error);
    }
  }

  async runCaseWithoutRegister() {
    try {
      await run(`${this.appService.scripts.caseWithoutRegisterJob}`, {
        cwd: process.env.CASE_RUNNING_CWD,
        stdio: 'inherit',
      });
    } catch (error) {
      console.log('runCaseWithoutRegister error', error);
    }
  }

  @Cron(EVERY_1_HOURS)
  async handleLoginCron() {
    try {
      await this.runCaseWithRegister();
    } catch (error) {
      console.log('runCaseWithRegister error', error);
    }
  }
  @Cron(EVERY_12_HOURS)
  async handleRemoveCron() {
    try {
      await this.runCaseWithoutRegister();
    } catch (error) {
      console.log('runCaseWithoutRegister error', error);
    }
  }
}
