import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MemberModule } from './member/member.module';
import { StoryModule } from './story/story.module';
import { PostModule } from './post/post.module';
import { BoardArticleResolver } from './board-article/board-article.resolver';
import { BoardArticleModule } from './board-article/board-article.module';
import { ViewModule } from './view/view.module';
import { CommentModule } from './comment/comment.module';
import { LikeModule } from './like/like.module';
import { FollowModule } from './follow/follow.module';

@Module({
  imports: [AuthModule, MemberModule, StoryModule, PostModule, BoardArticleModule, ViewModule, CommentModule, LikeModule, FollowModule],
  providers: [BoardArticleResolver]
})
export class ComponentsModule {}
