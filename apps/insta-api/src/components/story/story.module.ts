import { Module } from '@nestjs/common';
import { StoryService } from './story.service';
import { StoryResolver } from './story.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import StorySchema from '../../schemas/Story.model'
import { MemberModule } from '../member/member.module';
import { ViewModule } from '../view/view.module';
import { LikeModule } from '../like/like.module';
import ViewSchema from '../../schemas/View.model';

@Module({
  imports: [
    MongooseModule.forFeature([{name: 'Story', schema: StorySchema}]),
    MongooseModule.forFeature([{name: 'View', schema: ViewSchema}]),
    AuthModule,
    MemberModule,
    ViewModule,
    LikeModule
  ],
  providers: [StoryService, StoryResolver],
  exports: [StoryService]
})
export class StoryModule {}
