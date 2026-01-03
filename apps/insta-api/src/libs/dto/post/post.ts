import { Field, Int, ObjectType } from "@nestjs/graphql";
import { ObjectId } from "mongoose";
import { PostStatus, PostType } from "../../enums/post.enum";
import { Member, TotaLCounter } from "../member/member";
import { MeLiked } from "../like/like";



@ObjectType()
export class Post{
    @Field(() => String)
    _id: ObjectId;

    @Field(() => PostType)
    postType: PostType;

    @Field(() => PostStatus)
    postStatus: PostStatus

    @Field(() => String)
    postTitle: string

    @Field(() => Int)
    postViews: number

    @Field(() => Int)
    postLikes: number

    @Field(() => Int)
    postComments: number

    @Field(() => Int)
    postRank: number

    @Field(() => [String])
    postMedia: string[]

    @Field(() => String, {nullable: true})
    postDesc?: string

    @Field(() => String)
    memberId: ObjectId

    @Field(() => Date)
    createdAt: Date

    @Field(() => Date)
    updatedAt: Date;

    @Field(() => String, {nullable: true})
    accessToken?: string

    /// aggregation
    @Field(()=> Member, {nullable: true})
    memberData?: Member;

       /** likes from aggregation */
    @Field(() => [MeLiked], { nullable: true})
    meLiked?: MeLiked[]
}


@ObjectType()
export class Posts{
    @Field(() => [Post])
    list: Post[]

    @Field(() => [TotaLCounter], {nullable: true})
    metaCounter?: TotaLCounter[]
}