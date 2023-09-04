import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Car, CarsSchema } from './schemas/cars.schema';
import { CarsController } from './cars.controller';
import { CarsService } from './cars.service';
import { BrandsModule } from '../brands/brands.module';

@Module({
  imports: [
    BrandsModule,
    MongooseModule.forFeature([{ name: Car.name, schema: CarsSchema }]),
  ],
  controllers: [CarsController],
  providers: [CarsService],
  exports: [CarsService],
})
export class CarsModule {}
