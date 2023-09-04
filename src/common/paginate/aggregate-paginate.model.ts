import {
  Aggregate,
  Document,
  Model,
  PaginateResult,
  PaginateOptions,
} from 'mongoose';

export interface AggregatePaginateModel<T extends Document> extends Model<T> {
  aggregatePaginate(
    query?: Aggregate<T[]>,
    options?: PaginateOptions,
    callback?: (err: any, result: PaginateResult<T>) => void,
  ): Promise<PaginateResult<T>>;
}
