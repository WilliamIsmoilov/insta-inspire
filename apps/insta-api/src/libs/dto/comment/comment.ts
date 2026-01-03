import { Field, Int, ObjectType } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';
import { CommentGroup, CommentStatus } from '../../enums/comment.enum';
import { Member, TotaLCounter } from '../member/member';

@ObjectType()
export class Comment {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => CommentStatus)
	commentStatus: CommentStatus;

	@Field(() => CommentGroup)
	commentGroup: CommentGroup;

	@Field(() => String)
	commentContent: string;

	@Field(() => String)
	commentRefId: ObjectId;

	@Field(() => String)
	memberId: ObjectId;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;

	@Field(() => Int)
	commentLikes: number

	/** from aggregation **/

	@Field(() => Member, { nullable: true })
	memberData?: Member;
}

@ObjectType()
export class Comments {
	@Field(() => [Comment])
	list: Comment[];

	@Field(() => [TotaLCounter], { nullable: true })
	metaCounter: TotaLCounter[];
}
