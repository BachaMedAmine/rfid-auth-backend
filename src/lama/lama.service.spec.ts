import { Test, TestingModule } from '@nestjs/testing';
import { LamaService } from './lama.service';

describe('LamaService', () => {
  let service: LamaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LamaService],
    }).compile();

    service = module.get<LamaService>(LamaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
