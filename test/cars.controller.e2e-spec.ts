import * as request from 'supertest';
import { getModel, httpServer } from './app.e2e-spec';
import { Model } from 'mongoose';
import { BrandDto } from '../src/api/brands/dto/brand.dto';
import { Brand, BrandsList } from '../src/api/brands/schemas/brands.schema';
import { CarDto } from '../src/api/cars/dto/car.dto';
import { Car, CarsList } from '../src/api/cars/schemas/cars.schema';

describe('CarsController', () => {
  const cars: Car[] = [];

  let brandModel: Model<Brand>, carModel: Model<Car>;
  let brands: Brand[];

  beforeAll(async () => {
    brandModel = getModel<Brand>(Brand.name);
    carModel = getModel<Car>(Car.name);

    const brandsDto: BrandDto[] = [{ name: 'Brand1' }, { name: 'Brand2' }];

    brands = await Promise.all(
      brandsDto.map((dto) => new brandModel(dto).save()),
    );

    await brandModel.deleteOne({ _id: brands[1]._id });
  });

  afterAll(async () => {
    await brandModel.deleteMany({});
    await carModel.deleteMany({});
  });

  describe('Create /cars (POST)', () => {
    it('201 - Created: first', () => {
      const payload: CarDto = {
        name: 'FirstCar',
        brandId: brands[0].id,
        title: 'Some Title',
      };

      return request(httpServer)
        .post('/cars')
        .send(payload)
        .expect(201)
        .expect((response) => {
          cars.push(response.body);
        });
    });

    it('201 - Created: second', () => {
      const payload: CarDto = {
        name: 'SecondCar',
        brandId: brands[0].id,
        title: 'Some Title',
      };

      return request(httpServer)
        .post('/cars')
        .send(payload)
        .expect(201)
        .expect((response) => {
          cars.push(response.body);
        });
    });

    it('400 - Bad request: invalid payload', () => {
      return request(httpServer).post('/brands').send({}).expect(400);
    });

    it('422 - Unprocessable Entity: brand not found', () => {
      const payload: CarDto = {
        name: 'SecondCar',
        brandId: brands[1].id,
        title: 'Some Title',
      };

      return request(httpServer).post('/cars').send(payload).expect(422);
    });
  });

  describe('Update: /cars/{id} (PATCH)', () => {
    it('204 - No Content: updated', () => {
      cars[0].name = 'Updated';

      const payload: CarDto = {
        name: cars[0].name,
        brandId: cars[0].brand.id,
      };

      return request(httpServer)
        .patch('/cars/' + cars[0].id)
        .send(payload)
        .expect(204);
    });

    it('400 - Bad request: invalid mongo id', () => {
      const payload: CarDto = {
        name: cars[0].name,
        brandId: cars[0].brand.id,
      };

      return request(httpServer)
        .patch('/cars/' + 'invalid_mongo_id')
        .send(payload)
        .expect(400);
    });

    it('404 - Not found', () => {
      const payload: CarDto = {
        name: cars[0].name,
        brandId: cars[0].brand.id,
      };

      return request(httpServer)
        .patch('/cars/' + '64e8d7d2d44dfe170817483d')
        .send(payload)
        .expect(404);
    });

    it('422 - Unprocessable Entity: brand not found', () => {
      const payload: CarDto = {
        name: cars[0].name,
        brandId: brands[1].id,
      };

      return request(httpServer)
        .patch('/cars/' + cars[0].id)
        .send(payload)
        .expect(422);
    });
  });

  describe('List: /cars (GET)', () => {
    it('200 - List of brands', () => {
      const paginatedCars: CarsList = {
        docs: cars,
        totalDocs: 2,
        limit: 10,
        totalPages: 1,
        page: 1,
        pagingCounter: 1,
        hasPrevPage: false,
        hasNextPage: false,
        prevPage: null,
        nextPage: null,
      };

      return request(httpServer).get('/cars').expect(200).expect(paginatedCars);
    });
  });

  describe('GetById /cars/{id} (GET)', () => {
    it('200 - Brand', () => {
      return request(httpServer)
        .get('/cars/' + cars[0].id)
        .expect(200)
        .expect(cars[0]);
    });

    it('400 - Bad request: invalid mongo id', () => {
      return request(httpServer)
        .get('/cars/' + 'invalid_mongo_id')
        .expect(400);
    });

    it('404 - Not found', () => {
      return request(httpServer)
        .get('/cars/' + '64e8d7d2d44dfe170817483d')
        .expect(404);
    });
  });

  describe('Delete /cars/{id} (DELETE)', () => {
    it('204 - No Content: deleted', () => {
      return request(httpServer)
        .delete('/cars/' + cars[1].id)
        .expect(204);
    });

    it('400 - Bad request: invalid mongo id', () => {
      return request(httpServer)
        .delete('/cars/' + 'invalid_mongo_id')
        .expect(400);
    });

    it('404 - Not found', () => {
      return request(httpServer)
        .delete('/cars/' + cars[1].id)
        .expect(404);
    });
  });
});
