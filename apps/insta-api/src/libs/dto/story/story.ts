import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { IsNotEmpty, IsOptional } from "class-validator";
import { ObjectId } from "mongoose";
import { Member } from "../member/member";
import { MediaType } from "../../enums/Media.enum";

@ObjectType()
export class Story{
    @Field(() => String)
    _id: ObjectId;

    @Field(() => String)
    story: string

    @Field(() => Date)
    expiresAt?: Date 

    @Field(() => Int)
    storyLikes: number

    @Field(() => Int)
    storyComments: number

    @Field(() => Int)
    storyViews: number

    @Field(() => String)
    storyDesc: string

    @Field(() => Member, {nullable: true})
    memberData?: Member

    @Field(() => String)
    memberId: ObjectId

    @Field(() => String, {nullable: true})
    accessToken?: string
}


@InputType()
export class StoryInput{
    @IsNotEmpty()
    @Field(() => String)
    story: string

    @IsOptional()
    @Field(() => String, {nullable: true})
    storyDesc: string

    memberId?: ObjectId;
}