import { Test, TestingModule } from '@nestjs/testing';
import { BrandsController } from './brands.controller';
import { BrandsService } from './brands.service';
import { BrandDto } from './dto/brand.dto';
import mongoose, { UpdateWriteOpResult } from 'mongoose';
import { Brand, PaginatedBrands } from './schemas/brands.schema';
import { NotFoundException } from '@nestjs/common';
import {
  brandMock,
  paginatedBrandsMock,
  testFakeId,
  testId,
  testLimit,
  testName,
  testPage,
} from './mocks/brands.mock';

describe('Brands Controller', () => {
  let controller: BrandsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BrandsController],
      providers: [
        {
          provide: BrandsService,
          useValue: {
            findById: jest
              .fn()
              .mockImplementation((id: string): Promise<Brand | null> => {
                if (id !== testId) {
                  return Promise.resolve(null);
                } else {
                  return Promise.resolve(brandMock);
                }
              }),
            findAll: jest
              .fn()
              .mockImplementation((): Promise<PaginatedBrands> => {
                return Promise.resolve(paginatedBrandsMock);
              }),
            create: jest
              .fn()
              .mockImplementation(
                (): Promise<Brand> => Promise.resolve(brandMock),
              ),
            update: jest
              .fn()
              .mockImplementation(
                (id: string): Promise<UpdateWriteOpResult> => {
                  if (id === testId) {
                    return Promise.resolve(<UpdateWriteOpResult>{
                      matchedCount: 1,
                    });
                  } else {
                    return Promise.resolve(<UpdateWriteOpResult>{
                      matchedCount: 0,
                    });
                  }
                },
              ),
            delete: jest
              .fn()
              .mockImplementation(
                (id: string): Promise<mongoose.mongo.DeleteResult> => {
                  if (id === testId) {
                    return Promise.resolve(<mongoose.mongo.DeleteResult>{
                      deletedCount: 1,
                    });
                  } else {
                    return Promise.resolve(<mongoose.mongo.DeleteResult>{
                      deletedCount: 0,
                    });
                  }
                },
              ),
          },
        },
      ],
    }).compile();

    controller = module.get<BrandsController>(BrandsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('list', () => {
    it('should get a paginated brands', () => {
      expect(controller.list([], testPage, testLimit)).resolves.toEqual(
        paginatedBrandsMock,
      );
    });
  });

  describe('getById', () => {
    it('should get a single brand', () => {
      expect(controller.getById(testId)).resolves.toEqual(brandMock);
    });
    it('rejects with NotFoundException on fake id', () => {
      expect(controller.getById(testFakeId)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create a new brand', () => {
      const dto: BrandDto = {
        name: testName,
      };
      expect(controller.create(dto)).resolves.toEqual(brandMock);
    });
  });

  describe('update', () => {
    const dto = <BrandDto>{ name: testName };
    it('should update a brand', () => {
      expect(controller.update(testId, dto)).resolves.toBeUndefined();
    });
    it('rejects with NotFoundException on fake id', () => {
      expect(controller.update(testFakeId, dto)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('delete', () => {
    it('should delete a brand', () => {
      expect(controller.delete(testId)).resolves.toBeUndefined();
    });
    it('rejects with NotFoundException on fake id', () => {
      expect(controller.delete(testFakeId)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });
});
