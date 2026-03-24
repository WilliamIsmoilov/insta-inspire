import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Story, StoryInput } from '../../libs/dto/story/story';
import { MemberService } from '../member/member.service';
import { Message } from '../../libs/enums/common.enum';
import { StatisticModifier, T } from '../../libs/types/common';
import { LikeService } from '../like/like.service';
import { ViewService } from '../view/view.service';
import { ViewGroup } from '../../libs/enums/view.enum';
import { LikeGroup } from '../../libs/enums/like.enum';
import { LikeInput } from '../../libs/dto/like/like.input';
import { Like } from '../../libs/dto/like/like';
import { View } from '../../libs/dto/view/view';
import { Member } from '../../libs/dto/member/member';
import { lookupMember } from '../../libs/config';

@Injectable()
export class StoryService {
    constructor(
        @InjectModel('Story') private readonly storyModel: Model<Story>,
        @InjectModel('View') private readonly viewModel: Model<View>,
        private memberService: MemberService,
        private readonly likeService: LikeService,
        private  viewService: ViewService
    ){}


    public async createStory(input: StoryInput): Promise<Story>{
        try {
            const result = await this.storyModel.create(input)
            // increase memberStories
            await this.memberService.memberStatsEditor({
                _id: result.memberId,
                targetKey: 'memberStories',
                modifier: 1
            })
            return result
        } catch (err) {
            console.log('Error, Service.Model:', err.message)
            throw new BadRequestException(Message.CREATE_FAILED)
        }
    }



    public async getStory(memberId: ObjectId, storyId: ObjectId): Promise<Story>{
        const search: T = {
            _id: storyId
        }
        const targetStory: Story = await this.storyModel.findOne(search).lean().exec()
        if(!targetStory) throw new InternalServerErrorException(Message.NO_DATA_FOUND)
            /// todo memberView
        if(memberId){
            const viewInput = {memberId: memberId, viewRefId: storyId, viewGroup: ViewGroup.STORY}
            const newView = await this.viewService.recordView(viewInput)

            if(newView){
                await this.storyStatsEditor({
                    _id: storyId,
                    targetKey: 'storyViews',
                    modifier: 1
                });
                targetStory.storyViews++
            }
            // member liked
            const likeInput = {memberId: memberId, likeRefId: storyId, likeGroup: LikeGroup.STORY}
            targetStory.meLiked = await this.likeService.checkLikeExistence(likeInput)
        }
        targetStory.memberData = await this.memberService.getMember(null, targetStory.memberId)
        return targetStory
    }

    public async targetLikeStory(memberId: ObjectId, likeRefId: ObjectId): Promise<Story>{
        console.log('Mutation: likeRefId')
        const target: Story = await this.storyModel.findOne({
            _id: likeRefId
        }).exec()

        if(!target) throw new InternalServerErrorException(Message.NO_DATA_FOUND)
            const input: LikeInput = {
              memberId: memberId,
              likeRefId: likeRefId,
              likeGroup: LikeGroup.STORY
            }
            const modifier: number = await this.likeService.toggleLike(input)
            const result = await this.storyStatsEditor({
                _id: likeRefId,
                targetKey: 'storyLikes',
                modifier: modifier
            })

            if(!result) throw new InternalServerErrorException(Message.SOMETHING_WENT_WRONG);
            return result;
    }

    public async storyStatsEditor(input: StatisticModifier): Promise<Story>{
        const {_id, targetKey, modifier} = input
        return  await this.storyModel.findByIdAndUpdate(
            _id, {$inc: {[targetKey]: modifier}},
            {new: true}
        ).exec()
    }

    public async deleteStory( memberId: ObjectId, storyId: ObjectId):Promise<boolean>{
        const deleteStory = await this.storyModel.findByIdAndDelete({
            _id: storyId,
            memberId
        })

        if(!deleteStory) throw new InternalServerErrorException(Message.BAD_REQUEST)
            return true
    }

}
