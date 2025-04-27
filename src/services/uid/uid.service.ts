import { Injectable } from '@nestjs/common';
import { nanoid } from 'nanoid';

@Injectable()
export class UidService {
  public generate(len?: number) {
    return nanoid(len);
  }
}
