import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as winston from 'winston';

@Injectable()
export class LoggerService implements NestLoggerService {
  private logger: winston.Logger;

  constructor(private readonly configService: ConfigService) {
    const isDev = this.configService.get('NODE_ENV') === 'development';
    const { combine, timestamp, json, colorize, printf } = winston.format;
    const format = isDev
      ? combine(
          timestamp(),
          colorize(),
          printf((info: any) => {
            return `${formatDate(info.timestamp)} ${info.level} [${info.context}] ${info.message} ${info.meta ? JSON.stringify(info.meta) : ''}`;
          }),
        )
      : combine(timestamp(), json());
    this.logger = winston.createLogger({
      format,
      transports: [new winston.transports.Console()],
    });
  }

  log(message: any, context?: string, meta?: any) {
    this.logger.info(message, { context, meta });
  }
  error(message: any, trace?: string, context?: string, meta?: any) {
    this.logger.error(message, { trace, context, meta });
  }
  warn(message: any, context?: string, meta?: any) {
    this.logger.warn(message, { context, meta });
  }
}

function formatDate(date: string) {
  return new Date(date).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}
