import { registerEnumType } from '@nestjs/graphql';

export enum ViewGroup {
	MEMBER = 'MEMBER',
	ARTICLE = 'ARTICLE',
	POST = 'POST',
}
registerEnumType(ViewGroup, {
	name: 'ViewGroup',
});
