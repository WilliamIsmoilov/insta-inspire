import { Field, InputType, Int } from "@nestjs/graphql";
import { PostStatus, PostType } from "../../enums/post.enum";
import { IsIn, IsNotEmpty, IsOptional, Min } from "class-validator";
import { ObjectId } from "mongoose";
import { Direction } from "../../enums/common.enum";
import { availablePostSorts} from "../../config";


@InputType()
export class PostInput{

    @IsNotEmpty()
    @Field(() => PostType)
    postType: PostType

    @IsNotEmpty()
    @Field(() => [String])
    postMedia: string[]

    @IsNotEmpty()
    @Field(() => String)
    postTitle: string

    @IsOptional()
    @Field(() => String, {nullable: true})
    postDesc?: string

    memberId?: ObjectId;
}


@InputType()
export class LikedMost{
    @Field(() => Int)
    start: number

    @Field(() => Int)
    end: number
}

@InputType()
export class PISearch{
    @IsOptional()
    @Field(() => String, {nullable: true})
    memberId?: ObjectId;

    @IsOptional()
    @Field(() => PostType, {nullable: true})
    postType?: PostType

    @IsOptional()
    @Field(() => LikedMost,  {nullable: true})
    likedMost?: LikedMost

    @IsOptional()
    @Field(() => String, {nullable: true})
    postTitle?: string

}

@InputType()
export class PostInquery{
    @IsNotEmpty()
    @Min(1)
    @Field(() => Int)
    page: number;

    @IsNotEmpty()
    @Min(1)
    @Field(() => Int)
    limit: number;

    @IsOptional()
    @IsIn(availablePostSorts)
    @Field(() => String, {nullable: true})
    sort?: string;

    @IsOptional()
    @Field(() => Direction, {nullable: true})
    direction?: Direction;

    @IsNotEmpty()
    @Field(() => PISearch)
    search: PISearch 
}


@InputType()
export class ALPISearch{
    @IsOptional()
    @Field(() => PostStatus, {nullable: true})
    postStatus?: PostStatus

    @IsOptional()
    @Field(() => PostType, {nullable: true})
    postType?: PostType
}

@InputType()
export class AllPostsInquery{
    @IsNotEmpty()
    @Min(1)
    @Field(() => Int)
    page: number 

    @IsNotEmpty()
    @Min(1)
    @Field(() => Int)
    limit: number
    
    @IsNotEmpty()
    @IsIn(availablePostSorts)
    @Field(() => String, {nullable: true})
    sort?: string
    
    @IsOptional()
    @Field(() => Direction, {nullable: true})
    direction?: Direction

    @IsNotEmpty()
    @Field(() => ALPISearch)
    search: ALPISearch
}


@InputType()
export class OrdinaryInquiry{
    @IsNotEmpty()
    @Min(1)
    @Field(() => Int)
    page: number;

    @IsNotEmpty()
    @Min(1)
    @Field(() => Int)
    limit: number
}