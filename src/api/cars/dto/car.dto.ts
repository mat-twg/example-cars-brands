import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CarDto {
  @ApiProperty()
  @IsNotEmpty({ message: `Invalid body: 'name' should not be empty` })
  name: string;

  @ApiProperty()
  @IsMongoId({
    message: `Invalid body: 'brandId' has invalid mongo objectId value(s), must be a single String of 12 bytes or a string of 24 hex characters`,
  })
  brandId: string;

  @ApiProperty()
  @IsOptional()
  @IsString({ message: `Invalid body: 'title' should be string` })
  title?: string;
}
