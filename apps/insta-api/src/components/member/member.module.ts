import { Module } from '@nestjs/common';
import { MemberService } from './member.service';
import { MemberResolver } from './member.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import MemberSchema from '../../schemas/Member.Model';
import { AuthModule } from '../auth/auth.module';
import { Mongoose } from 'mongoose';
import FollowSchema from '../../schemas/Follow.model';
import { ViewModule } from '../view/view.module';
import { LikeModule } from '../like/like.module';

@Module({
  imports:[
    MongooseModule.forFeature([{name: 'Member', schema: MemberSchema}]),
    MongooseModule.forFeature([{name:'Follow', schema: FollowSchema}]),
    AuthModule,
    ViewModule,
    LikeModule
  ],
  providers: [MemberService, MemberResolver],
  exports: [MemberService]
})
export class MemberModule {}
