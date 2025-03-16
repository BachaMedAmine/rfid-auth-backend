import { Test, TestingModule } from '@nestjs/testing';
import { ElevenLabsController } from './elevenlabs.controller';
import { ElevenLabsService } from './elevenlabs.service';

describe('ElevenlabsController', () => {
  let controller: ElevenLabsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ElevenLabsController],
      providers: [ElevenLabsService],
    }).compile();

    controller = module.get<ElevenLabsController>(ElevenLabsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
