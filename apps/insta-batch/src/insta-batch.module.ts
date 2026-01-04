import { Module } from '@nestjs/common';
import { InstaBatchController } from './insta-batch.controller';
import { InstaBatchService } from './insta-batch.service';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { MongooseModule } from '@nestjs/mongoose';
import PostSchema from 'apps/insta-api/src/schemas/Post.model';
import MemberSchema from 'apps/insta-api/src/schemas/Member.Model';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    ScheduleModule.forRoot(),
    MongooseModule.forFeature([{name: 'Post', schema: PostSchema}]),
    MongooseModule.forFeature([{ name: 'Member', schema: MemberSchema}])  
  ],
  controllers: [InstaBatchController],
  providers: [InstaBatchService],
})
export class InstaBatchModule {}
