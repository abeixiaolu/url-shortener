import { Controller, Get, NotFoundException, Param, Res } from '@nestjs/common';
import { UrlService } from './modules/url/url.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly urlService: UrlService) {}

  @Get(':uid')
  async redirectTo(@Param('uid') uid: string, @Res() res: Response) {
    try {
      const url = await this.urlService.findUrlByUid(uid);
      return res.redirect(url.redirect as string);
    } catch {
      throw new NotFoundException(`URL ${uid} not found`);
    }
  }
}
