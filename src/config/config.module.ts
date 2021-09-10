import { ConfigModule as NestConfigModule } from '@nestjs/config';
const configuration = [];

const configValidationOptions = {
  allowUnknown: true,
  abortEarly: true,
};

const ConfigModule = NestConfigModule.forRoot({
  // 单元测试时，引用的时.env 里面的环境变量;
  // 非单元测试时, 读取 .env.dev && .env,  变量在两个文件中均存在的, .env.dev 文件优先
  envFilePath: ['.env'],
  isGlobal: true,
  load: configuration,
  validationOptions: configValidationOptions,
});

export { ConfigModule };
