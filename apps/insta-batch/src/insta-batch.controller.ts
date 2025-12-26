import { Controller, Get } from '@nestjs/common';
import { InstaBatchService } from './insta-batch.service';

@Controller()
export class InstaBatchController {
  constructor(private readonly instaBatchService: InstaBatchService) {}

  @Get()
  getHello(): string {
    return this.instaBatchService.getHello();
  }
}
