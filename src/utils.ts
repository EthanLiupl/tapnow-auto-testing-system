import { spawn, SpawnOptions } from 'child_process';

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

export async function ctry(times: number, fn: (...arg: any) => Promise<any>) {
  try {
    console.log(`倒数第${times}次尝试...`);
    return await fn();
  } catch (error) {
    times--;
    if (times > 0) return ctry(times, fn);
    else throw new Error('-1');
  }
}
