import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { StoryService } from './story.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { Story, StoryInput } from '../../libs/dto/story/story';
import { AuthMember } from '../auth/decorators/authmember.decorator';
import { ObjectId } from 'mongoose';
import { shapeIntoMongoObjectId } from '../../libs/config';

@Resolver()
export class StoryResolver {
    constructor(
        private readonly storyService: StoryService
    ){}

    @UseGuards(AuthGuard)
    @Mutation(() => Story)
    public async createStory(
        @Args('input') input: StoryInput,
        @AuthMember('_id') memberId: ObjectId
    ): Promise<Story>{
        console.log('Mutation create Story')
        input.memberId = memberId
        return await this.storyService.createStory(input)
    }

    @UseGuards(AuthGuard)
    @Query(() => Story)
    public async getStory(
        @Args('storyId') input: string,
        @AuthMember('_id') memberId: ObjectId
    ): Promise<Story>{
        console.log('Query getStory')
        const storyId = shapeIntoMongoObjectId(input)
        return await this.storyService.getStory(memberId, storyId)
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Boolean)
    public async deleteStory(
        @Args('storyId') input: string,
        @AuthMember('_id') memberId: ObjectId
    ): Promise<boolean>{
        console.log('Mutation deleteStory')
        const storyId = shapeIntoMongoObjectId(input)
        return await this.storyService.deleteStory(memberId, storyId)
    }
}
