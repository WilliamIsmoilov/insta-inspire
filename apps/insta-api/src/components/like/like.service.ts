import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Like, MeLiked } from '../../libs/dto/like/like';
import { LikeInput } from '../../libs/dto/like/like.input';
import { T } from '../../libs/types/common';
import { Message } from '../../libs/enums/common.enum';
import { OrdinaryInquiry } from '../../libs/dto/post/post.input';
import { Posts } from '../../libs/dto/post/post';
import { LikeGroup } from '../../libs/enums/like.enum';
import { lookupFavourite } from '../../libs/config';

@Injectable()
export class LikeService {
    constructor(
        @InjectModel('Like')
        private readonly likeModel: Model<Like>,

    ){}

    public async toggleLike(input: LikeInput): Promise<number>{
        const search: T = {memberId: input.memberId, likeRefId: input.likeRefId},
        exist = await this.likeModel.findOne(search).exec()
        let modifier = 1

        if(exist){
            await this.likeModel.findOneAndDelete(search).exec()
            modifier = -1
        } else {
            try {
                await this.likeModel.create(input)
            } catch (err) {
                console.log('error: like toggle:', err)
                throw new InternalServerErrorException(Message.CREATE_FAILED)
            }
        }
        console.log(`-- LIKE MODIFIER ${modifier} --`)
        return modifier
    }

    public async checkLikeExistence(input: LikeInput): Promise<MeLiked[]>{
        const{memberId, likeRefId} = input
        const result = await this.likeModel.findOne({memberId: memberId, likeRefId: likeRefId}).exec()

        return result ? [{memberId: memberId, likeRefId: likeRefId, myFavourite: true}] : []
    }

    public async getMyFavouritePosts(memberId: ObjectId, input: OrdinaryInquiry):Promise<Posts>{
        const {page, limit} = input
        const match: T = {likeGroup: LikeGroup.POST, memberId: memberId}

        const data: T = await this.likeModel.aggregate([
            {$match: match},
            {$sort: {updatedAt: -1}},
            {
                $lookup: {
                    from: 'posts',
                    localField: 'likeRefId',
                    foreignField: '_id',
                    as: 'favouritePost'
                }
            },
            {$unwind: '$favouritePost'},
            {$facet: {
                list: [{$skip: (page -1) * limit},
                    {$limit: limit},
                    lookupFavourite, 
                    {$unwind: '$favouritePost.memberData'}
                ],
                metaCounter: [{$count: 'total'}]
            }}
        ]).exec()

        console.log('data:', data)
        const result: Posts = { list: [], metaCounter: data[0].metaCounter}
        result.list = data[0].list.map((ele) => ele.favouriteProperty);

        return result
    }
}
