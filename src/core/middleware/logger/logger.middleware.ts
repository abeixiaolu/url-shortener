import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggerService } from '../../logger/logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: LoggerService) {}
  use(req: Request, res: Response, next: () => void) {
    res.on('finish', () => {
      const { statusCode } = res;
      const { query, params, body } = req;
      const logData = {
        query: Object.keys(query).length ? query : undefined,
        params: Object.keys(params).length ? params : undefined,
        body: Object.keys(body || {}).length ? body : undefined,
      };
      if (statusCode >= 500) {
        this.logger.error(
          `${req.method} ${req.url}`,
          undefined,
          'HTTP',
          logData,
        );
      } else if (statusCode >= 400) {
        this.logger.warn(`${req.method} ${req.url}`, 'HTTP', logData);
      } else {
        this.logger.log(`${req.method} ${req.url}`, 'HTTP', logData);
      }
    });
    next();
  }
}
