import { Schema } from 'mongoose';
import { MediaType } from '../libs/enums/Media.enum';

const StorySchema = new Schema({
    
    story: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        default: () => new Date(Date.now() + 24 * 60 * 60 * 1000),
        index: {expires: '24h'}
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
    },
    storyDesc: {
        type: String
    },
    memberId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Member'
    }
},{timestamps: true})

export default StorySchema