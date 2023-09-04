import { Car, PaginatedCars } from '../schemas/cars.schema';

export const testName = 'testCarName';
export const testId = '64e8d7d2d44dfe170817483d';
export const testFakeId = '54e8d7d2d44dfe170817483d';
export const testBrandName = 'testBrandName';
export const testBrandId = '44e8d7d2d44dfe170817483d';
export const testBranFakedId = '34e8d7d2d44dfe170817483d';
export const testPage = 1;
export const testLimit = 10;

export const carMock = <Car>{
  id: testId,
  name: testName,
  brand: {
    id: testBrandId,
    name: testBrandName,
  },
};

export const paginatedCarsMock = <PaginatedCars>{
  docs: [carMock],
  totalDocs: 1,
  limit: testLimit,
  totalPages: 1,
  page: testPage,
  pagingCounter: 1,
  hasNextPage: null,
  hasPrevPage: null,
  offset: null,
};
