import { Controller, Get, Logger } from '@nestjs/common';
import { InstaBatchService } from './insta-batch.service';
import { Cron, Timeout } from '@nestjs/schedule';
import { BATCH_ROLLBACK, BATCH_TOP_MEMBER, BATCH_TOP_POSTS,  } from './lib/config';

@Controller()
export class InstaBatchController {
  private logger: Logger = new Logger('BatchController')
  constructor(private readonly instaBatchService: InstaBatchService) {}


  @Timeout(1000)
  handleTimeout(){
    this.logger.debug('Batch server ready')
  }

  @Cron('00 * * * * * ', {name: BATCH_ROLLBACK})
  public async batchRollback(){
    try {
      this.logger['context'] = BATCH_ROLLBACK;
      this.logger.debug('EXECUTED');
      await this.instaBatchService.batchRollBack()
    } catch (err) {
      this.logger.error(err)
    }
  }

  @Cron('20 * * * * * ', {name: BATCH_TOP_POSTS})
  public async batchTopPosts(){
    try {
      this.logger['context'] = BATCH_TOP_POSTS
      this.logger.debug('EXECUTED');
      await this.instaBatchService.batchTopPosts()
    } catch (err) {
      this.logger.error(err)
    }
  }

  @Cron('40 * * * * * ', {name: BATCH_TOP_MEMBER})
  public async batchTopMembers(){
    try {
      this.logger['context'] = BATCH_TOP_MEMBER;
      this.logger.debug("EXECUTED")
      await this.instaBatchService.batchTopUsers()
    } catch (err) {
      this.logger.error(err)
    }
  }

  @Get()
  getHello(): string {
    return this.instaBatchService.getHello();
  }
}
