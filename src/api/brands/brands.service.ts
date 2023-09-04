import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, {
  Model,
  PaginateModel,
  PaginateOptions,
  Types,
  UpdateWriteOpResult,
} from 'mongoose';
import { Brand, BrandDocument, PaginatedBrands } from './schemas/brands.schema';
import { BrandDto } from './dto/brand.dto';

@Injectable()
export class BrandsService {
  constructor(
    @InjectModel(Brand.name) private brandModel: Model<BrandDocument>,
    @InjectModel(Brand.name)
    private paginatedBrandsModel: PaginateModel<BrandDocument>,
  ) {}

  async findById(id: string): Promise<Brand | null> {
    return this.brandModel.findById(new Types.ObjectId(id));
  }

  async findAll(options: PaginateOptions = {}): Promise<PaginatedBrands> {
    return this.paginatedBrandsModel.paginate({}, options);
  }

  async create(dto: BrandDto): Promise<Brand> {
    return this.brandModel.create(dto);
  }

  async update(id: string, dto: BrandDto): Promise<UpdateWriteOpResult> {
    return this.brandModel.updateOne(
      { _id: new Types.ObjectId(id) },
      { $set: dto },
    );
  }

  async delete(id: string): Promise<mongoose.mongo.DeleteResult> {
    return this.brandModel.deleteOne({ _id: new Types.ObjectId(id) });
  }
}
