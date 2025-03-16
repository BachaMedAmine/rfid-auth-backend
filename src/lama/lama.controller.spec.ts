import { Test, TestingModule } from '@nestjs/testing';
import { LamaController } from './lama.controller';
import { LamaService } from './lama.service';

describe('LamaController', () => {
  let controller: LamaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LamaController],
      providers: [LamaService],
    }).compile();

    controller = module.get<LamaController>(LamaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
