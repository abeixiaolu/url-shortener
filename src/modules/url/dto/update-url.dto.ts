import { PartialType } from '@nestjs/mapped-types';
import { CreateUrlDto } from './create-url.dto';
import { IsUrl, IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class UpdateUrlDto extends PartialType(CreateUrlDto) {
  @IsUrl()
  redirect: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description: string;
}
