import { createMock, DeepMocked } from '@golevelup/ts-jest';
import { UrlService } from '../../url.service';
import { UrlExistsPipe } from './url-exists.pipe';
import { Url } from '@prisma/client';
import { NotFoundException } from '@nestjs/common';

describe('UrlExistsPipe', () => {
  let urlExistsPipe: UrlExistsPipe;
  let urlService: DeepMocked<UrlService>;
  const host = 'http://localhost:3000';

  beforeEach(() => {
    urlService = createMock<UrlService>();
    urlExistsPipe = new UrlExistsPipe(urlService);
  });
  it('should be defined', () => {
    expect(urlExistsPipe).toBeDefined();
  });

  // happy path
  it('should return the url if it exists', async () => {
    const uid = 'abcdef';
    const url: Url = {
      id: 1,
      url: `${host}/${uid}`,
      redirect: 'https://www.google.com',
      title: 'Google',
      description: 'Google',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    urlService.findOne.mockResolvedValue(url);
    const result = await urlExistsPipe.transform(uid);
    expect(result).toEqual(url);
  });

  // unhappy
  it('should throw a NotFoundException if the url does not exist', async () => {
    const uid = 'not-found';
    urlService.findOne.mockResolvedValue(null);
    await expect(urlExistsPipe.transform(uid)).rejects.toThrow(
      new NotFoundException(`The url with uid ${uid} is not found`),
    );
  });
});
