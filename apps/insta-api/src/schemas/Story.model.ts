import { Schema } from 'mongoose';

const StorySchema = new Schema({
    memberId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Member'
    },
    story: {
        type: [String],
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    storyLikes: {
        type: Number,
        default: 0
    },
    storyComments: {
        type: Number,
        default: 0
    },
    storyViews: {
        type: Number,
        default: 0
    }
},{timestamps: true})