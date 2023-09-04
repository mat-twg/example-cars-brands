import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, HydratedDocument } from 'mongoose';
import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { Paginated, PaginatedFix } from '../../../common/paginate/paginated';
import * as paginate from 'mongoose-paginate-v2';

export type BrandDocument = HydratedDocument<Brand>;

@Schema({
  versionKey: false,
  toJSON: {
    transform(doc: HydratedDocument<Brand>, ret) {
      ret = Object.assign({ id: ret._id }, ret);
      delete ret._id;
      return ret;
    },
  },
})
export class Brand {
  _id?: Types.ObjectId;

  @ApiProperty({
    example: '64e8d7d2d44dfe170817483d',
  })
  id?: string;

  @ApiProperty({
    example: 'Lada',
  })
  @Prop()
  name: string;
}

class Docs {
  @ApiProperty({ type: [Brand] })
  docs: Brand[];
}

export class PaginatedBrands extends IntersectionType(Docs, Paginated<Brand>) {}

export class BrandsList extends IntersectionType(Docs, PaginatedFix<Brand>) {}

export const BrandsSchema = SchemaFactory.createForClass(Brand);

BrandsSchema.path('name').index({ unique: true });

BrandsSchema.plugin(paginate);
