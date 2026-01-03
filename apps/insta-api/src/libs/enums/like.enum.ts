import { registerEnumType } from '@nestjs/graphql';

export enum LikeGroup {
	MEMBER = 'MEMBER',
	POST = 'POST',
	ARTICLE = 'ARTICLE',
	COMMENT = 'COMMENT',
	STORY = 'STORY'
}
registerEnumType(LikeGroup, {
	name: 'LikeGroup',
});
