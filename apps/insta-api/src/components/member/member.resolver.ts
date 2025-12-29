import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { MemberService } from './member.service';
import { Member } from '../../libs/dto/member/member';
import { LoginInput, MemberInput } from '../../libs/dto/member/member.input';
import { MemberUpdate } from '../../libs/dto/member/member.update';
import { AuthMember } from '../auth/decorators/authmember.decorator';
import { ObjectId } from 'mongoose';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';

@Resolver()
export class MemberResolver {

    constructor(private memberService: MemberService){}

    @Mutation(() => Member)
    public async signup(@Args('input') input: MemberInput): Promise<Member>{
        console.log('Mutation signup')
        return await this.memberService.signup(input)
    }

    @Mutation(() => Member)
    public async login(@Args('input') input: LoginInput): Promise<Member>{
        console.log('Mutation signup')
        return await this.memberService.login(input)
    }

    @UseGuards(AuthGuard)
    @Mutation(() => Member)
    public async updateMember(
        @Args('input') input: MemberUpdate,
        @AuthMember('_id') memberId: ObjectId
    ): Promise<Member>{
        console.log('Mutation updateMember')
        delete input._id
        return await this.memberService.updateMember(memberId, input)
    }
}
