import { Injectable, OnModuleInit } from '@nestjs/common';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { UidService } from 'src/services/uid/uid.service';
import { DatabaseService } from 'src/database/database.service';
import { ConfigService } from '@nestjs/config';
import { GetUrlsDto } from './dto/get-urls.dto';
import { Prisma } from '@prisma/client';

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

  async findAll({ filter, limit = 20, page = 1 }: GetUrlsDto) {
    const whereClause: Prisma.UrlWhereInput = {};
    if (filter) {
      whereClause.OR = [
        { title: { contains: filter } },
        { description: { contains: filter } },
        { redirect: { contains: filter } },
      ];
    }
    const skip = (page - 1) * limit;
    const { data, totalCount } = await this.paginate({
      where: whereClause,
      skip,
      take: limit,
    });

    const totalPages = Math.ceil(totalCount / limit);
    let baseUrl = `${this.host}/url?limit=${limit}`;
    if (filter) {
      baseUrl += `&filter=${filter}`;
    }
    const nextPage = page < totalPages ? `${baseUrl}&page=${page + 1}` : null;
    const prevPage = page > 1 ? `${baseUrl}&page=${page - 1}` : null;

    return {
      data,
      meta: {
        totalCount,
        currentPage: page,
        perPage: limit,
        totalPages,
        nextPage,
        prevPage,
      },
    };
  }

  async update(id: number, updateUrlDto: UpdateUrlDto) {
    return await this.databaseService.url.update({
      data: updateUrlDto,
      where: { id },
    });
  }

  async remove(id: number) {
    return await this.databaseService.url.delete({ where: { id } });
  }

  concatUrl(uid: string) {
    return `${this.host}/${uid}`;
  }

  async paginate(params: Prisma.UrlFindManyArgs) {
    const [data, totalCount] = await this.databaseService.$transaction([
      this.databaseService.url.findMany(params),
      this.databaseService.url.count({ where: params.where }),
    ]);

    return {
      data,
      totalCount,
    };
  }
}
