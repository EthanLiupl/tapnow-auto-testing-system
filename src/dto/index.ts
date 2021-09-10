import { ApiProperty } from '@nestjs/swagger';
import { EJobName } from 'src/enum';

export class UpdateScriptRequest {
  @ApiProperty({
    description: '任务名称',
    example: EJobName.caseWithRegisterJob,
    enum: EJobName,
  })
  jobName: EJobName;

  @ApiProperty({
    description: '要运行的shell脚本',
    example: 'echo 123',
  })
  script: string;
}
