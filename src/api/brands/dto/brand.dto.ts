import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class BrandDto {
  @ApiProperty()
  @IsNotEmpty()
  name: string;
}
