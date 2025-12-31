import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, Posts } from '../../libs/dto/post/post';
import { Model, ObjectId } from 'mongoose';
import { AllPostsInquery, PostInput, PostInquery } from '../../libs/dto/post/post.input';
import { MemberService } from '../member/member.service';
import { Direction, Message } from '../../libs/enums/common.enum';
import { StatisticModifier, T } from '../../libs/types/common';
import { PostUpdate } from '../../libs/dto/post/post.update';
import { PostStatus, PostType } from '../../libs/enums/post.enum';
import { shapeIntoMongoObjectId } from '../../libs/config';


@Injectable()
export class PostService {
    constructor(
        @InjectModel('Post')
        private readonly postModel: Model<Post>,
         private memberService: MemberService,
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
            return targetPost
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
                    {$limit: input.limit}
                    //meLiked
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
                    {$limit: input.limit}

                ],
                metaCounter: [{$count: 'total'}]
            }}
        ]).exec()
        if(!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
        return result[0]
     }
}
