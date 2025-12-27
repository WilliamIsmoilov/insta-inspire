import { Field, Int, ObjectType } from "@nestjs/graphql";
import { ObjectId } from "mongoose";
import { MemberStatus, MemberType, MemberAuthType } from '../../enums/member.enum';


@ObjectType()
export class Member{
    @Field(() => String)
    _id: ObjectId;

    @Field(() => String)
    memberType: MemberType;

    @Field(() => String)
    memberStatus: MemberStatus;

    @Field(() => String)
    memberAuthType: MemberAuthType;

    @Field(() => String)
    memberPhone: string

    @Field(() => String)
    memberNick: string

    memberPassword?: string

    @Field(() => String, {nullable: true})
    memberFullName?: string

    @Field(() => String)
    memberImage: string

    @Field(() => String, {nullable: true})
    memberDesc?: string

    @Field(() => Int)
    memberPosts: number

    @Field(() => Int)
    memberArticles: number

    @Field(() => Int)
    memberFollowers: number

    @Field(() => Int)
    memberFollowing: number

    @Field(() => Int)
    memberPoints: number

    @Field(() => Int)
    memberLikes: number

    @Field(() => Int)
    memberViews: number

    @Field(() => Int)
    memberComments: number

    @Field(() => Int)
    memberRank: number

    @Field(() => Int)
    memberWarning: number

    @Field(() => Int)
    memberBlocks: number

    @Field(() => Date, {nullable: true})
    deletedAt?: Date

    @Field(() => Date)
    createdAt: Date

    @Field(() => String, {nullable: true})
    accessToken?: string

    /** like **/
    //from aggregation

}

@ObjectType()
export class TotaLCounter{
    @Field(() => Int, {nullable: true})
    total: number
}

@ObjectType()
export class Members{
    @Field(() => [Member])
    list: Member[];

    @Field(() => [TotaLCounter], {nullable: true})
    metaCounter: TotaLCounter[]
}