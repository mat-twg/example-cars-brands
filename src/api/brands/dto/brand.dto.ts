import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class BrandDto {
  @ApiProperty()
  @IsNotEmpty({ message: `Invalid body: 'name' should not be empty` })
  name: string;
}
