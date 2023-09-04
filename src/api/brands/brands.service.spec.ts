import { Test, TestingModule } from '@nestjs/testing';
import { BrandsService } from './brands.service';
import { Brand, BrandDocument, PaginatedBrands } from './schemas/brands.schema';
import mongoose, {
  Model,
  Types,
  PaginateModel,
  UpdateWriteOpResult,
} from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import {
  brandMock,
  paginatedBrandsMock,
  testFakeId,
  testId,
  testName,
} from './mocks/brands.mock';

class TestModel {
  constructor(private data) {}
  static paginate = jest.fn();
  static findById = jest.fn().mockImplementation(async (id: Types.ObjectId) => {
    if (id.toString() === testId) {
      return Promise.resolve(brandMock);
    }
    return Promise.resolve(null);
  });
  static create = jest.fn();
  static updateOne = jest.fn().mockResolvedValue({
    matchedCount: 1,
  } as UpdateWriteOpResult);
  static deleteOne = jest.fn().mockResolvedValue({
    deletedCount: 1,
  } as mongoose.mongo.DeleteResult);
}

describe('BrandsService', () => {
  let service: BrandsService;
  let model: Model<BrandDocument>;
  let paginateModel: PaginateModel<BrandDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BrandsService,
        {
          provide: getModelToken(Brand.name),
          useValue: TestModel,
        },
        {
          provide: getModelToken(PaginatedBrands.name),
          useValue: TestModel,
        },
      ],
    }).compile();

    service = module.get<BrandsService>(BrandsService);
    model = module.get<Model<BrandDocument>>(getModelToken(Brand.name));
    paginateModel = module.get<PaginateModel<BrandDocument>>(
      getModelToken(PaginatedBrands.name),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should get one by id', async () => {
      expect(await service.findById(testId)).toEqual(brandMock);
    });
    it('should get null on fake id', async () => {
      expect(await service.findById(testFakeId)).toEqual(null);
    });
  });

  describe('findAll', () => {
    it('should get paginated brands', async () => {
      jest
        .spyOn(paginateModel, 'paginate')
        .mockResolvedValueOnce(paginatedBrandsMock as any);

      expect(await service.findAll()).toEqual(paginatedBrandsMock);
    });
  });

  describe('create', () => {
    it('should create new brand', async () => {
      jest.spyOn(model, 'create').mockResolvedValueOnce(brandMock as any);

      expect(await service.create({ name: testName })).toEqual(brandMock);
    });
  });

  describe('update', () => {
    it('should update brand and return UpdateWriteOpResult', async () => {
      expect(await service.update(testId, { name: testName })).toEqual({
        matchedCount: 1,
      });
    });
  });

  describe('delete', () => {
    it('should delete brand and return mongoose.mongo.DeleteResult', async () => {
      expect(await service.delete(testId)).toEqual({
        deletedCount: 1,
      });
    });
  });
});
