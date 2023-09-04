import { Brand, PaginatedBrands } from '../schemas/brands.schema';

export const testName = 'testName';
export const testId = '64e8d7d2d44dfe170817483d';
export const testFakeId = '54e8d7d2d44dfe170817483d';
export const testPage = 1;
export const testLimit = 10;

export const brandMock = <Brand>{
  id: testId,
  name: testName,
};

export const paginatedBrandsMock = <PaginatedBrands>{
  docs: [brandMock],
  totalDocs: 1,
  limit: testLimit,
  totalPages: 1,
  page: testPage,
  pagingCounter: 1,
  hasNextPage: null,
  hasPrevPage: null,
  offset: null,
};
