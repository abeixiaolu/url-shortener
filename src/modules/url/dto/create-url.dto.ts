import { IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateUrlDto {
  @IsUrl()
  redirect: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description: string;
}
