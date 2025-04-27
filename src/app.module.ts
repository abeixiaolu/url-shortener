import { Module } from '@nestjs/common';
import { CoreModule } from './core/core.module';
import { UrlModule } from './modules/url/url.module';
import { UidModule } from './services/uid/uid.module';
import { AppController } from './app.controller';

@Module({
  imports: [CoreModule, UrlModule, UidModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
