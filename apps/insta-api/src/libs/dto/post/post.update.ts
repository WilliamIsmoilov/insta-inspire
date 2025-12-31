import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsOptional } from "class-validator";
import { ObjectId } from "mongoose";
import { PostStatus, PostType } from "../../enums/post.enum";


@InputType()
export class PostUpdate{
    @IsNotEmpty()
    @Field(() => String)
    _id: ObjectId;

    @IsOptional()
    @Field(() => PostType, {nullable: true})
    postType?: PostType;

    @IsOptional()
    @Field(() => PostStatus, {nullable: true})
    postStatus?: PostStatus

    @IsOptional()
    @Field(() => String, {nullable: true})
    postTitle?: string

    @IsOptional()
    @Field(() => String, {nullable: true})
    postDesc?: string
}