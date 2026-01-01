import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Follower, Following } from '../../libs/dto/follow/follow';
import { Model, ObjectId } from 'mongoose';
import { MemberService } from '../member/member.service';
import { Message } from '../../libs/enums/common.enum';

@Injectable()
export class FollowService {
    constructor(
        @InjectModel('Follow')
        private readonly followModel: Model<Follower | Following>,
        private readonly memberService: MemberService
    ){}

    public async registerSubscription(followerId: ObjectId, followingId: ObjectId): Promise<Follower>{
        try {
            return await this.followModel.create({followerId: followerId, followingId: followingId})
        } catch (err) {
            console.log('Error, service follow', err.message)
            throw new InternalServerErrorException(Message.CREATE_FAILED)
        }
    }

    public async subscribe(followerId: ObjectId, followingId: ObjectId): Promise<Follower>{
        if(followerId.toString() ===  followingId.toString()){
            throw new InternalServerErrorException(Message.SELF_SUBCRIPTION_DENIED)
        }

        const targetMember = await this.memberService.getMember(null, followingId)
        if(!targetMember) throw new InternalServerErrorException(Message.NO_DATA_FOUND)
        
        const result = await this.registerSubscription(followerId, followingId)

        await this.memberService.memberStatsEditor({_id: followerId, targetKey: 'memberFollowings', modifier: 1})
        await this.memberService.memberStatsEditor({_id: followingId, targetKey: 'memberFollowers', modifier: 1})
        
        return result
    }
    
}
