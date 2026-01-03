import { registerEnumType } from '@nestjs/graphql';

export enum ViewGroup {
	MEMBER = 'MEMBER',
	ARTICLE = 'ARTICLE',
	POST = 'POST',
	COMMENT = "COMMENT"
}
registerEnumType(ViewGroup, {
	name: 'ViewGroup',
});
