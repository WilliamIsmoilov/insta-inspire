import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcryptjs from "bcryptjs";
import { Member } from '../../libs/dto/member/member';
import { T } from '../../libs/types/common';
import { shapeIntoMongoObjectId } from '../../libs/config';

@Injectable()
export class AuthService {
     constructor(private jwtService: JwtService){}

     public async hashPassword(memberPassword: string): Promise<string>{
        const salt = await bcryptjs.genSalt();
        return await bcryptjs.hash(memberPassword, salt)
     }

     public async comparePassword(password: string, hashedPassword: string): Promise<boolean>{
        return await bcryptjs.compare(password, hashedPassword)
     }

     public async createToken(member:Member): Promise<string>{
        const paylaod: T = {}
        Object.keys(member['_doc'] ? member['_doc']: member).map((ele) => {
            paylaod[`${ele}`] = member[`${ele}`]
        })
        delete paylaod.memberPassword
        return await this.jwtService.signAsync(paylaod)
     }

     public async verifyToken(token: string): Promise<Member>{
        const member = await this.jwtService.verifyAsync(token);
        member._id = shapeIntoMongoObjectId(member._id)
        return member
     }
}
