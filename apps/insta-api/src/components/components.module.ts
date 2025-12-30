import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MemberModule } from './member/member.module';
import { StoryModule } from './story/story.module';

@Module({
  imports: [AuthModule, MemberModule, StoryModule]
})
export class ComponentsModule {}
