import { ApiProperty } from '@nestjs/swagger';
import { PaginateResult } from 'mongoose';

export class Paginated<T> implements PaginateResult<T> {
  docs: T[];

  @ApiProperty()
  totalDocs: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  hasPrevPage: boolean;

  @ApiProperty()
  hasNextPage: boolean;

  @ApiProperty({ required: false })
  page?: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  offset: number;

  @ApiProperty({ required: false })
  prevPage?: number;

  @ApiProperty({ required: false })
  nextPage?: number;

  @ApiProperty()
  pagingCounter: number;

  @ApiProperty({ required: false })
  meta?: any;

  [customLabel: string]: number | boolean | T[];
}

export class PaginatedFix<T> {
  docs: T[];

  @ApiProperty()
  totalDocs: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  pagingCounter: number;

  @ApiProperty()
  hasPrevPage: boolean;

  @ApiProperty()
  hasNextPage: boolean;

  @ApiProperty({ default: null })
  prevPage: number | null;

  @ApiProperty({ default: null })
  nextPage: number | null;
}
