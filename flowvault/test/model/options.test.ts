import {
  InsertOptions,
  GetOptions,
  UpdateOptions,
  DeleteOptions,
  QueryOptions,
  DetokenizeOptions,
  GetTokensOptions,
  UploadFilesOptions,
  DeleteFilesOptions,
} from '../../src';

describe('FlowVault options models', () => {
  it('InsertOptions: upsert setter/getter + inherited request headers', () => {
    const opts = new InsertOptions();
    expect(opts.getUpsert()).toBeUndefined();
    opts.setUpsert({ updateType: 'UPDATE', uniqueColumns: ['email'] });
    expect(opts.getUpsert()).toEqual({ updateType: 'UPDATE', uniqueColumns: ['email'] });

    opts.setRequestHeaders({ 'x-custom': 'v' });
    expect(opts.getRequestHeaders()).toEqual({ 'x-custom': 'v' });
  });

  it('GetOptions: all setters/getters round-trip', () => {
    const opts = new GetOptions();
    expect(opts.getFields()).toBeUndefined();
    expect(opts.getColumnRedactions()).toBeUndefined();
    expect(opts.getUniqueValues()).toBeUndefined();
    expect(opts.getLimit()).toBeUndefined();
    expect(opts.getOffset()).toBeUndefined();

    opts.setFields(['name', 'email']);
    opts.setColumnRedactions([{ columnName: 'ssn', redaction: 'MASKED' }]);
    opts.setUniqueValues([{ email: 'a@b.com' }]);
    opts.setLimit(10);
    opts.setOffset(2);

    expect(opts.getFields()).toEqual(['name', 'email']);
    expect(opts.getColumnRedactions()).toEqual([{ columnName: 'ssn', redaction: 'MASKED' }]);
    expect(opts.getUniqueValues()).toEqual([{ email: 'a@b.com' }]);
    expect(opts.getLimit()).toBe(10);
    expect(opts.getOffset()).toBe(2);
  });

  it('the remaining options classes construct empty and inherit request headers', () => {
    const classes = [
      new UpdateOptions(),
      new DeleteOptions(),
      new QueryOptions(),
      new DetokenizeOptions(),
      new GetTokensOptions(),
      new UploadFilesOptions(),
      new DeleteFilesOptions(),
    ];
    classes.forEach((opts) => {
      expect(opts.getRequestHeaders()).toBeUndefined();
      opts.setRequestHeaders({ 'x-trace': 'abc' });
      expect(opts.getRequestHeaders()).toEqual({ 'x-trace': 'abc' });
    });
  });
});
