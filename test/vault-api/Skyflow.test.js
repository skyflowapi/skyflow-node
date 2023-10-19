/*
	Copyright (c) 2022 Skyflow, Inc. 
*/
import Skyflow from '../../src/vault-api/Skyflow';
import { LogLevel, RedactionType, RequestMethod } from '../../src/vault-api/utils/common';
import { isValidURL} from '../../src/vault-api/utils/validators';
import clientModule from '../../src/vault-api/client';
import { setLogLevel } from '../../src/vault-api/Logging';
import SKYFLOW_ERROR_CODE from '../../src/vault-api/utils/constants';
import logs from '../../src/vault-api/utils/logs';
jest.mock('../../src/vault-api/utils/jwt-utils',()=>({
  __esModule: true,
  isTokenValid:jest.fn(()=>true),
}));
jest.mock('../../src/vault-api/client');
const skyflowConfig = {
  vaultID: '<VaultID>',
  vaultURL: 'https://www.vaulturl.com',
  getBearerToken: ()=>{
    return new Promise((resolve,_)=>{
        resolve("token")
    })
  },
};

const clientData = {
  client: {
    config: { ...skyflowConfig },
    metadata: {},
  },
  context: { logLevel: LogLevel.ERROR}
}
describe('Skyflow initialization', () => {
  test('should initialize the skyflow object  ', () => {
    const skyflow = Skyflow.init({
      vaultID: '<VaultID>',
      vaultURL: 'https://www.vaulturl.com',
      getBearerToken: jest.fn(),
    });
    expect(skyflow.constructor === Skyflow).toBe(true);
  });

  test('invalid vaultURL testing', async () => {
    try {
      const skyflow = Skyflow.init({
        vaultID: '<VaultID>',
        vaultURL: 'https://www.vaulturl.com',
        getBearerToken: jest.fn(),
      });
    } catch (error) {
      expect(error).toBeDefined();
    }
  });

  test('invalid method name for getAccessToken', async () => {
    try {
      const skyflow = Skyflow.init({
        vaultID: '<VaultID>',
        vaultURL: 'https://www.vaulturl.com',
        getTokens: () => Promise.resolve(httpRequestToken()),
      });
    } catch (error) {
      expect(error).toBeDefined();
    }
  });
});

describe('skyflow insert validations', () => {
  const skyflow = Skyflow.init({
    vaultID: '<VaultID>',
    vaultURL: 'https://www.vaulturl.com',
    getBearerToken: jest.fn(),
  });

  test('invalid input', async () => {
    try {
      const res = await skyflow.insert({});
    } catch (err) {
      expect(err).toBeDefined();
    }
  });

  test('records object empty', async () => {
    try {
      const res = await skyflow.insert({ records: [] });
    } catch (err) {
      expect(err).toBeDefined();
    }
  });

  test('missing fields', async () => {
    try {
      const res = await skyflow.insert({ records: [{ table: 'test' }] });
    } catch (err) {
      expect(err).toBeDefined();
    }
  });

  test('missing table', async () => {
    try {
      const res = await skyflow.insert({ records: [{ fields: { name: 'joey' } }] });
    } catch (err) {
      expect(err).toBeDefined();
    }
  });

  test('empty table name', async () => {
    try {
      const res = await skyflow.insert({ records: [{ table: '', fields: { name: 'joey' } }] });
    } catch (err) {
      expect(err).toBeDefined();
    }
  });
});

const records = {
  records: [
    {
      fields: {
        cvv: "234",
        card_number: "411111111111111",
        fullname: "san",
        expiry_date: "11/22",
    },
    table: "cards",
    }
  ],
};

const options = {
  tokens: true,
};

const insertResponse = {"vaultID":"<VaultID>","responses":[{"records":[{"skyflow_id":"id"}]},{"fields":{"card_number":"token","cvv":"token","expiry_date":"token","fullname":"token"}}]}
const insertResponseWithoutTokens = {"vaultID":"<VaultID>","responses":[{"records":[{"skyflow_id":"id"}]}]}
const on = jest.fn();

describe('skyflow insert', () => {

  let skyflow;
  beforeEach(() => {
    skyflow = Skyflow.init({
      vaultID: '<VaultID>',
      vaultURL: 'https://www.vaulturl.com',
      getBearerToken: ()=>{
        return new Promise((resolve,_)=>{
            resolve("token")
        })
      }
    });

   
  });

  test('insert invalid input', (done) => {
    try {
      const res = skyflow.insert({"records":[]});
      let error;
      res.catch((err) => error = err);

      setTimeout(() => {
        expect(error).toBeDefined();
        done();
      }, 1000);
    } catch (err) {
    }
  });

  test('insert success with valid token', () => {
    jest.mock('../../src/vault-api/utils/jwt-utils',()=>({
      __esModule: true,
      isTokenValid:jest.fn(()=>true),
    }));
    const clientReq = jest.fn(() => Promise.resolve(insertResponse));
    const mockClient = {
      config: skyflowConfig,
      request: clientReq,
      metadata:{}
    }
    setLogLevel(LogLevel.WARN)
    clientModule.mockImplementation(() => {return mockClient});

    skyflow = Skyflow.init({
        vaultID: '<VaultID>',
        vaultURL: 'https://www.vaulturl.com',
        getBearerToken: ()=>{
          return new Promise((resolve,_)=>{
              resolve("token")
          })
        }
      });    
      const res = skyflow.insert(records);
      
      return res.then((res) => {
        expect(clientReq).toHaveBeenCalled();
        expect(res.records.length).toBe(1);
        expect(res.error).toBeUndefined(); 
      });
    
  });


  test('insert success without tokens', () => {

  
    const clientReq = jest.fn(() => Promise.resolve(insertResponseWithoutTokens));
    const mockClient = {
      config: skyflowConfig,
      request: clientReq,
      metadata:{}
    }
    setLogLevel(LogLevel.WARN)
    clientModule.mockImplementation(() => {return mockClient});
      skyflow = Skyflow.init({
        vaultID: '<VaultID>',
        vaultURL: 'https://www.vaulturl.com',
        getBearerToken: ()=>{
          return new Promise((resolve,_)=>{
              resolve("token")
          })
        }
      });    
      const res = skyflow.insert(records,{tokens:false});
      return res.then((res) => {
        expect(clientReq).toHaveBeenCalled();
        expect(res.records.length).toBe(1);
        expect(res.error).toBeUndefined(); 
      });
    
  });

  test('insert error', (done) => {

    try {
      const clientReq = jest.fn(() => Promise.reject({ error: { message: "resource doesn't exist", code: 404 } }));
      const mockClient = {
        config: skyflowConfig,
        request: clientReq,
        metadata:{}
      }
      setLogLevel(LogLevel.INFO)
      clientModule.mockImplementation(() => {return mockClient});
        skyflow = Skyflow.init({
          vaultID: '<VaultID>',
          vaultURL: 'https://www.vaulturl.com',
          getBearerToken: ()=>{
            return new Promise((resolve,_)=>{
                resolve("token")
            })
          }
        });
      const res = skyflow.insert(records,{tokens:false});
      let error;
      res.catch((err) => error = err);

      setTimeout(() => {
        expect(error).toBeDefined();
        done();
      }, 1000);
    } catch (err) {
    }
  });

  test('insert success with upsert options', () => {
    jest.mock('../../src/vault-api/utils/jwt-utils',()=>({
      __esModule: true,
      isTokenValid:jest.fn(()=>true),
    }));
    const clientReq = jest.fn(() => Promise.resolve(insertResponse));
    const mockClient = {
      config: skyflowConfig,
      request: clientReq,
      metadata:{}
    }
    clientModule.mockImplementation(() => {return mockClient});

    skyflow = Skyflow.init({
        vaultID: '<VaultID>',
        vaultURL: 'https://www.vaulturl.com',
        getBearerToken: ()=>{
          return new Promise((resolve,_)=>{
              resolve("token")
          })
        }
      });    
      const res = skyflow.insert(records,{upsert:[
        {
          table: 'table1', column: 'column2'
        }
      ]});
      
      return res.then((res) => {
        expect(clientReq).toHaveBeenCalled();
        expect(res.records.length).toBe(1);
        expect(res.error).toBeUndefined(); 
      });
    
  });

  test('insert with invalid tokens option type',(done)=>{
        try{
          skyflow = Skyflow.init({
            vaultID: '<VaultID>',
            vaultURL: 'https://www.vaulturl.com',
            getBearerToken: ()=>{
              return new Promise((resolve,_)=>{
                  resolve("token")
              })
            }
          });    
          const res = skyflow.insert(records,{tokens:{}});
          res.catch((err)=>{
            expect(err).toBeDefined();
            done();
          });
        }catch(err){
          done(err);
        }
  });
  test('insert without any options',(done)=>{
    try{
      skyflow = Skyflow.init({
        vaultID: '<VaultID>',
        vaultURL: 'https://www.vaulturl.com',
        getBearerToken: ()=>{
          return new Promise((resolve,_)=>{
              resolve("token")
          })
        }
      });    
      const res = skyflow.insert({});
      res.catch((err)=>{
        expect(err).toBeDefined();
        done();
      });
    }catch(err){
      done(err);
    }
  });

});

const detokenizeInput = {
  records: [{
    token: 'token1',
  }],
};
const invalidDetokenizeInput = {
  recordscds: [{
    token: 'token1',
  }],
}

const invalidDetokenizeInputEmptyToken = {
  records: [{
    token: '',
  }],
}

const invalidDetokenizeInputEmptyRecords = {
  records: [],
}

const invalidDetokenizeInputEmptyRecordObject = {
  records: [
    {

    }
  ],
}
const detokenizeRes = {
  records: [{
    token: 'token1',
    value: '1234',
    valueType: 'string'
  }],
};

const invalidTokenDetokenizeResponse = { error: { message: "token doesn't exist", code: 404 } }

describe('skyflow detokenize', () => {
 
  let skyflow;
  beforeEach(() => {
    skyflow = Skyflow.init({
      vaultID: '<VaultID>',
      vaultURL: 'https://www.vaulturl.com',
      getBearerToken: jest.fn(),
    });
  });

  test('detokenize success with valid bearer token', (done) => {
    try {

      jest.mock('../../src/vault-api/utils/jwt-utils',()=>({
        __esModule: true,
        isTokenValid:jest.fn(()=>true),
      }));
      const clientReq = jest.fn(() => Promise.resolve(detokenizeRes));
      const mockClient = {
        config: skyflowConfig,
        request: clientReq,
        metadata:{}
      }
      setLogLevel(LogLevel.ERROR)
      clientModule.mockImplementation(() => {return mockClient});
        skyflow = Skyflow.init({
          vaultID: '<VaultID>',
          vaultURL: 'https://www.vaulturl.com',
          getBearerToken: ()=>{
            return new Promise((resolve,_)=>{
                resolve("token")
            })
          }
        });
      const res = skyflow.detokenize(detokenizeInput);
      let data;
      res.then((res) => data = res);

      setTimeout(() => {
        expect(data.records.length).toBe(1);
        expect(data.error).toBeUndefined();
        done();
      }, 1000);
    } catch (err) {
    }
  });


  test('detokenize error', (done) => {
    
    try {
      
      const clientReq = jest.fn(() => Promise.reject(invalidTokenDetokenizeResponse));
      const mockClient = {
        config: skyflowConfig,
        request: clientReq,
        metadata:{}
      }
      setLogLevel(LogLevel.DEBUG)
      clientModule.mockImplementation(() => {return mockClient});
        skyflow = Skyflow.init({
          vaultID: '<VaultID>',
          vaultURL: 'https://www.vaulturl.com',
          getBearerToken: ()=>{
            return new Promise((resolve,_)=>{
                resolve("token")
            })
          }
        });
      const res = skyflow.detokenize(detokenizeInput);
      let error;
      res.catch((err) => error = err);

      setTimeout(() => {
        expect(error).toBeDefined();
        done();
      }, 1000);
    } catch (err) {
    }
  });

  test('detokenize invalid input 1',()=>{
    try {
      
      const res = skyflow.detokenize(invalidDetokenizeInput);
        res.catch((err)=>{
          expect(err).toBeDefined();
        })
    }catch(err){
    }
  });

  test('detokenize invalid input 2',()=>{
    try {
      
      const res = skyflow.detokenize({});
        res.catch((err)=>{
          expect(err).toBeDefined();
        })
    }catch(err){
    }
  });

  test('detokenize invalid input 3',()=>{
    try {
      
      const res = skyflow.detokenize(invalidDetokenizeInputEmptyRecords);
        res.catch((err)=>{
          expect(err).toBeDefined();
        })
    }catch(err){
    }
  });

  test('detokenize invalid input 4',()=>{
    try {
      
      const res = skyflow.detokenize(invalidDetokenizeInputEmptyToken);
        res.catch((err)=>{
          expect(err).toBeDefined();
        })
    }catch(err){
    }
  });

  test('detokenize invalid input 5',()=>{
    try {
      
      const res = skyflow.detokenize(invalidDetokenizeInputEmptyRecordObject);
        res.catch((err)=>{
          expect(err).toBeDefined();
        })
    }catch(err){
    }
  });
});

const getByIdInput = {
  records: [{
    ids: ['id'],
    table: 'cards',
    redaction: 'PLAIN_TEXT',
  }],
};

const getByIdInputWithoutRedaction = {
  records: [{
    ids: ['id'],
    table: 'cards',
  }],
};

const getByIdInputMissingIds = {
  records: [{
    table: 'cards',
    redaction: 'PLAIN_TEXT',
  }],
};

const getByIdInputInvalidRedaction = {
  records: [{
    ids: ['id'],
    table: 'cards',
    redaction: 'PLAITEXT',
  }],
};

const getByIdInputMissingColumnName= {
  records: [
    {
      table: "cards",
      columnValues: ["ab"],
      redaction: "PLAIN_TEXT",
    },
  ],
};

const getByIdInputMissingColumnValues= {
  records: [
    {
      table: "cards",
      columnName: "cards",
      redaction: "PLAIN_TEXT",
    },
  ],
};

const getByIdInputWithColumnName= {
  records: [
    {
      table: "cards",
      ids: ['id'],
      columnName: " ",
      columnValues: ["ab"],
      redaction: "PLAIN_TEXT",
    },
  ],
};

const getByIdInputWithEmptyTable= {
  records: [
    {
      table: " ",
      ids: ['id'],
      redaction: "PLAIN_TEXT",
    },
  ],
};

const getByIdInputWithMissingTable= {
  records: [
    {
      ids: ['id'],
      redaction: "PLAIN_TEXT",
    },
  ],
};

const getByIdInputInvalidColumnNameType= {
  records: [
    {
      table: "cards",
      columnName: true,
      columnValues: ["ab"],
      redaction: "PLAIN_TEXT",
    },
  ],
};
const getByIdInputInvalidColumnValuesType= {
  records: [
    {
      table: "cards",
      columnName: "abc",
      columnValues: true,
      redaction: "PLAIN_TEXT",
    },
  ],
};

const getByIdInputEmptyColumnValues= {
  records: [
    {
      table: "cards",
      columnName: "abc",
      columnValues: [],
      redaction: "PLAIN_TEXT",
    },
  ],
};

const getByIdInputInvalidOptionsColumnValues= {
  records: [
    {
      table: "cards",
      columnName: "abc",
      columnValues: [true],
      redaction: "PLAIN_TEXT",
    },
  ],
};

const getByIdInputEmptydOptionsColumnValues= {
  records: [
    {
      table: "cards",
      columnName: "abc",
      columnValues: [""],
      redaction: "PLAIN_TEXT",
    },
  ],
};

const getByIdWithValidUniqColumnOptions= {
  records: [
    {
      table: "cards",
      columnName: "abc",
      columnValues: ["value"],
      redaction: "PLAIN_TEXT",
    },
  ],
};

const getByIdRes = {
  records: [
    {
      fields: {
        cvv: '123',
      },
      table: 'pii_fields',
    },
  ],
};

const getWithNoSkyflowIDAndColumnName = {
  records: [
    {
      table: "cards",
      redaction: "PLAIN_TEXT",
    },
  ],
}

const getByIdError = { error: { message: "id doesn't exist", code: 404 } };

describe('skyflow getById', () => {

  let skyflow;
  beforeEach(() => {
    skyflow = Skyflow.init({
      vaultID: '<VaultID>',
      vaultURL: 'https://www.vaulturl.com',
      getBearerToken: jest.fn(),
    });

  });

  test('getById success with valid bearer token', (done) => {
    try {
      jest.mock('../../src/vault-api/utils/jwt-utils',()=>({
        __esModule: true,
        isTokenValid:jest.fn(()=>true),
      }));
      const clientReq = jest.fn(() => Promise.resolve(getByIdRes));
      const mockClient = {
        config: skyflowConfig,
        request: clientReq,
        metadata:{}
      }

      clientModule.mockImplementation(() => {return mockClient});
        skyflow = Skyflow.init({
          vaultID: '<VaultID>',
          vaultURL: 'https://www.vaulturl.com',
          getBearerToken: ()=>{
            return new Promise((resolve,_)=>{
                resolve("token")
            })
          }
        });
      const res = skyflow.getById(getByIdInput);
      let data;
      res.then((res) => data = res);

      setTimeout(() => {
        expect(data.records.length).toBe(1);
        expect(data.error).toBeUndefined();
        done();
      }, 1000);
    } catch (err) {
    }
  });
  

  test('getById error', (done) => {
   
    try {
      const clientReq = jest.fn(() => Promise.reject(getByIdError));
      const mockClient = {
        config: skyflowConfig,
        request: clientReq,
        metadata:{}
      }
      clientModule.mockImplementation(() => {return mockClient});
        skyflow = Skyflow.init({
          vaultID: '<VaultID>',
          vaultURL: 'https://www.vaulturl.com',
          getBearerToken: ()=>{
            return new Promise((resolve,_)=>{
                resolve("token")
            })
          }
        });
      const res = skyflow.getById(getByIdInput);
      let error;
      res.catch((err) => error = err);

      setTimeout(() => {
        expect(error).toBeDefined();
        done();
      }, 1000);
    } catch (err) {
    }
  });
  test('getById invalid input-1',(done)=>{
    const res = skyflow.getById({});
    res.catch((err)=>{
      expect(err).toBeDefined();
      done();
    });
  });
  test('getById invalid input-2',(done)=>{
    const res = skyflow.getById({"records":[]});
    res.catch((err)=>{
      expect(err).toBeDefined();
      done();
    });
  });
  test('getById invalid input-3',(done)=>{
    const res = skyflow.getById({"records":[{}]});
    res.catch((err)=>{
      expect(err).toBeDefined();
      done();
    });
  });
  test('getById invalid input-4',(done)=>{
    const res = skyflow.getById({"records":[{}]});
    res.catch((err)=>{
      expect(err).toBeDefined();
      done();
    });
  });
  test('getById invalid input-5',(done)=>{
    const res = skyflow.getById(getByIdInputMissingIds);
    res.catch((err)=>{
      expect(err).toBeDefined();
      done();
    });
  });
  test('getById invalid input-6',(done)=>{
    const res = skyflow.getById(getByIdInputInvalidRedaction);
    res.catch((err)=>{
      expect(err).toBeDefined();
      done();
    });
  });
  test('getById invalid input-7',(done)=>{
    const res = skyflow.getById(getByIdInputWithColumnName);
    res.catch((err)=>{
      expect(err.message).toBe(logs.errorLogs.INVALID_GET_BY_ID_INPUT);
      done();
    });
  });
  test('getById invalid input-8',(done)=>{
    const res = skyflow.getById(getByIdInputWithColumnName);
    res.catch((err)=>{
      expect(err.message).toBe(logs.errorLogs.INVALID_GET_BY_ID_INPUT);
      done();
    });
  });
  test('getById invalid input-9',(done)=>{
    const res = skyflow.getById(getByIdInputWithEmptyTable);
    res.catch((err)=>{
      expect(err).toBeDefined();
      done();
    });
  });
  test('getById invalid input-10',(done)=>{
    const res = skyflow.getById(getByIdInputWithMissingTable);
    res.catch((err)=>{
      expect(err).toBeDefined;
      done();
    });
  });
});

describe('skyflow get method', () => {

  let skyflow;
  beforeEach(() => {
    skyflow = Skyflow.init({
      vaultID: '<VaultID>',
      vaultURL: 'https://www.vaulturl.com',
      getBearerToken: jest.fn(),
    });

  });

  test('get method success with valid bearer token', (done) => {
    try {
      jest.mock('../../src/vault-api/utils/jwt-utils',()=>({
        __esModule: true,
        isTokenValid:jest.fn(()=>true),
      }));
      const clientReq = jest.fn(() => Promise.resolve(getByIdRes));
      const mockClient = {
        config: skyflowConfig,
        request: clientReq,
        metadata:{}
      }
      clientModule.mockImplementation(() => {return mockClient});
        skyflow = Skyflow.init({
          vaultID: '<VaultID>',
          vaultURL: 'https://www.vaulturl.com',
          getBearerToken: ()=>{
            return new Promise((resolve,_)=>{
                resolve("token")
            })
          }
        });
      const res = skyflow.get(getByIdInput);
      let data;
      res.then((res) => data = res);

      setTimeout(() => {
        expect(data.records.length).toBe(1);
        expect(data.error).toBeUndefined();
        done();
      }, 1000);
    } catch (err) {
    }
  });
  

  test('get method error', (done) => {
   
    try {
      const clientReq = jest.fn(() => Promise.reject(getByIdError));
      const mockClient = {
        config: skyflowConfig,
        request: clientReq,
        metadata:{}
      }
      clientModule.mockImplementation(() => {return mockClient});
        skyflow = Skyflow.init({
          vaultID: '<VaultID>',
          vaultURL: 'https://www.vaulturl.com',
          getBearerToken: ()=>{
            return new Promise((resolve,_)=>{
                resolve("token")
            })
          }
        });
      const res = skyflow.get(getByIdInput);
      let error;
      res.catch((err) => error = err);

      setTimeout(() => {
        expect(error).toBeDefined();
        done();
      }, 1000);
    } catch (err) {
    }
  });
  test('get method invalid input-1',(done)=>{
    const res = skyflow.get({});
    res.catch((err)=>{
      expect(err).toBeDefined();
      done();
    });
  });
  test('get method invalid input-2',(done)=>{
    const res = skyflow.get({"records":[]});
    res.catch((err)=>{
      expect(err).toBeDefined();
      done();
    });
  });
  test('get method invalid input-3',(done)=>{
    const res = skyflow.get({"records":[{}]});
    res.catch((err)=>{
      expect(err).toBeDefined();
      done();
    });
  });
  test('get method invalid input-4',(done)=>{
    const res = skyflow.get({"records":[{}]});
    res.catch((err)=>{
      expect(err).toBeDefined();
      done();
    });
  });
  test('get method invalid input-5',(done)=>{
    const res = skyflow.get(getByIdInputMissingIds);
    res.catch((err)=>{
      expect(err).toBeDefined();
      done();
    });
  });
  test('get method invalid input-6',(done)=>{
    const res = skyflow.get(getByIdInputInvalidRedaction);
    res.catch((err)=>{
      expect(err).toBeDefined();
      done();
    });
  });
  test("get method invalid input-7", () => {
    const res = skyflow.get(getByIdInputMissingColumnName);
    res.catch((err) => {
      expect(err.message).toBe(logs.errorLogs.MISSING_RECORD_COLUMN_NAME);
    });
  });    
  test("get method invalid input-8", () => {
    const res = skyflow.get(getByIdInputMissingColumnValues);
    res.catch((err) => {
      expect(err.message).toBe(logs.errorLogs.MISSING_RECORD_COLUMN_VALUE);
    });
  });   
  test("get method invalid input-9", () => {
    const res = skyflow.get(getByIdInputInvalidColumnNameType);
    res.catch((err) => {
      expect(err.message).toBe(logs.errorLogs.INVALID_RECORD_COLUMN_VALUE);
    });
  }); 
  test("get method invalid input-10", () => {
    const res = skyflow.get(getByIdInputInvalidColumnValuesType);
    res.catch((err) => {
      expect(err.message).toBe(logs.errorLogs.INVALID_COLUMN_VALUES_OPTION_TYPE);
    });
  }); 
  test("get method invalid input-11", () => {
    const res = skyflow.get(getByIdInputEmptyColumnValues);
    res.catch((err) => {
      expect(err.message).toBe(logs.errorLogs.EMPTY_RECORD_COLUMN_VALUES);
    });
  }); 
  test("get method invalid input-12", () => {
    const res = skyflow.get(getByIdInputInvalidOptionsColumnValues);
    res.catch((err) => {
      expect(err.message).toBe(logs.errorLogs.INVALID_RECORD_COLUMN_VALUE_TYPE);
    });
  }); 
  test("get method invalid input-13", () => {
    const res = skyflow.get(getByIdInputEmptydOptionsColumnValues);
    res.catch((err) => {
      expect(err.message).toBe(logs.errorLogs.EMPTY_COLUMN_VALUE);
    });
  }); 
  test("get method invalid input-14", () => {
    const res = skyflow.get(getWithNoSkyflowIDAndColumnName);
    res.catch((err) => {
      expect(err.message).toBe(logs.errorLogs.MISSING_ID_AND_COLUMN_NAME);
    });
  }); 
  test("get method with valid column name and column values input", () => {
    const res = skyflow.get(getByIdWithValidUniqColumnOptions);
    res.catch((err) => {
      expect(err.message).toBe(undefined)
    });
  }); 
});

const invokeConnectionReq = {
  connectionURL: 'https://connectionurl.com',
  methodName: 'POST',
  pathParams: {
    cardNumber: '4111111111111111',
  },
  queryParams: {
    expiryDate: '12/2024',
  },
  responseBody: {
    resource: {
      cvv: 'cvvId:123',
    },
  },
};

const missingconnectionURL = {
  connectionURL: 1234,
  methodName: 'POST',
  pathParams: {
    cardNumber: '4111111111111111',
  },
  queryParams: {
    expiryDate: '12/2024',
  },
  responseBody: {
    resource: {
      cvv: 'cvvId:123',
    },
  },
};

const invalidconnectionURL = {
  methodName: 'POST',
  pathParams: {
    cardNumber: '4111111111111111',
  },
  queryParams: {
    expiryDate: '12/2024',
  },
  responseBody: {
    resource: {
      cvv: 'cvvId:123',
    },
  },
};

const missingMethod = {
  connectionURL: 'https://connectionurl.com',
  pathParams: {
    cardNumber: '4111111111111111',
  },
  queryParams: {
    expiryDate: '12/2024',
  },
  responseBody: {
    resource: {
      cvv: 'cvvId:123',
    },
  },
};

const invalidMEthod = {
  connectionURL: 'https://connectionurl.com',
  methodName: 'ppp',
  pathParams: {
    cardNumber: '4111111111111111',
  },
  queryParams: {
    expiryDate: '12/2024',
  },
  responseBody: {
    resource: {
      cvv: 'cvvId:123',
    },
  },
};

const invokeConnectionRes = {
  receivedTimestamp: '2019-05-29 21:49:56.625',
  processingTimeinMs: 116,
};

describe('skyflow invoke connection', () => {
  let skyflow;
  beforeEach(() => {

    skyflow = Skyflow.init({
      vaultID: '<VaultId>',
      vaultURL: 'https://www.vaulturl.com',
      getBearerToken: jest.fn(),
    });
  });

  test('invoke connection success with valid bearer token', (done) => {
    try {
      jest.mock('../../src/vault-api/utils/jwt-utils',()=>({
        __esModule: true,
        isTokenValid:jest.fn(()=>true),
      }));
      const clientReq = jest.fn(() => Promise.resolve(invokeConnectionRes));
      const mockClient = {
        config: skyflowConfig,
        request: clientReq,
        metadata:{}
      }
      clientModule.mockImplementation(() => {return mockClient});
      skyflow = Skyflow.init({
          vaultID: '<VaultID>',
          vaultURL: 'https://www.vaulturl.com',
          getBearerToken: ()=>{
            return new Promise((resolve,_)=>{
                resolve("token")
            })
          }
        });
      const res = skyflow.invokeConnection(invokeConnectionReq);
      
      let data;
      res.then((res) => data = res);

      setTimeout(() => {
        expect(data).toBeDefined();
        expect(!('resource' in data)).toBeTruthy();
        expect(data.error).toBeUndefined();
        done();
      }, 1000);
    } catch (err) {
      console.log(err)
    }
  });
  
  test('invoke connection invalidInput -1 ',(done)=>{
    try {
      const res = skyflow.invokeConnection({connectionURL:"invalid_url"});
      res.catch((err)=>{
        expect(err).toBeDefined();
        done();
      })
    }catch(err){
  
    }
  });
  test('invoke connection invalidInput -2 ',(done)=>{
  try {
    const res = skyflow.invokeConnection({connectionURL:"invalid_url"});
    res.catch((err)=>{
      expect(err).toBeDefined();
      done();
    })
  }catch(err){

  }
  });

  test('invoke connection invalidInput -3 ',(done)=>{
    try {
      const res = skyflow.invokeConnection(invalidconnectionURL);
      res.catch((err)=>{
        expect(err).toBeDefined();
        done();
      })
    }catch(err){
  
    }
    });
    test('invoke connection invalidInput -4 ',(done)=>{
      try {
        const res = skyflow.invokeConnection(missingconnectionURL);
        res.catch((err)=>{
          expect(err).toBeDefined();
          done();
        })
      }catch(err){
    
      }
      });
      test('invoke connection invalidInput -5 ',(done)=>{
        try {
          const res = skyflow.invokeConnection(missingMethod);
          res.catch((err)=>{
            expect(err).toBeDefined();
            done();
          })
        }catch(err){
      
        }
        });
        test('invoke connection invalidInput -6 ',(done)=>{
          try {
            const res = skyflow.invokeConnection(invalidMEthod);
            res.catch((err)=>{
              expect(err).toBeDefined();
              done();
            })
          }catch(err){
        
          }
          });

});

describe("Skyflow Enums",()=>{
 

  test("Skyflow.RedactionType",()=>{
      expect(Skyflow.RedactionType.DEFAULT).toEqual(RedactionType.DEFAULT);
      expect(Skyflow.RedactionType.MASKED).toEqual(RedactionType.MASKED);
      expect(Skyflow.RedactionType.PLAIN_TEXT).toEqual(RedactionType.PLAIN_TEXT);
      expect(Skyflow.RedactionType.REDACTED).toEqual(RedactionType.REDACTED);
  });

  test("Skyflow.RequestMethod",()=>{
    expect(Skyflow.RequestMethod.GET).toEqual(RequestMethod.GET);
    expect(Skyflow.RequestMethod.POST).toEqual(RequestMethod.POST);
    expect(Skyflow.RequestMethod.PUT).toEqual(RequestMethod.PUT);
    expect(Skyflow.RequestMethod.DELETE).toEqual(RequestMethod.DELETE);
    expect(Skyflow.RequestMethod.PATCH).toEqual(RequestMethod.PATCH);
  });

  test("isvalid url true",()=>{
      expect(isValidURL("https://www.google.com")).toBe(true);
  })


  test("invalid url true",()=>{
    expect(isValidURL("httpsww.google.com")).toBe(false);

  })

});

const updateInput = {
  records : [
    {
      id: "test_update_id",
      table:"table1",
      fields:{
        "column":'update_value'
      }
    },
  ]
};
const partialSuccessInput =  {
  records:[
    ...updateInput.records,
  {
    id: "invalid_update_id",
    table:"table1",
    fields:{
      "column":'update_value'
    }
  }
]
}
const successUpdateRequestResponse = {
  "skyflow_id":'test_update_id',
  "tokens": {
    "column":"test_token"
  }
};

const successUpdateRequestWithoutTokensResponse = {
  "skyflow_id":'test_update_id',
};
const errorUpdateRequestResponse = {
  error:{
    code : '404',
    description : "Token Not Found."
  }
};
const updateResponse = {
  "records":[
    {
      id: "test_update_id",
      "fields": {
        "column":"test_token"
      }
    }
  ]
}
const updateResponseWithoutTokens = {
  "records":[
    {
      id: "test_update_id"
    }
  ]
}

const updateFailure = {
  "errors":[
    {
      id : 'test_update_id',
      ...errorUpdateRequestResponse
    }
  ]
}

const partialUpdateFailure = {
  "errors":[
    {
      id : 'invalid_update_id',
      ...errorUpdateRequestResponse
    }
  ]
}
describe("Update method",()=>{

  test("test update success case",(done)=>{
    try{
    jest.mock('../../src/vault-api/utils/jwt-utils',()=>({
      __esModule: true,
      isTokenValid:jest.fn(()=>true),
    }));
    const clientReq = jest.fn(() => Promise.resolve(successUpdateRequestResponse));
    const mockClient = {
      config: skyflowConfig,
      request: clientReq,
      metadata:{}
    }
    clientModule.mockImplementation(() => {return mockClient});
      const skyflow = Skyflow.init({
        vaultID: '<VaultID>',
        vaultURL: 'https://www.vaulturl.com',
        getBearerToken: ()=>{
          return new Promise((resolve,_)=>{
              resolve("token")
          })
        }
      });
    const result = skyflow.update(updateInput);
    result.then((response)=>{
      expect(response).toEqual(updateResponse);
      done();
    }).catch((err)=>{
        done(err);
    });
  } catch (err) {
    done(err);
  }
  });
  test("test update success case with tokens false",(done)=>{
    try{
    jest.mock('../../src/vault-api/utils/jwt-utils',()=>({
      __esModule: true,
      isTokenValid:jest.fn(()=>true),
    }));
    const clientReq = jest.fn(() => Promise.resolve(successUpdateRequestWithoutTokensResponse));
    const mockClient = {
      config: skyflowConfig,
      request: clientReq,
      metadata:{}
    }
    clientModule.mockImplementation(() => {return mockClient});
      const skyflow = Skyflow.init({
        vaultID: '<VaultID>',
        vaultURL: 'https://www.vaulturl.com',
        getBearerToken: ()=>{
          return new Promise((resolve,_)=>{
              resolve("token")
          })
        }
      });
    const result = skyflow.update(updateInput);
    result.then((response)=>{
      expect(response).toEqual(updateResponseWithoutTokens);
      done();
    }).catch((err)=>{
        done(err);
    });
  } catch (err) {
    done(err);
  }
  });

  test("test update partial success case",(done)=>{
    try{
    jest.mock('../../src/vault-api/utils/jwt-utils',()=>({
      __esModule: true,
      isTokenValid:jest.fn(()=>true),
    }));
    const clientReq = jest.fn().mockImplementation((args) => {
      const check = args.url.includes('test_update_id')
      if(check)
        return Promise.resolve(successUpdateRequestResponse);
      else  
        return Promise.reject(errorUpdateRequestResponse);
    });
    const mockClient = {
      config: skyflowConfig,
      request: clientReq,
      metadata:{}
    }
    clientModule.mockImplementation(() => {return mockClient});
      const skyflow = Skyflow.init({
        vaultID: '<VaultID>',
        vaultURL: 'https://www.vaulturl.com',
        getBearerToken: ()=>{
          return new Promise((resolve,_)=>{
              resolve("token")
          })
        }
      });
    const result = skyflow.update(partialSuccessInput);
    result.then((response)=>{
      done(response);
    }).catch((error)=>{
      expect(error).toEqual({...updateResponse,...partialUpdateFailure});
      done();
    });
  } catch (err) {
    done(err);
  }
  });
  
  test("test update error case",(done)=>{
    try{
      jest.mock('../../src/vault-api/utils/jwt-utils',()=>({
        __esModule: true,
        isTokenValid:jest.fn(()=>true),
      }));
      const clientReq = jest.fn(() => Promise.reject(errorUpdateRequestResponse));
      const mockClient = {
        config: skyflowConfig,
        request: clientReq,
        metadata:{}
      }
      clientModule.mockImplementation(() => {return mockClient});
        const skyflow = Skyflow.init({
          vaultID: '<VaultID>',
          vaultURL: 'https://www.vaulturl.com',
          getBearerToken: ()=>{
            return new Promise((resolve,_)=>{
                resolve("token")
            })
          }
        });
      const result = skyflow.update(updateInput,{tokens:true});
      result.then((response)=>{
        done(response);
      }).catch((err)=>{
        expect(err).toEqual(updateFailure);
          done();
      });
    } catch (err) {
      done(err);
    }
  });

  test('test invalid option tokens type',(done)=>{
    const clientReq = jest.fn(() => Promise.reject(errorUpdateRequestResponse));
    const mockClient = {
      config: skyflowConfig,
      request: clientReq,
      metadata:{}
    }
    clientModule.mockImplementation(() => {return mockClient});
    const skyflow = Skyflow.init({
      vaultID: '<VaultID>',
      vaultURL: 'https://www.vaulturl.com',
      getBearerToken: ()=>{
        return new Promise((resolve,_)=>{
            resolve("token")
        })
      }
    });
  const result = skyflow.update(updateInput,{tokens:{}});
  result.then((response)=>{
    done(response);
  }).catch((err)=>{
    expect(err.errors[0].description).toEqual(SKYFLOW_ERROR_CODE.INVALID_TOKENS_IN_UPDATE.description);
    done();
  });
  });

});

describe('skyflow detokenize with redaction', () => {

  let skyflow;
  beforeEach(() => {
    skyflow = Skyflow.init({
      vaultID: '<VaultID>',
      vaultURL: 'https://www.vaulturl.com',
      getBearerToken: jest.fn(),
    });
  });

  test('request body should contains plain text redaction when passed plain text', (done) => {
    let reqArg;
    const clientReq = jest.fn((arg) => {
      reqArg = arg;
      return Promise.resolve(detokenizeRes)
    });

    const mockClient = {
      config: skyflowConfig,
      request: clientReq,
      metadata: {}
    }

    clientModule.mockImplementation(() => { return mockClient });
    skyflow = Skyflow.init({
      vaultID: '<VaultID>',
      vaultURL: 'https://www.vaulturl.com',
      getBearerToken: () => {
        return new Promise((resolve, _) => {
          resolve("token")
        })
      }
    });

    const response = skyflow.detokenize({
      records: [
        {
          token: '123',
          redaction: RedactionType.PLAIN_TEXT
        }
      ]
    });

    response.then(() => {
      console.log(reqArg.body);
      const tokenRecords = reqArg.body.detokenizationParameters
      tokenRecords.forEach((record) => {
        expect(record.token).toBe('123');
        expect(record.redaction).toBe('PLAIN_TEXT');
      })
      done();
    }).catch((err) => {
      done(err);
    })


  });

  test('request body should contains redacted redaction when passed redacted', (done) => {
    let reqArg;
    const clientReq = jest.fn((arg) => {
      reqArg = arg;
      return Promise.resolve(detokenizeRes)
    });

    const mockClient = {
      config: skyflowConfig,
      request: clientReq,
      metadata: {}
    }

    clientModule.mockImplementation(() => { return mockClient });
    skyflow = Skyflow.init({
      vaultID: '<VaultID>',
      vaultURL: 'https://www.vaulturl.com',
      getBearerToken: () => {
        return new Promise((resolve, _) => {
          resolve("token")
        })
      }
    });

    const response = skyflow.detokenize({
      records: [
        {
          token: '123',
          redaction: RedactionType.REDACTED
        }
      ]
    });

    response.then(() => {
      console.log(reqArg.body);
      const tokenRecords = reqArg.body.detokenizationParameters
      tokenRecords.forEach((record) => {
        expect(record.token).toBe('123');
        expect(record.redaction).toBe('REDACTED');
      })
      done();
    }).catch((err) => {
      done(err);
    })


  });

  test('request body should contains masked redaction when passed masked', (done) => {
    let reqArg;
    const clientReq = jest.fn((arg) => {
      reqArg = arg;
      return Promise.resolve(detokenizeRes)
    });

    const mockClient = {
      config: skyflowConfig,
      request: clientReq,
      metadata: {}
    }

    clientModule.mockImplementation(() => { return mockClient });
    skyflow = Skyflow.init({
      vaultID: '<VaultID>',
      vaultURL: 'https://www.vaulturl.com',
      getBearerToken: () => {
        return new Promise((resolve, _) => {
          resolve("token")
        })
      }
    });

    const response = skyflow.detokenize({
      records: [
        {
          token: '123',
          redaction: RedactionType.MASKED
        }
      ]
    });

    response.then(() => {
      console.log(reqArg.body);
      const tokenRecords = reqArg.body.detokenizationParameters
      tokenRecords.forEach((record) => {
        expect(record.token).toBe('123');
        expect(record.redaction).toBe('MASKED');
      })
      done();
    }).catch((err) => {
      done(err);
    })


  });

  test('request body should contains default redaction when passed default', (done) => {
    let reqArg;
    const clientReq = jest.fn((arg) => {
      reqArg = arg;
      return Promise.resolve(detokenizeRes)
    });

    const mockClient = {
      config: skyflowConfig,
      request: clientReq,
      metadata: {}
    }

    clientModule.mockImplementation(() => { return mockClient });
    skyflow = Skyflow.init({
      vaultID: '<VaultID>',
      vaultURL: 'https://www.vaulturl.com',
      getBearerToken: () => {
        return new Promise((resolve, _) => {
          resolve("token")
        })
      }
    });

    const response = skyflow.detokenize({
      records: [
        {
          token: '123',
          redaction: RedactionType.DEFAULT
        }
      ]
    });

    response.then(() => {
      console.log(reqArg.body);
      const tokenRecords = reqArg.body.detokenizationParameters
      tokenRecords.forEach((record) => {
        expect(record.token).toBe('123');
        expect(record.redaction).toBe('DEFAULT');
      })
      done();
    }).catch((err) => {
      done(err);
    })


  });

  test('request body should contains plain text redaction when not passed.', (done) => {
    let reqArg;
    const clientReq = jest.fn((arg) => {
      reqArg = arg;
      return Promise.resolve(detokenizeRes)
    });

    const mockClient = {
      config: skyflowConfig,
      request: clientReq,
      metadata: {}
    }

    clientModule.mockImplementation(() => { return mockClient });
    skyflow = Skyflow.init({
      vaultID: '<VaultID>',
      vaultURL: 'https://www.vaulturl.com',
      getBearerToken: () => {
        return new Promise((resolve, _) => {
          resolve("token")
        })
      }
    });

    const response = skyflow.detokenize({
      records: [
        {
          token: '123',
        }
      ]
    });

    response.then(() => {
      console.log(reqArg.body);
      const tokenRecords = reqArg.body.detokenizationParameters
      tokenRecords.forEach((record) => {
        expect(record.token).toBe('123');
        expect(record.redaction).toBe('PLAIN_TEXT');
      })
      done();
    }).catch((err) => {
      done(err);
    })


  });

  test('detokenize should throw error when invalid null redaction value is passed.', (done) => {
    const response = skyflow.detokenize({
      records: [
        {
          token: '123',
          redaction: null
        }
      ]
    });

    response.then((res) => {
      done('should throw error');
    }).catch((err) => {
      expect(err.errors[0].description).toBe(SKYFLOW_ERROR_CODE.DETOKENIZE_INVALID_REDACTION_TYPE.description);
      done();
    })

  });

  test('detokenize should throw error when invalid undefined redaction value is passed.', (done) => {
    const response = skyflow.detokenize({
      records: [
        {
          token: '123',
          redaction: undefined
        }
      ]
    });

    response.then((res) => {
      done('should throw error');
    }).catch((err) => {
      expect(err.errors[0].description).toBe(SKYFLOW_ERROR_CODE.DETOKENIZE_INVALID_REDACTION_TYPE.description);
      done();
    })

  });

  test('detokenize should throw error when invalid type redaction value is passed.', (done) => {
    const response = skyflow.detokenize({
      records: [
        {
          token: '123',
          redaction: ''
        }
      ]
    });

    response.then((res) => {
      done('should throw error');
    }).catch((err) => {
      expect(err.errors[0].description).toBe(SKYFLOW_ERROR_CODE.DETOKENIZE_INVALID_REDACTION_TYPE.description);
      done();
    })

  });
});

describe('get method with options', () => {
  let skyflow;
  beforeEach(() => {
    skyflow = Skyflow.init({
      vaultID: '<VaultID>',
      vaultURL: 'https://www.vaulturl.com',
      getBearerToken: jest.fn(),
    });
  });


  test('get method should send request url with tokenization true when tokens are true', (done) => {

    let reqArg;
    const clientReq = jest.fn((arg) => {
      reqArg = arg;
      return Promise.resolve(getByIdRes)
    });

    const mockClient = {
      config: skyflowConfig,
      request: clientReq,
      metadata: {}
    }

    clientModule.mockImplementation(() => { return mockClient });
    skyflow = Skyflow.init({
      vaultID: '<VaultID>',
      vaultURL: 'https://www.vaulturl.com',
      getBearerToken: () => {
        return new Promise((resolve, _) => {
          resolve("token")
        })
      }
    });

    const response = skyflow.get(getByIdInputWithoutRedaction, { tokens: true });
    response.then((res) => {
      expect((reqArg.url).includes('tokenization=true')).toBe(true);
      done();
    }).catch((er) => {
      done(er)
    });


  });


  test('get method should send request url with tokenization false and redaction when tokens are false', (done) => {

    let reqArg;
    const clientReq = jest.fn((arg) => {
      reqArg = arg;
      return Promise.resolve(getByIdRes)
    });

    const mockClient = {
      config: skyflowConfig,
      request: clientReq,
      metadata: {}
    }

    clientModule.mockImplementation(() => { return mockClient });
    skyflow = Skyflow.init({
      vaultID: '<VaultID>',
      vaultURL: 'https://www.vaulturl.com',
      getBearerToken: () => {
        return new Promise((resolve, _) => {
          resolve("token")
        })
      }
    });

    const response = skyflow.get(getByIdInput, { tokens: false });
    response.then((res) => {
      expect((reqArg.url).includes('tokenization=false')).toBe(true);
      expect((reqArg.url).includes('redaction=PLAIN_TEXT')).toBe(true);
      done();
    }).catch((er) => {
      done(er)
    });


  });

  test('get method should not send redaction along with url if redaction is not passed.', (done) => {

    let reqArg;
    const clientReq = jest.fn((arg) => {
      reqArg = arg;
      return Promise.resolve(getByIdRes)
    });

    const mockClient = {
      config: skyflowConfig,
      request: clientReq,
      metadata: {}
    }

    clientModule.mockImplementation(() => { return mockClient });
    skyflow = Skyflow.init({
      vaultID: '<VaultID>',
      vaultURL: 'https://www.vaulturl.com',
      getBearerToken: () => {
        return new Promise((resolve, _) => {
          resolve("token")
        })
      }
    });

    const response = skyflow.get(getByIdInputWithoutRedaction, { tokens: true });
    response.then((res) => {
      console.log(reqArg.url);
      expect((reqArg.url).includes('redaction=PLAIN_TEXT')).toBe(false);
      done();
    }).catch((er) => {
      done(er)
    });


  });

  test('get method should throw error when tokens options is invalid type value', (done) => {

    skyflow.get(getByIdInput, { tokens: '12343' }).then((res) => {
      done('Should throw error.')
    }).catch((err) => {
      expect(err.errors[0].description).toEqual(SKYFLOW_ERROR_CODE.INVALID_TOKENS_IN_GET.description);
      done();
    })
  });

  test('get method should throw error when tokens options is invalid type value', (done) => {

    skyflow.get(getByIdInput, { tokens: "true" }).then((res) => {
      done('Should throw error.')
    }).catch((err) => {
      expect(err.errors[0].description).toEqual(SKYFLOW_ERROR_CODE.INVALID_TOKENS_IN_GET.description);
      done();
    })
  });

  test('get method should throw error when tokens options is null', (done) => {
    skyflow.get(getByIdInput, { tokens: null }).then((res) => {
      done('Should throw error.')
    }).catch((err) => {
      expect(err.errors[0].description).toEqual(SKYFLOW_ERROR_CODE.INVALID_TOKENS_IN_GET.description);
      done();
    })
  });

  test('get method should throw error when tokens options is undefined', (done) => {
    skyflow.get(getByIdInput, { tokens: undefined }).then((res) => {
      done('Should throw error.')
    }).catch((err) => {
      expect(err.errors[0].description).toEqual(SKYFLOW_ERROR_CODE.INVALID_TOKENS_IN_GET.description);
      done();
    })
  });

  test('get method should throw error when tokens options along with column values', (done) => {
    skyflow.get(getByIdWithValidUniqColumnOptions, { tokens: true }).then((res) => {
      done('Should throw error.')
    }).catch((err) => {
      expect(err.errors[0].description).toEqual(SKYFLOW_ERROR_CODE.TOKENS_GET_COLUMN_NOT_SUPPORTED.description);
      done();
    })
  });

  test('get method should throw error when tokens options used along with redaction', (done) => {
    skyflow.get(getByIdInput, { tokens: true }).then((res) => {
      done('Should throw error.')
    }).catch((err) => {
      expect(err.errors[0].description).toEqual(SKYFLOW_ERROR_CODE.REDACTION_WITH_TOKENS_NOT_SUPPORTED.description);
      done();
    })
  });

  test('get method should encode column values when encodeURI option is true', (done) => {
    let reqArg;
    const clientReq = jest.fn((arg) => {
      reqArg = arg;
      return Promise.resolve(getByIdRes);
    });

    const mockClient = {
      config: skyflowConfig,
      request: clientReq,
      metadata: {},
    };

    clientModule.mockImplementation(() => { return mockClient });
    skyflow = Skyflow.init({
      vaultID: '<VaultID>',
      vaultURL: 'https://www.vaulturl.com',
      getBearerToken: () => {
        return new Promise((resolve, _) => {
          resolve("token")
        })
      }
    });

    const response = skyflow.get(getByIdWithValidUniqColumnOptions, { encodeURI: true });
    response.then((res) => {
      expect((reqArg.url).includes('tokenization=false')).toBe(false);
      done();
    }).catch((er) => {
      done(er)
    });
  });

  test('get method should throw error when encodeURI options is invalid type value', (done) => {

    skyflow.get(getByIdWithValidUniqColumnOptions, { encodeURI: '12343' }).then((res) => {
      done('Should throw error.')
    }).catch((err) => {
      expect(err.errors[0].description).toEqual(SKYFLOW_ERROR_CODE.INVALID_ENCODE_URI_IN_GET.description);
      done();
    })
  });

  test('get method should throw error when encodeURI options is null', (done) => {
    skyflow.get(getByIdWithValidUniqColumnOptions, { encodeURI: null }).then((res) => {
      done('Should throw error.')
    }).catch((err) => {
      expect(err.errors[0].description).toEqual(SKYFLOW_ERROR_CODE.INVALID_ENCODE_URI_IN_GET.description);
      done();
    })
  });

  test('get method should throw error when encodeURI options is undefined', (done) => {
    skyflow.get(getByIdWithValidUniqColumnOptions, { encodeURI: undefined }).then((res) => {
      done('Should throw error.')
    }).catch((err) => {
      expect(err.errors[0].description).toEqual(SKYFLOW_ERROR_CODE.INVALID_ENCODE_URI_IN_GET.description);
      done();
    })
  });

});