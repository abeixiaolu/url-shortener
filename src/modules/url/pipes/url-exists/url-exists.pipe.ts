import { Injectable, NotFoundException, PipeTransform } from '@nestjs/common';
import { UrlService } from '../../url.service';

@Injectable()
export class UrlExistsPipe implements PipeTransform {
  constructor(private readonly urlService: UrlService) {}

  async transform(value: string) {
    const url = await this.urlService.findOne(value);
    if (!url) {
      throw new NotFoundException(`The url with uid ${value} is not found`);
    }
    return url;
  }
}
