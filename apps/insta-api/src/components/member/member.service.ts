import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { Member } from '../../libs/dto/member/member';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { LoginInput, MemberInput } from '../../libs/dto/member/member.input';
import { Message } from '../../libs/enums/common.enum';
import { MemberStatus } from '../../libs/enums/member.enum';
import { MemberUpdate } from '../../libs/dto/member/member.update';

@Injectable()
export class MemberService {
    constructor(@InjectModel('Member')
    private readonly memberModel: Model<Member>,
        private authService: AuthService,
    ){}

    public async signup(input: MemberInput):Promise<Member>{
        input.memberPassword = await this.authService.hashPassword(input.memberPassword)

        try {
            const result = await this.memberModel.create(input)
            result.accessToken = await this.authService.createToken(result)
            return result
        } catch (err) {
            console.log('Error, service model signup:', err)
            throw new BadRequestException(Message.USED_MEMBERNICK_OR_PHONE)
        }
    }

    public async login(input: LoginInput): Promise<Member>{
        const {memberNick, memberPassword} = input
        const response: Member = await this.memberModel
            .findOne({memberNick: memberNick})
            .select('+memberPassword')
            .exec()

        if(!response || response.memberStatus === MemberStatus.DELETE){
            throw new InternalServerErrorException(Message.NO_MEMBERNICK)
        }else if(response.memberStatus === MemberStatus.BLOCK){
            throw new InternalServerErrorException(Message.BLOCKED_USER)
        }

        const compare = await this.authService
        .comparePassword(input.memberPassword, response.memberPassword)
        if(!compare){
            throw new InternalServerErrorException(Message.WORNG_PASSWORD);
        }

        response.accessToken = await this.authService.createToken(response)
        return response
    }

    public async updateMember(memberId: ObjectId, input: MemberUpdate): Promise<Member>{
        const result: Member = await this.memberModel.findOneAndUpdate({
            _id: memberId, memberStatus: MemberStatus.ACTIVE,
        }, input, {new: true})

        if(!result) throw new InternalServerErrorException(Message.UPDATE_FAILED)
            result.accessToken = await this.authService.createToken(result)
        return result
    }
}
