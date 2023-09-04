import { MongoIdValidationPipe } from './mongo-id-validation.pipe';
import { ArgumentMetadata, BadRequestException } from '@nestjs/common';

describe('MongoIdValidationPipe', () => {
  const testId = '64e8d7d2d44dfe170817483d';

  it('undefined mongo id (e.g: null | false)', async () => {
    const pipe: MongoIdValidationPipe = new MongoIdValidationPipe();
    const metadata: ArgumentMetadata = {
      type: 'param',
      data: 'test',
    };
    expect(pipe.transform(undefined, metadata)).toEqual(undefined);
  });
  it('valid mongo id', async () => {
    const pipe: MongoIdValidationPipe = new MongoIdValidationPipe();
    const metadata: ArgumentMetadata = {
      type: 'param',
      data: 'test',
    };
    expect(pipe.transform(testId, metadata)).toEqual(testId);
  });
  it('valid array of mongo ids', async () => {
    const pipe: MongoIdValidationPipe = new MongoIdValidationPipe();
    const metadata: ArgumentMetadata = {
      type: 'param',
      data: 'test',
    };
    expect(pipe.transform([testId, testId], metadata)).toEqual([
      testId,
      testId,
    ]);
  });
  it('invalid mongo id value', async () => {
    const pipe: MongoIdValidationPipe = new MongoIdValidationPipe();
    const metadata: ArgumentMetadata = {
      type: 'param',
      data: 'test',
    };
    expect(() => pipe.transform('invalid mongo id', metadata)).toThrow(
      BadRequestException,
    );
  });
});
