import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CarDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsMongoId()
  brandId: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  title?: string;
}
