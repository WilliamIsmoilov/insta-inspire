import { registerEnumType } from '@nestjs/graphql';

export enum LikeGroup {
	MEMBER = 'MEMBER',
	POST = 'POST',
	ARTICLE = 'ARTICLE',
	COMMENT = 'COMMENT'
}
registerEnumType(LikeGroup, {
	name: 'LikeGroup',
});
