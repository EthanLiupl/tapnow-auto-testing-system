import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { spawn, SpawnOptions } from 'child_process';

const EVERY_1_HOURS = '0 0 */1 * * *';
const EVERY_12_HOURS = '0 0 12 * * *';

export function run(cmd: string, options?: SpawnOptions): Promise<any> {
  const [command, ...args] = cmd.split(/\s+/);
  return new Promise((resolve, reject) => {
    const cp = spawn(command, args, options);
    cp.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`${command} process exited with code ${code}`));
      }
      return resolve(code);
    });
    cp.on('error', (err) => {
      return reject(err);
    });
  });
}

@Injectable()
export class AppSchedule {
  // Delete unused mersure info, default 2 hours ago.
  async runCaseWithRegister() {
    try {
      console.log(process.env.CASE_WITH_REGISTER_SCRIPT);
      await run(`${process.env.CASE_WITH_REGISTER_SCRIPT}`, {
        cwd: process.env.CASE_RUNNING_CWD,
        stdio: 'inherit',
      });
    } catch (error) {
      console.log('runCaseWithRegister error', error);
    }
  }

  async runCaseWithoutRegister() {
    try {
      await run(`${process.env.CASE_WITHOUT_REGISTER_SCRIPT}`, {
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
