import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FollowService } from './follow.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Follower, Followers, Followings } from '../../libs/dto/follow/follow';
import { AuthMember } from '../auth/decorators/authmember.decorator';
import { ObjectId } from 'mongoose';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { WithoutGuard } from '../auth/guards/without.guard';
import { FollowInquery } from '../../libs/dto/follow/follow.input';

@Resolver()
export class FollowResolver {
    constructor(
        private readonly followService: FollowService
    ){}

    @UseGuards(AuthGuard)
    @Mutation((returns) => Follower)
    public async subscribe(
        @Args('input') input: string,
        @AuthMember('_id') memberId: ObjectId
    ): Promise<Follower>{
        console.log('Mutation: subscribe resolver')
        const followingId = shapeIntoMongoObjectId(input)
        return await this.followService.subscribe(memberId, followingId)
    }

    @UseGuards(AuthGuard)
    @Mutation((returns) => Follower)
    public async unSubscribe(
        @Args('input') input: string,
        @AuthMember('_id') memberId: ObjectId
    ): Promise<Follower>{
        console.log('Mutation: follow unSubscribe')
        const followingId = shapeIntoMongoObjectId(input)
        return await this.followService.unSubscribe(memberId, followingId)
    }


    @UseGuards(WithoutGuard)
    @Query((returns) => Followers)
    public async getMemberFollowers(
        @Args('input') input: FollowInquery,
        @AuthMember('_id') memberId: ObjectId
    ): Promise<Followers>{
        console.log('Query: getMemberFollowers')
        const {followingId} = input.search
        input.search.followingId = shapeIntoMongoObjectId(followingId)
        return await this.followService.getMemberFollowers(memberId, input)
    }

    @UseGuards(WithoutGuard)
    @Query((returns) => Followings)
    public async getMemberFollowings(
        @Args('input') input: FollowInquery,
        @AuthMember('_id') memberId: ObjectId
    ): Promise<Followings>{
        console.log('@Query: get member followings')
        const {followerId} = shapeIntoMongoObjectId(input.search)
        return await this.followService.getMemberFollowings(memberId, input)
    }

}
