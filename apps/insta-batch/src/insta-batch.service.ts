import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Member } from 'apps/insta-api/src/libs/dto/member/member';
import { Post } from 'apps/insta-api/src/libs/dto/post/post';
import { MemberStatus } from 'apps/insta-api/src/libs/enums/member.enum';
import { PostStatus } from 'apps/insta-api/src/libs/enums/post.enum';
import { Model } from 'mongoose';

@Injectable()
export class InstaBatchService {

  constructor(
    @InjectModel('Post') private readonly postModel: Model<Post>,
    @InjectModel('Member') private readonly memberModel: Model<Member>
  ){}

  public async batchRollBack(): Promise<void>{
    await this.postModel.updateMany(
      {
        postStatus: PostStatus.ACTIVE
      },
      {
        postRank: 0
      }
    ).exec();
    await this.memberModel.updateMany(
      {
        memberStatus: MemberStatus.ACTIVE
      },
      {
        memberRank: 0
      }
    ).exec()
  }

  public async batchTopPosts(): Promise<void>{
  
    const posts: Post[] = await this.postModel.find({
      postStatus: PostStatus.ACTIVE,
      postRank: 0
    }).exec()

    const promisedList = posts.map(async (ele: Post) => {
      const { _id, postLikes, postViews } = ele;
      const rank = postLikes * 2 + postViews * 1;
      return await this.postModel.findByIdAndUpdate(
        _id,
        {
          postRank: rank
        }
      )
    })
    await Promise.all(promisedList)
  }


  public async batchTopUsers(): Promise<void>{
    const users: Member[] = await this.memberModel.find({
      memberStatus: MemberStatus.ACTIVE,
      memberRank: 0
    }).exec()

    const promisedList  = users.map(async (ele: Member) => {
      const { _id, memberPosts, memberLikes, memberArticles, memberViews, memberFollowers} = ele;
      const rank = memberPosts * 5 + memberFollowers * 4 + memberArticles * 3 + memberLikes * 2 + memberViews * 1;
      return await this.memberModel.findByIdAndUpdate(
        _id,
        {
          memberRank: rank
        }
      )
    })
    
    await Promise.all(promisedList)
  }

  getHello(): string {
    return 'Hello World!';
  }
}
