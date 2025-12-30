import { Module } from '@nestjs/common';
import { StoryService } from './story.service';
import { StoryResolver } from './story.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import StorySchema from '../../schemas/Story.model'
import { MemberModule } from '../member/member.module';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'Story', schema: StorySchema}]),
    AuthModule,
    MemberModule
  ],
  providers: [StoryService, StoryResolver],
  exports: [StoryService]
})
export class StoryModule {}
