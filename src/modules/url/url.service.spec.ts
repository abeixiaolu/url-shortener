import { Test, TestingModule } from '@nestjs/testing';
import { UrlService } from './url.service';
import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { UidService } from '../../services/uid/uid.service';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../../database/database.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';

describe('UrlService', () => {
  let urlService: UrlService;
  let uidService: DeepMocked<UidService>;
  let configService: DeepMocked<ConfigService>;
  let databaseService: DeepMockProxy<DatabaseService>;
  const host = 'http://localhost:3000';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlService,
        { provide: UidService, useValue: createMock<UidService>() },
        { provide: ConfigService, useValue: createMock<ConfigService>() },
        { provide: DatabaseService, useValue: mockDeep<DatabaseService>() },
      ],
    }).compile();

    const app = module.createNestApplication();

    urlService = module.get<UrlService>(UrlService);
    uidService = module.get<DeepMocked<UidService>>(UidService);
    configService = module.get<DeepMocked<ConfigService>>(ConfigService);
    databaseService =
      module.get<DeepMockProxy<DatabaseService>>(DatabaseService);

    configService.getOrThrow.mockReturnValue(host);

    await app.init();
  });

  it('should be defined', () => {
    expect(urlService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new url', async () => {
      const uid = '123456';
      uidService.generate.mockReturnValue(uid);
      const createUrlDto: CreateUrlDto = {
        redirect: 'https://www.google.com',
        title: 'Google',
        description: 'Google',
      };
      const newUrl = {
        ...createUrlDto,
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        url: `${host}/123456`,
      };
      databaseService.url.create.mockResolvedValue(newUrl);

      const result = await urlService.create(createUrlDto);

      expect(result).toEqual(newUrl);
    });
  });

  describe('findOne', () => {
    it('should return a url by uid', async () => {
      const uid = '123456';
      const expectedUrl = {
        id: 1,
        redirect: 'https://www.google.com',
        title: 'Google',
        description: 'Google',
        createdAt: new Date(),
        updatedAt: new Date(),
        url: `${host}/123456`,
      };
      databaseService.url.findUnique.mockResolvedValue(expectedUrl);
      const result = await urlService.findOne(uid);
      expect(result).toEqual(expectedUrl);
    });
  });

  describe('update', () => {
    it('should update a url by id', async () => {
      const createUrlDto: CreateUrlDto = {
        redirect: 'https://www.google.com',
        title: 'Google',
        description: 'Google',
      };
      const updatedUrl = {
        ...createUrlDto,
        id: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        url: `${host}/123456`,
      };
      databaseService.url.update.mockResolvedValue(updatedUrl);

      const result = await urlService.update(1, createUrlDto);

      expect(result).toEqual(updatedUrl);
    });
  });
});
