import Skyflow from '../../src/vault-api/Skyflow';
import { LogLevel, RedactionType, RequestMethod } from '../../src/vault-api/utils/common';
import { isValidURL} from '../../src/vault-api/utils/validators';
import clientModule from '../../src/vault-api/client';
import { setLogLevel } from '../../src/vault-api/Logging';
jest.mock('../../src/vault-api/utils/jwtUtils',()=>({
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
    }],
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
    jest.mock('../../src/vault-api/utils/jwtUtils',()=>({
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
              console.log("xxxx")
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

      jest.mock('../../src/vault-api/utils/jwtUtils',()=>({
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
      jest.mock('../../src/vault-api/utils/jwtUtils',()=>({
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
      jest.mock('../../src/vault-api/utils/jwtUtils',()=>({
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
