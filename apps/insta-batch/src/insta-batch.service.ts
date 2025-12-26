import { Injectable } from '@nestjs/common';

@Injectable()
export class InstaBatchService {
  getHello(): string {
    return 'Hello World!';
  }
}
