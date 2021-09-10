import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppSchedule } from './app.schedule';
import { AppService } from './app.service';
import { ConfigModule } from './config';

@Module({
  imports: [ConfigModule, ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, AppSchedule],
})
export class AppModule {}
