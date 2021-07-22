import { Test, TestingModule } from '@nestjs/testing';
import { QrCodesService } from './qrcodes.service';

describe('QrcodesService', () => {
  let service: QrCodesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QrCodesService],
    }).compile();

    service = module.get<QrCodesService>(QrCodesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
