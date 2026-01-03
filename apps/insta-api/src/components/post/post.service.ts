import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, Posts } from '../../libs/dto/post/post';
import { Model, ObjectId } from 'mongoose';
import { AllPostsInquery, OrdinaryInquiry, PostInput, PostInquery } from '../../libs/dto/post/post.input';
import { MemberService } from '../member/member.service';
import { Direction, Message } from '../../libs/enums/common.enum';
import { StatisticModifier, T } from '../../libs/types/common';
import { PostUpdate } from '../../libs/dto/post/post.update';
import { PostStatus, PostType } from '../../libs/enums/post.enum';
import { lookupAuthMemberLiked, lookupMember, shapeIntoMongoObjectId } from '../../libs/config';
import { ViewService } from '../view/view.service';
import { LikeService } from '../like/like.service';
import { ViewGroup } from '../../libs/enums/view.enum';
import { LikeGroup } from '../../libs/enums/like.enum';
import { Like } from '../../libs/dto/like/like';
import { LikeInput } from '../../libs/dto/like/like.input';


@Injectable()
export class PostService {
    constructor(
        @InjectModel('Post')
        private readonly postModel: Model<Post>,
         private memberService: MemberService,
         private viewService: ViewService,
         private likeServica: LikeService
    ){}

    public async createPost(input: PostInput): Promise<Post>{
        try {
            const result = await this.postModel.create(input)

            await this.memberService.memberStatsEditor({
                _id: result.memberId,
                targetKey: 'memberPosts',
                modifier: 1
            })
            return result
        } catch (err) {
            console.log('Error, Service.Model:', err.message)
            throw new BadRequestException(Message.CREATE_FAILED)
        }
    }


    public async getPost(memberId: ObjectId, postId: ObjectId): Promise<Post>{
        
        const targetPost = await this.postModel.findOne({_id: postId}).lean().exec()
        if(!targetPost) throw new InternalServerErrorException(Message.NO_DATA_FOUND)
        // todo memberview 
    if(memberId){
        const viewInput = {memberId: memberId, viewRefId: postId, viewGroup: ViewGroup.POST};
        const newView = await this.viewService.recordView(viewInput)

        if(newView){
            await this.postStatsEditor({
                _id: postId,
                targetKey: 'postlikes',
                modifier: 1
            })
            targetPost.postViews++
        }

        //me liked
        const likeInput = {memberId: memberId, likeRefId: postId, likeGroup: LikeGroup.POST}
        targetPost.meLiked = await this.likeServica.checkLikeExistence(likeInput)
    }
        targetPost.memberData = await this.memberService.getMember( null, targetPost.memberId);
        return targetPost;
    }

    public async postStatsEditor(input: StatisticModifier): Promise<Post>{
        const {_id, targetKey, modifier} = input

        return await this.postModel.findByIdAndUpdate(
            _id, {$inc: {[targetKey]: modifier}},
            {new: true}
        ).exec()
    }

    public async updatePost(memberId: ObjectId, input: PostUpdate): Promise<Post>{
        const {postStatus } = input
        const search: T = {
            _id: input._id,
            memberId: memberId,
        }

        const result = await this.postModel
        .findOneAndUpdate(search, input, {new: true}).exec()

        if(!result) throw  new InternalServerErrorException(Message.UPDATE_FAILED)

        if( postStatus === PostStatus.DELETE){
            await this.memberService.memberStatsEditor({
                _id: memberId,
                targetKey: 'memberPosts',
                modifier: -1
            })
        }
        return result
    }

    public async getPosts(memberId: ObjectId, input: PostInquery): Promise<Posts>{
        const match: T = {postStatus: PostStatus.ACTIVE}
        const sort: T = {[input?.sort ?? 'postLikes']: input?.direction ?? Direction.DESC}

        this.shapeMatchQuery(match, input);
        console.log('match:', match)

        const  result = await this.postModel.aggregate([
            {$match: match},
            {$sort: sort},
            {$facet: {
                list: [{$skip: (input.page -1) * input.limit },
                    {$limit: input.limit},
                    //meLiked
                    lookupAuthMemberLiked(memberId),
                    lookupMember,
                    {$unwind: '$memberData'}
                ],
                metaCounter:[{$count: 'total'}]
            }}
        ]).exec()
        if(!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND)
            return result[0]
    }


     private shapeMatchQuery(match: T, input: PostInquery): void{
            const {
                memberId,
                postType,
                likedMost,
                postTitle
                
            }= input.search;
            if(memberId) match.memberId = shapeIntoMongoObjectId(memberId);
            if(postType) match.postType = {$in: Object.values(PostType)}
            if(likedMost) match.postLikes = {$gte: likedMost.start, $lte: likedMost.end }
            if(postTitle) match.propertyTitle = {$regex: new RegExp(postTitle, 'i')};
     }


     public async getFavourite(memberId: ObjectId, input: OrdinaryInquiry): Promise<Posts>{
        return await this.likeServica.getMyFavouritePosts(memberId, input)
     }

      /**    LIKE TARGET    **/

     public async likeTargetPost(memberId: ObjectId, likeRefId: ObjectId): Promise<Post>{
        console.log('Mutation likeRefId')
        const target: Post = await this.postModel.findOne({
            _id: likeRefId,
            postStatus: PostStatus.ACTIVE
        }).exec()

        if(!target) throw new InternalServerErrorException(Message.NO_DATA_FOUND)

            const input: LikeInput = {
                memberId: memberId,
                likeRefId: likeRefId,
                likeGroup: LikeGroup.POST
            }
            const modifier: number = await this.likeServica.toggleLike(input);
            const result = await this.postStatsEditor({
                _id: likeRefId,
                targetKey: 'postLikes',
                modifier: modifier
            })
            if(!result) throw new InternalServerErrorException(Message.SOMETHING_WENT_WRONG);
      return result;
     }


     /**    ADMIN    **/

     public async getAllPostsByAdmin(input: AllPostsInquery): Promise<Posts>{
        const {postStatus, postType } = input.search
        const match: T = {};
        const sort: T = {[input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC}

        if(postStatus) match.postStatus = postStatus;
        if(postType) {
            const types = Array.isArray(postType) ? postType : [postType];
            match.postType = {$in: types}
        }
        const result = await this.postModel.aggregate([
            {$match: match},
            {$sort: sort},
            {$facet: {
                list: [{$skip: (input.page - 1) * input.limit},
                    {$limit: input.limit},
                    lookupMember,
                    { $unwind: '$memberData' },

                ],
                metaCounter: [{$count: 'total'}]
            }}
        ]).exec()
        if(!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
        return result[0]
     }

     public async removePostByAdmin(postId: ObjectId): Promise<Post>{
       
        const result = await this.postModel.findOneAndDelete({_id: postId}).exec()
        if(!result) throw new InternalServerErrorException(Message.BAD_REQUEST);
            return result
     }


    
}
