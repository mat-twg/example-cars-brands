import * as request from 'supertest';
import { getModel, httpServer } from './app.e2e-spec';
import { BrandDto } from '../src/api/brands/dto/brand.dto';
import { Brand, BrandsList } from '../src/api/brands/schemas/brands.schema';

describe('BrandsController', () => {
  const brands: Brand[] = [];

  afterAll(async () => {
    const model = getModel<Brand>(Brand.name);
    await model.deleteMany({});
  });

  describe('Create: /brands (POST)', () => {
    const payload: BrandDto = {
      name: 'First',
    };

    it('201 - Created: first', () => {
      return request(httpServer)
        .post('/brands')
        .send(payload)
        .expect(201)
        .expect((response) => {
          brands.push(response.body);
        });
    });

    it('201 - Created: second', () => {
      payload.name = 'Second';

      return request(httpServer)
        .post('/brands')
        .send(payload)
        .expect(201)
        .expect((response) => {
          brands.push(response.body);
        });
    });

    it('400 - Bad request: invalid payload', () => {
      return request(httpServer).post('/brands').send({}).expect(400);
    });

    it('422 - Unprocessable Entity: duplicated name', () => {
      return request(httpServer).post('/brands').send(payload).expect(422);
    });
  });

  describe('Update: /brands/{id} (PATCH)', () => {
    it('204 - No Content: updated', () => {
      brands[0].name = 'Updated';

      return request(httpServer)
        .patch('/brands/' + brands[0].id)
        .send({ name: brands[0].name })
        .expect(204);
    });

    it('400 - Bad request: invalid mongo id', () => {
      return request(httpServer)
        .patch('/brands/' + 'invalid_mongo_id')
        .send({ name: brands[0].name })
        .expect(400);
    });

    it('404 - Not found', () => {
      return request(httpServer)
        .patch('/brands/' + '64e8d7d2d44dfe170817483d')
        .send({ name: brands[0].name })
        .expect(404);
    });

    it('422 - Unprocessable Entity: duplicated name', () => {
      return request(httpServer)
        .patch('/brands/' + brands[0].id)
        .send({ name: brands[1].name })
        .expect(422);
    });
  });

  describe('List: /brands (GET)', () => {
    it('200 - List of brands', () => {
      const paginatedBrands: BrandsList = {
        docs: brands,
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

      return request(httpServer)
        .get('/brands')
        .expect(200)
        .expect(paginatedBrands);
    });
  });

  describe('GetById /brands/{id} (GET)', () => {
    it('200 - Brand', () => {
      return request(httpServer)
        .get('/brands/' + brands[0].id)
        .expect(200)
        .expect(brands[0]);
    });

    it('400 - Bad request: invalid mongo id', () => {
      return request(httpServer)
        .get('/brands/' + 'invalid_mongo_id')
        .expect(400);
    });

    it('404 - Not found', () => {
      return request(httpServer)
        .get('/brands/' + '64e8d7d2d44dfe170817483d')
        .expect(404);
    });
  });

  describe('Delete /brands/{id} (DELETE)', () => {
    it('204 - No Content: deleted', () => {
      return request(httpServer)
        .delete('/brands/' + brands[1].id)
        .expect(204);
    });

    it('400 - Bad request: invalid mongo id', () => {
      return request(httpServer)
        .delete('/brands/' + 'invalid_mongo_id')
        .expect(400);
    });

    it('404 - Not found', () => {
      return request(httpServer)
        .delete('/brands/' + brands[1].id)
        .expect(404);
    });
  });
});
// });
