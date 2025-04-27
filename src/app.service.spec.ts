import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';
import { DatabaseService } from './database/database.service';
import { createMock } from '@golevelup/ts-jest';
import { LoggerService } from './core/logger/logger.service';
import { CacheService } from './core/cache/cache.service';
import { mockDeep } from 'jest-mock-extended';

describe('AppService', () => {
  let appService: AppService;
  // let cacheService: DeepMocked<CacheService>;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [
        AppService,
        {
          provide: DatabaseService,
          useValue: mockDeep<DatabaseService>(),
        },
        {
          provide: LoggerService,
          useValue: createMock<LoggerService>(),
        },
        {
          provide: CacheService,
          useValue: createMock<CacheService>(),
        },
      ],
    }).compile();

    appService = app.get<AppService>(AppService);
    // cacheService = app.get<DeepMocked<CacheService>>(CacheService);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      // cacheService.get.mockResolvedValue('HELLO WORLD');
      const result = appService.getHello();
      expect(result).toBe('Hello World!');
    });
  });
});
