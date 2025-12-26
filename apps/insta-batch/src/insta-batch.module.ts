import { Module } from '@nestjs/common';
import { InstaBatchController } from './insta-batch.controller';
import { InstaBatchService } from './insta-batch.service';

@Module({
  imports: [],
  controllers: [InstaBatchController],
  providers: [InstaBatchService],
})
export class InstaBatchModule {}
