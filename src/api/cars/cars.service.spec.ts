import { Test, TestingModule } from '@nestjs/testing';
import { CarsService } from './cars.service';
import { Car, CarDocument, PaginatedCars } from './schemas/cars.schema';
import mongoose, { Model, Types, UpdateWriteOpResult } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { AggregatePaginateModel } from '../../common/paginate/aggregate-paginate.model';
import { BrandsService } from '../brands/brands.service';
import { Brand } from '../brands/schemas/brands.schema';
import { CarDto } from './dto/car.dto';
import { UnprocessableEntityException } from '@nestjs/common';
import { brandMock } from '../brands/mocks/brands.mock';
import {
  carMock,
  paginatedCarsMock,
  testBrandId,
  testBranFakedId,
  testFakeId,
  testId,
  testName,
} from './mocks/cars.mock';

class TestModel {
  constructor(private data) {}
  static aggregate = jest.fn();
  static aggregatePaginate = jest.fn();
  static create = jest.fn();
  static updateOne = jest.fn();
  static deleteOne = jest
    .fn()
    .mockImplementation(
      async (filter = {}): Promise<mongoose.mongo.DeleteResult> => {
        if (filter._id.toString() === testId) {
          return Promise.resolve({
            deletedCount: 1,
          } as mongoose.mongo.DeleteResult);
        }
        return Promise.resolve({
          deletedCount: 0,
        } as mongoose.mongo.DeleteResult);
      },
    );
}

describe('CarsService', () => {
  let service: CarsService;
  let model: Model<CarDocument>;
  let paginateModel: AggregatePaginateModel<CarDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CarsService,
        {
          provide: BrandsService,
          useValue: {
            findById: jest
              .fn()
              .mockImplementation(async (id: string): Promise<Brand | null> => {
                return id !== testBrandId
                  ? Promise.resolve(null)
                  : Promise.resolve(brandMock);
              }),
          },
        },
        {
          provide: getModelToken(Brand.name),
          useValue: Model,
        },
        {
          provide: getModelToken(Car.name),
          useValue: TestModel,
        },
        {
          provide: getModelToken(PaginatedCars.name),
          useValue: TestModel,
        },
      ],
    }).compile();

    service = module.get<CarsService>(CarsService);
    model = module.get<Model<CarDocument>>(getModelToken(Car.name));
    paginateModel = module.get<AggregatePaginateModel<CarDocument>>(
      getModelToken(PaginatedCars.name),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getById', () => {
    it('should get one by id', async () => {
      jest.spyOn(model, 'aggregate').mockReturnValue({
        exec: jest.fn().mockResolvedValue([carMock]),
      } as any);

      expect(await service.findById(testId)).toEqual({ data: carMock });
    });

    it('should get null if not found by id', async () => {
      jest.spyOn(model, 'aggregate').mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      } as any);

      expect(await service.findById(testId)).toEqual(null);
    });
  });

  describe('findAll', () => {
    it('should get paginated cars', async () => {
      jest
        .spyOn(paginateModel, 'aggregatePaginate')
        .mockResolvedValueOnce(paginatedCarsMock as any);

      expect(await service.findAll()).toEqual(paginatedCarsMock);
    });
  });

  describe('create', () => {
    it('should create new car', async () => {
      jest
        .spyOn(model, 'create')
        .mockResolvedValueOnce({ _id: new Types.ObjectId(testId) } as any);

      jest.spyOn(model, 'aggregate').mockReturnValue({
        exec: jest.fn().mockResolvedValue([carMock]),
      } as any);

      const dto: CarDto = { name: testName, brandId: testBrandId };

      expect(await service.create(dto)).toEqual({ data: carMock });
    });

    it('rejects with UnprocessableEntityException if fake brand id', async () => {
      jest
        .spyOn(model, 'create')
        .mockResolvedValueOnce({ _id: new Types.ObjectId(testId) } as any);

      jest.spyOn(model, 'aggregate').mockReturnValue({
        exec: jest.fn().mockResolvedValue([carMock]),
      } as any);

      const dto: CarDto = { name: testName, brandId: testBranFakedId };

      await expect(service.create(dto)).rejects.toBeInstanceOf(
        UnprocessableEntityException,
      );
    });
  });

  describe('update', () => {
    it('should update existing car', async () => {
      jest
        .spyOn(model, 'updateOne')
        .mockResolvedValueOnce({ matchedCount: 1 } as UpdateWriteOpResult);

      const dto: CarDto = { name: testName, brandId: testBrandId };

      expect(await service.update(testId, dto)).toEqual({
        matchedCount: 1,
      });
    });

    it('rejects with UnprocessableEntityException if fake brand id', async () => {
      jest
        .spyOn(model, 'updateOne')
        .mockResolvedValueOnce({ matchedCount: 1 } as UpdateWriteOpResult);

      const dto: CarDto = { name: testName, brandId: testBranFakedId };

      await expect(service.update(testId, dto)).rejects.toBeInstanceOf(
        UnprocessableEntityException,
      );
    });
  });

  describe('delete', () => {
    it('should delete existing car', async () => {
      expect(await service.delete(testId)).toEqual({
        deletedCount: 1,
      });
    });

    it('return delete response with deleteCount=0 if car not found', async () => {
      expect(await service.delete(testFakeId)).toEqual({
        deletedCount: 0,
      });
    });
  });
});
