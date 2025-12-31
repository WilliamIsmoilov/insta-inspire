import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { PostService } from './post.service';
import {  UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { AllPostsInquery, PostInput } from '../../libs/dto/post/post.input';
import { AuthMember } from '../auth/decorators/authmember.decorator';
import { ObjectId } from 'mongoose';
import { Post, Posts } from '../../libs/dto/post/post';
import { WithoutGuard } from '../auth/guards/without.guard';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { PostUpdate } from '../../libs/dto/post/post.update';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';

@Resolver()
export class PostResolver {
    constructor(
        private postService: PostService
    ){}

    @UseGuards(AuthGuard)
    @Mutation(() => Post)
    public async createPost(
        @Args('input') input: PostInput,
        @AuthMember('_id') memberId: ObjectId
    ): Promise<Post>{
        console.log('Mutation: CreatePost')
        input.memberId = memberId;
        return await this.postService.createPost(input)
    }

    @UseGuards(WithoutGuard)
    @Query(() => Post)
    public async getPost(
        @Args('postId') input: string,
        @AuthMember('_id') memberId: ObjectId
    ): Promise<Post>{
        console.log('query getPost')
        const postId = shapeIntoMongoObjectId(input)
        return await this.postService.getPost(memberId, postId)
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Post)
    public async updatePost(
        @Args('input') input: PostUpdate,
        @AuthMember('_id') memberId: ObjectId
    ): Promise<Post>{
        console.log('Mutation: updatePost')
        input._id = shapeIntoMongoObjectId(input._id)
        return await this.postService.updatePost(memberId, input)
    }



    /**    ADMIN    **/

    @Roles(MemberType.ADMIN)
    @UseGuards(AuthGuard)
    @Query(() => Posts)
    public async getAllPostsByAdmin(
        @Args('input') input: AllPostsInquery,
        @AuthMember('_id') memberId: ObjectId
    ): Promise<Posts>{
        console.log('QUery getAllPostsByAdmin')
        return await this.postService.getAllPostsByAdmin(input)
    }
}
