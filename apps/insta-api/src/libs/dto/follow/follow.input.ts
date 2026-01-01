import { Field, InputType, Int } from "@nestjs/graphql";
import { IsNotEmpty, IsOptional } from "class-validator";
import { ObjectId } from "mongoose";


@InputType()
class FollowSearch{
    @IsOptional()
    @Field(() => String, {nullable: true})
    followingId?: ObjectId

    @IsOptional()
    @Field(() => String, {nullable: true})
    followerId?: ObjectId
}

@InputType()
export class FollowInquery{
    @IsNotEmpty()
    @Field(() => Int)
    page: number;

    @IsNotEmpty()
    @Field(() => Int)
    limit: number;

    @IsNotEmpty()
    @Field(() => FollowSearch)
    search: FollowSearch
}