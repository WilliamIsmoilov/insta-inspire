import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentResolver } from './comment.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import CommentSchema from '../../schemas/Comment.model';
import { AuthModule } from '../auth/auth.module';
import { MemberModule } from '../member/member.module';
import { PostModule } from '../post/post.module';
import { BoardArticleModule } from '../board-article/board-article.module';
import { LikeModule } from '../like/like.module';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: 'Comment',
      schema: CommentSchema
    }]),
    AuthModule,
    MemberModule,
    PostModule,
    BoardArticleModule,
    LikeModule
  ],

  providers: [CommentService, CommentResolver],
  exports: [CommentService]
})
export class CommentModule {}
