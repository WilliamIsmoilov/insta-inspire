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