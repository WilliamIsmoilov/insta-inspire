import { Module } from '@nestjs/common';
import { BoardArticleService } from './board-article.service';
import { MongooseModule } from '@nestjs/mongoose';
import BoardArticleSchema from '../../schemas/BoardArticle.model';
import { MemberModule } from '../member/member.module';
import { BoardArticleResolver } from './board-article.resolver';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{
      name: "BoardArticle",
      schema: BoardArticleSchema
    }]),
    AuthModule,
    MemberModule
  ],
  providers: [BoardArticleResolver, BoardArticleService],
  exports: [BoardArticleService]
})
export class BoardArticleModule {}
