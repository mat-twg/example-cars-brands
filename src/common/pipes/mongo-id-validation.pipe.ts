import {
  Injectable,
  ArgumentMetadata,
  PipeTransform,
  BadRequestException,
} from '@nestjs/common';
import { Types } from 'mongoose';

@Injectable()
export class MongoIdValidationPipe implements PipeTransform {
  transform(value: string | string[], metadata: ArgumentMetadata) {
    if (!value) {
      return value;
    }

    try {
      if (Array.isArray(value)) {
        value.forEach((id) => new Types.ObjectId(id));
        return value;
      }
      new Types.ObjectId(value);
      return value;
    } catch (e) {
      throw new BadRequestException(
        `Param validation error: '${metadata.data}' has invalid mongo objectId value(s), must be a single String of 12 bytes or a string of 24 hex characters`,
        `Bad request`,
      );
    }
  }
}
