import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BrandsModule } from './api/brands/brands.module';
import { CarsModule } from './api/cars/cars.module';
import * as process from 'process';

const env = process.env;

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
      isGlobal: true,
    }),
    MongooseModule.forRoot(
      `mongodb://${env.MONGO_USERNAME}:${env.MONGO_PASSWORD}@mongo.${env.HOST}:${env.MONGO_PORT}/`,
      { dbName: env.MONGO_DB },
    ),
    BrandsModule,
    CarsModule,
  ],
})
export class AppModule {}
