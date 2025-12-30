import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Story, StoryInput } from '../../libs/dto/story/story';
import { MemberService } from '../member/member.service';
import { Message } from '../../libs/enums/common.enum';
import { T } from '../../libs/types/common';

@Injectable()
export class StoryService {
    constructor(
        @InjectModel('Story') private readonly storyModel: Model<Story>,
        private memberService: MemberService
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

        // member liked
        return targetStory
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
