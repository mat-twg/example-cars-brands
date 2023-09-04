import { Test, TestingModule } from '@nestjs/testing';
import { CarsController } from './cars.controller';
import { CarsService } from './cars.service';
import { CarDto } from './dto/car.dto';
import mongoose, { UpdateWriteOpResult } from 'mongoose';
import { Car, PaginatedCars } from './schemas/cars.schema';
import {
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import {
  carMock,
  paginatedCarsMock,
  testBrandId,
  testFakeId,
  testId,
  testLimit,
  testName,
  testPage,
} from './mocks/cars.mock';

describe('Cars Controller', () => {
  let controller: CarsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarsController],
      providers: [
        {
          provide: CarsService,
          useValue: {
            findById: jest
              .fn()
              .mockImplementation((id: string): Promise<Car | null> => {
                if (id !== testId) {
                  return Promise.resolve(null);
                } else {
                  return Promise.resolve(carMock);
                }
              }),
            findAll: jest
              .fn()
              .mockImplementation((): Promise<PaginatedCars> => {
                return Promise.resolve(paginatedCarsMock);
              }),
            create: jest.fn().mockImplementation((): Promise<Car> => {
              return Promise.resolve(carMock);
            }),
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

    controller = module.get<CarsController>(CarsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('list', () => {
    it('should get a paginated cars', () => {
      expect(controller.list([], testPage, testLimit)).resolves.toEqual(
        paginatedCarsMock,
      );
    });
  });

  describe('getById', () => {
    it('should get a single brand', () => {
      expect(controller.getById(testId)).resolves.toEqual(carMock);
    });
    it('rejects with NotFoundException on fake id', () => {
      expect(controller.getById(testFakeId)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    it('should create a new brand', () => {
      const dto: CarDto = {
        name: testName,
        brandId: testBrandId,
      };

      expect(controller.create(dto)).resolves.toEqual(carMock);
    });
  });

  describe('update', () => {
    const dto: CarDto = {
      name: testName,
      brandId: testBrandId,
    };
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
