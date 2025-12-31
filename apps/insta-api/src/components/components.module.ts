import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MemberModule } from './member/member.module';
import { StoryModule } from './story/story.module';
import { PostModule } from './post/post.module';

@Module({
  imports: [AuthModule, MemberModule, StoryModule, PostModule]
})
export class ComponentsModule {}
