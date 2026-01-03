import { Comment, Comments } from './../../libs/dto/comment/comment';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { MemberService } from '../member/member.service';
import { PostService } from '../post/post.service';
import { BoardArticleService } from '../board-article/board-article.service';
import { CommentInput, CommentsInquiry } from '../../libs/dto/comment/comment.input';
import { Direction, Message } from '../../libs/enums/common.enum';
import { CommentGroup, CommentStatus } from '../../libs/enums/comment.enum';
import { CommentUpdate } from '../../libs/dto/comment/comment.update';
import { StatisticModifier, T } from '../../libs/types/common';
import { lookupMember } from '../../libs/config';
import { LikeInput } from '../../libs/dto/like/like.input';
import { LikeGroup } from '../../libs/enums/like.enum';
import { LikeService } from '../like/like.service';

@Injectable()
export class CommentService {
    constructor(
        @InjectModel('Comment')
        private readonly commentModel: Model<Comment>,
        private readonly memberService: MemberService,
        private readonly postService: PostService,
        private readonly boardArticleService: BoardArticleService,
        private readonly likeService: LikeService
    ){}

    public async createComment(memberId: ObjectId, input: CommentInput): Promise<Comment>{
        input.memberId = memberId
        let result = null

        try {
            result = await this.commentModel.create(input)
        } catch (err) {
            console.log('Error comment Service Model:', err)
            throw new InternalServerErrorException(Message.CREATE_FAILED)
        }

        switch(input.commentGroup){
            case CommentGroup.POST:
                await this.postService.postStatsEditor({
                    _id: input.commentRefId,
                    targetKey: 'postComments',
                    modifier: 1
                })
                break;

            case CommentGroup.ARTICLE:
                await this.boardArticleService.articleStatsEditor({
                    _id: input.commentRefId,
                    targetKey: 'articleComments',
                    modifier: 1
                })
                break;
                
            case CommentGroup.MEMBER:
                await this.memberService.memberStatsEditor({
                    _id: input.commentRefId,
                    targetKey: 'memberComments',
                    modifier: 1
                })
                break;
        }

        if(!result) throw new InternalServerErrorException(Message.CREATE_FAILED)
            return result
    }


    public async updateComment(memberId: ObjectId, input: CommentUpdate): Promise<Comment>{
        const { _id } = input

        const result = await this.commentModel.findOneAndUpdate(
            {_id: _id, memberId: memberId, commentStatus: CommentStatus.ACTIVE},
            input, {new: true}
        )

        if(!result) throw new InternalServerErrorException(Message.UPDATE_FAILED)
            return result
    }

    public async getComments(memberId: ObjectId, input: CommentsInquiry):Promise<Comments>{
        const {commentRefId} = input.search
        const match: T = {commentRefId: commentRefId, commentStatus: CommentStatus.ACTIVE}
        const sort: T = {[input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC}
        const result: Comments[] = await this.commentModel.aggregate([
            {$match: match},
            {$sort: sort},
            {$facet: {
                list: [
                    {$skip: (input.page -1) * input.limit},
                    {$limit: input.limit},
                    lookupMember,
                    {$unwind: "$memberData"}
                ],
                metaCounter: [{ $count: 'total'}]
            }}
        ])
        if(!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND)
            return result[0]
    }


    /**   ADMIN   **/

    public async removeCommentByAdmin(input: ObjectId):Promise<Comment>{
        const result = await this.commentModel.findOneAndDelete(input)
        if(!result) throw new InternalServerErrorException(Message.NO_DATA_FOUND)
            return result
    }


    /**    LIKE TARGET    **/

    public async likeTargetComment(memberId: ObjectId, likeRefId: ObjectId): Promise<Comment>{
        const target: Comment = await this.commentModel.findOne({
            _id: likeRefId, commentStatus: CommentStatus.ACTIVE
        }).exec()
        if(!target) throw new InternalServerErrorException(Message.NO_DATA_FOUND)

            const input: LikeInput = {
                memberId: memberId,
                likeRefId: likeRefId,
                likeGroup: LikeGroup.COMMENT
            };

            const modifier: number = await this.likeService.toggleLike(input)
            const result = await this.commentStatsEditor({
                _id: likeRefId,
                targetKey: 'commentLikes',
                modifier: modifier
            })

            if(!result) throw new InternalServerErrorException(Message.SOMETHING_WENT_WRONG)
                return result
    }

    public async commentStatsEditor(input: StatisticModifier):Promise<Comment>{
        const {_id, targetKey, modifier} = input
        const result = await this.commentModel.findOneAndUpdate(
            _id, {$inc: {[targetKey]: modifier}},
            {new: true}
        ).exec()
        return result
    }
}
