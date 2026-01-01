import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { View } from '../../libs/dto/view/view';
import { InjectModel } from '@nestjs/mongoose';
import { ViewInput } from '../../libs/dto/view/view.input';
import { T } from '../../libs/types/common';

@Injectable()
export class ViewService {
    constructor(
        @InjectModel('View')
        private readonly viewModel: Model<View>
    ){}

    public async recordView(input: ViewInput): Promise<View | null>{
        const viewExist = await this.checkExistence(input)
        if(!viewExist){
            console.log('-- New View Insert --')
            return await this.viewModel.create(input)
        } else return null
    }


    public async checkExistence(input: ViewInput):Promise<View>{
        const {memberId, viewRefId} = input
        const search: T = {memberId: memberId, viewRefId: viewRefId}
        return await this.viewModel.findOne(search).exec()
    }
}
