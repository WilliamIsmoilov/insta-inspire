import { ObjectId } from 'bson';


export const availableAgentSorts = ['createdAt', 'updatedAt', 'memberLikes', 'memberViews', 'memberRank']
export const availableMemberSorts = ['createdAt', 'updatedAt', 'memberLikes', 'memberViews']

export const availablePostSorts= [
	'createdAt',
	'updatedAt',
	'postLikes',
	'postViews',
	'postRank',

]


export const availableBoardArticleSorts= ['craetedAt', 'updatedAt', 'articleLikes', 'articleViews']
export const availableCommentSorts = ['createdAt', 'updatedAt']



/**  image uploader  **/

import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { T } from './types/common';
import { from } from 'rxjs';
import { pipeline } from 'stream';


export const validMimeTypes = ['image/png', 'image/jpg', 'image/jpeg'];
export const validVideoMimeTypes = [
  'video/mp4',
  'video/mpeg',
  'video/quicktime', 
  'video/webm',
];

export const getSerialForImage = (filename: string) => {
  const ext = path.parse(filename).ext;
  return `${uuidv4()}${ext}`;
};

export const shapeIntoMongoObjectId = (target: any) => {
  return typeof target === 'string' ? new ObjectId(target) : target;
}




export const lookupMember = {
	$lookup: {
		from: 'members',
		localField: 'memberId',
		foreignField: '_id',
		as: 'memberData'
	}
}

export const lookupFollowingData = {
	$lookup: {
		from: 'members',
		localFields: 'memberId',
		foreignField: '_id',
		as: 'followingData'
	}
}

export const lookupFollowerData = {
	$lookup: {
		from: 'members',
		localField: 'followerId',
		foreignField: '_id',
		as: 'followerData'
	}
}

export const lookupFavourite = {
	$lookup: {
		from: 'members',
		localField: 'favouriteProperty.memberId',
		foreignField: '_id',
		as: 'favouriteProperty.memberData'
	}
}

export const lookupVisit = {
	$lookup: {
		from: 'members',
		localField: 'visitedProperty.memberId',
		foreignField: '_id',
		as: 'visitedProperty.memberData'
	}
}

export const lookupAuthMemberLiked = 
 (memberId: T, targetRefId: string = '$_id') => {
	return{
		$lookup: {
			from: 'likes',
			let: {
				localLikedRefId: targetRefId,
				localMemberId: memberId,
				localMyFavourite: true
			},
			pipeline: [
				{$match: {
					$expr: {
						$and: [
							{$eq: ['$likeRefId', '$$localLikeRefId']},
							{$eq: ['$memberId', '$$localMemberId']}
						]
					}
				}},
				{$project: {
					_id: 0,
					memberId: 1,
					likeRefId: 1,
					myFavourite: '$$localMyFavourite'
				}}
			],
			as: 'meLiked'
		}
	}
 }

 interface LookupAuthMemberFollowed{
	followerId: T;
	followingId: string;
 }

 export const lookupAuthMemberFollowed = 
 (input: LookupAuthMemberFollowed) => {
	const {followerId, followingId} = input;
	return {
		$lookup: {
			from: 'follows',
			let: {
				localFollowerId: followerId,
				localFollowingId: followingId,
				localMyFavourite: true
			},
			pipeline: [
				{$match: {
					$expr: {
						$and: [
							{$eq: ['$followerId', '$$localFollowerId']},
							{$eq: ['$followingId', '$$localFollowingId']}
						]
					}
				}},
				{$project: {
					_id: 0,
					followerId: 1,
					followingId: 1,
					myFollowing: '$localMyFavourite'
				}}
			], as: 'meFollowed'
		}
	}
 }