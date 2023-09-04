import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, {
  Types,
  Model,
  PaginateOptions,
  UpdateWriteOpResult,
} from 'mongoose';
import { Car, CarDocument, PaginatedCars } from './schemas/cars.schema';
import { CarDto } from './dto/car.dto';
import { BrandsService } from '../brands/brands.service';
import { AggregatePaginateModel } from '../../common/paginate/aggregate-paginate.model';

@Injectable()
export class CarsService {
  constructor(
    private readonly brandService: BrandsService,
    @InjectModel(Car.name) private carModel: Model<CarDocument>,
    @InjectModel(Car.name)
    private paginatedCarsModel: AggregatePaginateModel<CarDocument>,
  ) {}

  protected aggregateQuery(match = {}): mongoose.Aggregate<any[]> {
    return this.carModel.aggregate([
      {
        $match: match,
      },
      {
        $lookup: {
          from: 'brands',
          localField: 'brandId',
          foreignField: '_id',
          as: 'brand',
        },
      },
      {
        $addFields: { brand: { $first: '$brand' } },
      },
      {
        $project: {
          brandId: 0,
        },
      },
    ]);
  }

  private async checkBrand(id: string): Promise<void> {
    const brand = await this.brandService.findById(id);

    if (!brand) {
      throw new UnprocessableEntityException(
        `Brand with id: '${id}' not found!`,
      );
    }
  }

  async findById(id: string): Promise<Car | null> {
    return this.aggregateQuery({ _id: new Types.ObjectId(id) })
      .exec()
      .then((results) =>
        results.length === 0 ? null : new this.carModel(results[0]),
      );
  }

  async findAll(options: PaginateOptions = {}): Promise<PaginatedCars> {
    return this.paginatedCarsModel
      .aggregatePaginate(this.aggregateQuery(), options)
      .then((result) => {
        result.docs = result.docs.map((item) => new this.carModel(item));
        return result;
      });
  }

  async create(dto: CarDto): Promise<Car> {
    await this.checkBrand(dto.brandId);

    const car: CarDocument = await this.carModel.create({
      ...dto,
      brandId: new Types.ObjectId(dto.brandId),
    });

    return this.findById(car._id.toString());
  }

  async update(id: string, dto: CarDto): Promise<UpdateWriteOpResult> {
    await this.checkBrand(dto.brandId);

    return this.carModel.updateOne(
      { _id: new Types.ObjectId(id) },
      { $set: { ...dto, brandId: new Types.ObjectId(dto.brandId) } },
    );
  }

  async delete(id: string): Promise<mongoose.mongo.DeleteResult> {
    return this.carModel.deleteOne({ _id: new Types.ObjectId(id) });
  }
}
