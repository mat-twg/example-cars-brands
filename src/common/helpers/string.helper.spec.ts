import { ucfirst, lcfirst } from './string.helper';

describe('StringHelper', () => {
  it('ucfirst', () => {
    expect(ucfirst('aaa')).toEqual('Aaa');
  });
  it('lcfirst', () => {
    expect(lcfirst('Aaa')).toEqual('aaa');
  });
});
