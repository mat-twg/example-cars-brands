import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ParseSortPipe implements PipeTransform {
  constructor(readonly allowTransformId = true) {}

  private parse(item: string): Record<string, number> {
    switch (true) {
      case /^-/.test(item):
        return { [item.replace(/^-/, '')]: -1 };
      case /^\+/.test(item):
      default:
        return { [item.replace(/^\+/, '')]: 1 };
    }
  }

  private transformId(value: Record<string, number>): Record<string, number> {
    if (Object.keys(value)[0] === 'id') {
      value['_id'] = value['id'];
      delete value['id'];
    }
    return value;
  }

  transform(value: string | string[]): Record<string, number>[] | null {
    if (!value) {
      return null;
    }
    if (!Array.isArray(value)) {
      value = [value];
    }
    const results = value.map((item) =>
      this.allowTransformId
        ? this.transformId(this.parse(item))
        : this.parse(item),
    );
    return Object.assign({}, ...results);
  }
}
