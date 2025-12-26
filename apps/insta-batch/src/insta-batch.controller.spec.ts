import { Test, TestingModule } from '@nestjs/testing';
import { InstaBatchController } from './insta-batch.controller';
import { InstaBatchService } from './insta-batch.service';

describe('InstaBatchController', () => {
  let instaBatchController: InstaBatchController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [InstaBatchController],
      providers: [InstaBatchService],
    }).compile();

    instaBatchController = app.get<InstaBatchController>(InstaBatchController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(instaBatchController.getHello()).toBe('Hello World!');
    });
  });
});
