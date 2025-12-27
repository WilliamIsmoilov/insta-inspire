import { Schema } from 'mongoose';
import { PostStatus, PostType } from '../libs/enums/post.enum';

const PostSchema = new Schema(
	{
		postType: {
			type: String,
			enum: PostType,
			required: true,
		},

		postStatus: {
			type: String,
			enum: PostStatus,
			default: PostStatus.ACTIVE,
		},

		postTitle: {
			type: String,
			required: true,
		},

		postViews: {
			type: Number,
			default: 0,
		},

		postLikes: {
			type: Number,
			default: 0,
		},

		postComments: {
			type: Number,
			default: 0,
		},

		postRank: {
			type: Number,
			default: 0,
		},

		postMedia: {
			type: [String],
			required: true,
		},

		postDesc: {
			type: String,
		},

		memberId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Member',
		},

		deletedAt: {
			type: Date,
		},
	},
	{ timestamps: true, collection: 'posts' },
);


export default PostSchema;
