import { registerEnumType } from '@nestjs/graphql';

export enum PostType {
	TRAVEL = 'TRAVEL',
	STUDY = 'STUDY',
	HUMOR = 'HUMOR',
}
registerEnumType(PostType, {
	name: 'PostType',
});

export enum PostStatus {
	ACTIVE = 'ACTIVE',
	UPDATED = 'UPDATED',
	DELETE = 'DELETE',
}
registerEnumType(PostStatus, {
	name: 'PostStatus',
});


