import { ParseSortPipe } from './parse-sort.pipe';

describe('ParseSortPipe', () => {
  it('should return null', () => {
    const pipe: ParseSortPipe = new ParseSortPipe();
    expect(pipe.transform(null)).toEqual(null);
  });

  it('should return valid mongo sort object eg: {name: 1}', () => {
    const pipe: ParseSortPipe = new ParseSortPipe();
    expect(pipe.transform('+test')).toEqual({ test: 1 });
  });

  it('should return valid mongo sort object from array eg: {id:1, name:-1}', () => {
    const pipe: ParseSortPipe = new ParseSortPipe(false);
    expect(pipe.transform(['+id', '-name'])).toEqual({ id: 1, name: -1 });
  });

  it('should return valid mongo sort object from array with transformed id->_id', () => {
    const pipe: ParseSortPipe = new ParseSortPipe(true);
    expect(pipe.transform(['+id', '-name'])).toEqual({ _id: 1, name: -1 });
  });
});
