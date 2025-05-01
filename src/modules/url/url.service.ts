import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { UidService } from 'src/services/uid/uid.service';
import { DatabaseService } from 'src/database/database.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UrlService implements OnModuleInit {
  private host: string;
  constructor(
    private readonly uidService: UidService,
    private readonly configService: ConfigService,
    private readonly databaseService: DatabaseService,
  ) {}

  onModuleInit() {
    this.host = this.configService.getOrThrow<string>('host');
  }

  async create(createUrlDto: CreateUrlDto) {
    const uid = this.uidService.generate(6);
    const url = await this.databaseService.url.create({
      data: {
        ...createUrlDto,
        url: `${this.host}/${uid}`,
      },
    });

    return url;
  }

  async findOne(uid: string) {
    const url = await this.databaseService.url.findUnique({
      where: { url: this.concatUrl(uid) },
    });

    return url;
  }

  findAll() {
    return `This action returns all url`;
  }

  async update(id: number, updateUrlDto: UpdateUrlDto) {
    const updatedUrl = await this.databaseService.url.update({
      data: updateUrlDto,
      where: { id },
    });
    return updatedUrl;
  }

  async remove(id: number) {
    const deletedUrl = await this.databaseService.url.delete({ where: { id } });
    return deletedUrl;
  }

  concatUrl(uid: string) {
    return `${this.host}/${uid}`;
  }
}
