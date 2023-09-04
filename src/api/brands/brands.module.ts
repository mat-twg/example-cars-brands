import { Module } from '@nestjs/common';
import { BrandsController } from './brands.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Brand, BrandsSchema } from './schemas/brands.schema';
import { BrandsService } from './brands.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Brand.name, schema: BrandsSchema }]),
  ],
  controllers: [BrandsController],
  providers: [BrandsService],
  exports: [BrandsService],
})
export class BrandsModule {}
