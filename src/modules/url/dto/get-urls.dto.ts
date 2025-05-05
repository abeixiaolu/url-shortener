import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class GetUrlsDto {
  @IsOptional()
  filter?: string;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => (value ? parseInt(value) : undefined))
  @Min(1)
  limit?: number;

  @IsOptional()
  @IsInt()
  @Transform(({ value }) => (value ? parseInt(value) : undefined))
  @Min(1)
  page?: number;
}
