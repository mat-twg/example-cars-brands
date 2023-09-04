import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, HydratedDocument } from 'mongoose';
import { ApiProperty, IntersectionType } from '@nestjs/swagger';
import { Paginated, PaginatedFix } from '../../../common/paginate/paginated';
import { Brand } from '../../brands/schemas/brands.schema';
import * as aggregatePaginate from 'mongoose-aggregate-paginate-v2';

export type CarDocument = HydratedDocument<Car>;

@Schema({
  versionKey: false,
  toJSON: {
    transform(doc: HydratedDocument<Car>, ret) {
      ret = Object.assign({ id: ret._id }, ret);
      delete ret._id;
      return ret;
    },
  },
})
export class Car {
  _id?: Types.ObjectId;

  @ApiProperty({
    example: '64e8d7d2d44dfe170817483d',
  })
  id?: string;

  @ApiProperty({
    example: 'Kalina',
  })
  @Prop()
  name: string;

  @Prop({ type: Types.ObjectId })
  brandId?: Types.ObjectId;

  @ApiProperty({ type: Brand })
  @Prop({ type: Brand })
  brand?: Brand;

  @ApiProperty({
    example: 'Title',
    required: false,
  })
  @Prop()
  title?: string;
}

class Docs {
  @ApiProperty({ type: [Car] })
  docs: Car[];
}

export class PaginatedCars extends IntersectionType(Docs, Paginated<Car>) {}

export class CarsList extends IntersectionType(Docs, PaginatedFix<Car>) {}

export const CarsSchema = SchemaFactory.createForClass(Car);

CarsSchema.plugin(aggregatePaginate);
