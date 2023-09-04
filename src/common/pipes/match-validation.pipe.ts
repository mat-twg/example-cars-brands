import {
  Injectable,
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';

interface MatchValidationPipeOptions {
  default?: any;
}

const optionsDefaults: MatchValidationPipeOptions = {
  default: undefined,
};

@Injectable()
export class MatchValidationPipe implements PipeTransform {
  constructor(
    readonly regExp: RegExp,
    readonly options?: MatchValidationPipeOptions,
  ) {
    this.options = { ...optionsDefaults, ...options };
  }

  private static throwException(value: string, metadata: ArgumentMetadata) {
    throw new BadRequestException(
      `Param validation error: '${metadata.data}' has invalid value '${value}'`,
      `Bad request`,
    );
  }

  transform(value: string, metadata: ArgumentMetadata) {
    if (Array.isArray(value)) {
      return value.map((val) =>
        val.toString().match(this.regExp)
          ? val
          : MatchValidationPipe.throwException(val, metadata),
      );
    }
    return value
      ? value.toString().match(this.regExp)
        ? value
        : MatchValidationPipe.throwException(value, metadata)
      : this.options.default ?? value;
  }
}
