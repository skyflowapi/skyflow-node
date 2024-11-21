
# Skyflow Node.js SDK

SDK for the Skyflow Data Privacy Vault.

[![CI](https://img.shields.io/static/v1?label=CI&message=passing&color=green?style=plastic&logo=github)](https://github.com/skyflowapi/skyflow-node/actions)
[![GitHub release](https://badge.fury.io/js/skyflow-node.svg)](https://www.npmjs.com/package/skyflow-node)
[![License](https://img.shields.io/github/license/skyflowapi/skyflow-node)](https://github.com/skyflowapi/skyflow-node/blob/main/LICENSE)


## Table of contents

- [Skyflow Node.js SDK](#skyflow-nodejs-sdk)
  - [Table of contents](#table-of-contents)
  - [Installation](#installation)
      - [Requirements](#requirements)
      - [Import / Require](#import--require)
        - [Require](#require)
        - [All imports](#all-imports)
  - [Vault APIs](#vault-apis)
    - [Insert: vault().insert()](#insert-vaultinsert)
      - [Example: Insert Records](#example-insert-records)
      - [Example: Upsert Records (update or insert)](#example-upsert-records-update-or-insert)
      - [Example: Insert with partial success support](#example-insert-with-partial-success-support)
    - [Detokenize: vault.detokenize()](#detokenize-vaultdetokenize)
      - [Detokenize example](#detokenize-example)
    - [Get records by unique values: vault.get()](#get-records-by-unique-values-vaultget)
      - [Example: Get records by ID(s)](#example-get-records-by-ids)
      - [Example: Get records by unique column values](#example-get-records-by-unique-column-values)
    - [Update records by ID](#update-records-by-id)
      - [Example: Update records by ID](#example-update-records-by-id)
    - [Delete](#delete)
    - [Invoke Connection](#invoke-connection)
      - [Example: Invoke Connection](#example-invoke-connection)
  - [Authentication and Authorization](#authentication-and-authorization)
    - [Service Account Bearer Token Generation](#service-account-bearer-token-generation)
      - [Example using service account credentials in code](#example-using-service-account-credentials-in-code)
      - [Service Account Bearer Token Generation with Additional Context](#service-account-bearer-token-generation-with-additional-context)
      - [Service Account Scoped Bearer Token Generation](#service-account-scoped-bearer-token-generation)
      - [Skyflow Signed Data Tokens Generation](#skyflow-signed-data-tokens-generation)
    - [Logging](#logging)
  - [Reporting a vulnerability](#reporting-a-vulnerability)
  
## Installation

#### Requirements

- Node 12.22.12 and above

```sh
npm install skyflow-node
```

#### Import / Require

Depending on your project setup, you may use either the `require` method (common in Node.js projects) or the `import` statement (common in projects using ES modules).

##### Require

```javascript
const { Skyflow } = require('skyflow-node');
```

**ES modules**

```javascript
import { Skyflow }  from 'skyflow-node';
```

##### All imports

```javascript
import {
  Skyflow,     // Vault client
  isExpired,   // JWT auth helpers
  LogLevel,    // logging options
} from 'skyflow-node'
```


## Vault APIs
The [Vault](https://github.com/skyflowapi/skyflow-node/tree/main/src/vault-api) Node.js module is used to perform operations on the vault such as inserting records, detokenizing tokens, retrieving tokens for list of `skyflow_id`'s and to invoke the Connection.

To use this module, the Skyflow client must first be initialized as follows: 

```javascript
import { Skyflow } from 'skyflow-node';

// Initialize the Skyflow Vault client
const client : Skyflow = Skyflow({
  vaultConfigs: [
    {
      // Id of the vault that the client should connect to.
      vaultId: 'string',
      // Id of the cluster that the client should connect to.
      clusterId: 'string',
      // environment to which the vault ID belongs
      env: Env.PROD,
      // vault level credentials
      credentials: {
        roles: ['string', 'string'], // optional, IDs for roles
        context: 'string', // optional, Id of the context 
        credentialsString: 'string', // credentials JSON as a stringified version
      },
    }
  ],
   connectionConfigs: [
     {
       // Id of the connection that the client should connect to.
       connectionId: 'string',
       // URL of the connection that the client should connect to.
       connectionUrl: 'string',
       // connection level credentials
       credentials: {
        apiKey: 'string',  // API key
       },
     },
   ],
   // environment to which the vault ID belongs
   skyflowCredentials: {
        path: 'string', // optional, path to credentials json file
   },
   // optional, if not specified default is ERROR
   logLevel: LogLevel.ERROR, 
});
```

Pass the `SKYFLOW_CREDENTIALS` parameter as an environment variable. This variable will be used when the SDK needs to insert or retrieve data from the vault. 

All Vault APIs must be invoked using a vault client instance.

### Insert: vault().insert()

To insert data into your vault, use the `insert(request, options?)` method. 

```js
vault('VAULT_ID').insert(request, options?);
```

- **Request:** The first parameter request is an object of insert request that must have a table name key and takes an array of rows to be inserted into the vault as a value. 
- **Options:** The second parameter options is an optional class object that provides further options for your insert call, more details below.

#### Example: Insert Records

An [example](https://github.com/skyflowapi/skyflow-node/blob/release/24.10.1/samples/vault-api/insert-records.ts) of a simple insert call is given below:

```javascript
// rows to be inserted
const insertData: Array<Object> = [
  { card_number: '4111111111111111', card_cvv: '1234' },
];

// table name
const tableName: string = 'TABLE_NAME';

//creating insert request
const insertReq: InsertRequest = new InsertRequest(
    tableName,
    insertData,
);

const insertOptions: InsertOptions = new InsertOptions();
//use setters for setting options
// return tokens instead of real values
insertOptions.setReturnTokens(true);

skyflowClient.vault('VAULT_ID').insert(
    insertReq,
    insertOptions
).then((resp: InsertResponse) => {
    console.log(resp);
}).catch((err: SkyflowError) => {
    console.log(JSON.stringify(err));
});
```

**Sample response:**

```json
{
  "insertedFields": [
    {
      "card_number": "f37186-e7e2-466f-91e5-48e2bcbc1",
      "card_cvv": "1989cb56-63a-4482-adf-1f74cd1a5",
    },
  ],
  "errors": [],
}
```

#### Example: Upsert Records (update or insert)

Insert call [example](https://github.com/skyflowapi/skyflow-node/blob/release/24.10.1/samples/vault-api/upsert.ts) with upsert support:

```javascript
// rows to be inserted
const insertData: Array<Object> = [
  { card_number: '4111111111111111', card_cvv: '1234' },
];

// table name
const tableName: string = 'TABLE_NAME';

//creating insert request
const insertReq: InsertRequest = new InsertRequest(
    tableName,
    insertData,
);

const insertOptions: InsertOptions = new InsertOptions();
//use setters for setting options
// return tokens instead of real values
insertOptions.setReturnTokens(true);
// To conditionally insert OR update based on a field
// Name of the column in the vault. Must be defined as `unique`.
insertOptions.setUpsertColumn('card_number');

skyflowClient.vault('VAULT_ID').insert(
    insertReq,
    insertOptions
).then((resp: InsertResponse) => {
    console.log(resp);
}).catch((err: SkyflowError) => {
    console.log(JSON.stringify(err));
});
```

Samples Response:
```json
{
  "insertedFields": [
    {
      "skyflowId": "16419435-aa63-4823-aae7-19c6a2d6a19f",
      "card_number": "f3907186-e7e2-466f-91e5-48e12c2bcbc1",
      "card_cvv": "1989cb56-63da-4482-a2df-1f74cd0dd1a5",
    },
  ],
  "errors" : [],
}
```

#### Example: Insert with partial success support

Insert with partial success support

Insert call [example](https://github.com/skyflowapi/skyflow-node/blob/release/24.10.1/samples/vault-api/insert-continue-on-error.ts) with contiueOnError support:

```javascript
// rows to be inserted
const insertData: Array<Object> = [
  { card_number: '4111111111111111', card_cvv: '1234' },
  { card_umber: '4111111111111111', card_cvv: '1234' },
];

// table name
const tableName: string = 'TABLE_NAME';

//creating insert request
const insertReq: InsertRequest = new InsertRequest(
    tableName,
    insertData,
);

const insertOptions: InsertOptions = new InsertOptions();
//use setters for setting options
// return tokens instead of real values
insertOptions.setReturnTokens(true);
// if continue on error is set true we will return requestIndex for errors
insertOptions.setContinueOnError(true);

skyflowClient.vault('VAULT_ID').insert(
    insertReq,
    insertOptions
).then((resp: InsertResponse) => {
    console.log(resp);
}).catch((err: SkyflowError) => {
    console.log(JSON.stringify(err));
});
```

**Sample Response:**

```json
{
  "insertedFields": [
    {
      "skyflowId": "16419435-aa63-4823-aae7-19c6a2d6a19f",
      "card_number": "f3907186-e7e2-466f-91e5-48e12c2bcbc1",
      "card_cvv": "1989cb56-63da-4482-a2df-1f74cd0dd1a5",
      "request_index": 0,
    }
  ],
  "errors": [
    {
      "code":400,
      "description":"Invalid field present in JSON card_umber.",
      "request_index": 1,
    }
  ]
}
```

### Detokenize: vault().detokenize()

Returns values for provided tokens.

In order to retrieve data from your vault using tokens that you have previously generated for that data, you can use the `detokenize(request)` method. The first parameter must have a request key that takes an array of tokens to be fetched from the vault and the redaction type, as shown below.

```javascript
// Required, tokens for the records to be fetched.
const detokenizeData: Array<string> = [
    'string',
    'string',
    'string',
];

// Optional, redaction type to be applied ex: Skyflow.RedactionType.PLAIN_TEXT
const redactionType: RedactionType = RedactionType.REDACTED;

const detokenizeRequest: DetokenizeRequest = new DetokenizeRequest(
    detokenizeData,
    redactionType,
);
```
`RedactionType` accepts one of four values:
* `PLAIN_TEXT`
* `MASKED`
* `REDACTED`
* `DEFAULT`

Note:
- `redaction` defaults to RedactionType.PLAIN_TEXT.

#### Detokenize example

An [example](https://github.com/skyflowapi/skyflow-node/blob/release/24.10.1/samples/vault-api/detokenize-records.ts) of a detokenize call:

```javascript
const detokenizeData: Array<string> = [
    '4017-f72b-4f5c-9b-8e719',
];

const redactionType: RedactionType = RedactionType.PLAIN_TEXT;

const detokenizeRequest: DetokenizeRequest = new DetokenizeRequest(
    detokenizeData,
    redactionType,
);

const detokenizeOptions: DetokenizeOptions = new DetokenizeOptions();
// options can be set using setters
detokenizeOptions.setContinueOnError(true);

detokenizeOptions.setDownloadURL(false);

skyflowClient.vault('VAULT_ID').detokenize(
    detokenizeRequest,
    detokenizeOptions
).then((response: DetokenizeResponse) => {
    console.log(response);
}).catch((error: SkyflowError) => {
    console.log(JSON.stringify(error));
});
```

Sample response:

```json
{
  "detokenizedFields": [
    {
      "token": "110dc-6f76-19-bd3-9051051",
      "value": "1990-01-01",
    },
  ],
  "errors": [],
}
```

### Tokenize: vault().tokenize()

In order to tokenize data, you can use the `tokenize(request)` method. The first parameter is a request object that takes an array of `TokenizeRequestType`, as shown below.

```js
import { TokenizeRequest, TokenizeRequestType } from 'skyflow-node';

// tokenize only supports value and columngroup
// sample data
const tokenizeValues: Array<TokenizeRequestType> = [
    { value: 'VALUE', columnGroup: 'COLUMN_GROUP' },
    { value: 'VALUE', columnGroup: 'COLUMN_GROUP' },
];

const tokenReq: TokenizeRequest = new TokenizeRequest(
    tokenizeValues,
);
```

Sample usage

An [example](https://github.com/skyflowapi/skyflow-node/blob/release/24.10.1/samples/vault_api/tokenize-records.ts) of a tokenize call:

```javascript
// tokenize only supports value and columngroup
// sample data
const tokenizeValues: Array<TokenizeRequestType> = [
    { value: '4111111111111111', columnGroup: 'card_number_cg' },
    { value: '42424242424242424', columnGroup: 'card_number_cg' }
];

const tokenReq: TokenizeRequest = new TokenizeRequest(
    tokenizeValues,
);

skyflowClient.vault('VAULT_ID').tokenize(
    tokenReq,
).then((resp: TokenizeResponse) => {
    console.log(resp);
}).catch((err: SkyflowError) => {
    console.log(JSON.stringify(err));
});
```

Sample response:

```javascript
{
  tokens: [
    '5479-4229-4622-1393',
    '8989-7867-7887-0987',
  ],
  errors: [],
}
```


### Get records by unique values: vault().get()

To retrieve data from your vault using SkyflowIDs or unique column values, use the `get(request)` method. The `request` parameter takes a column value or get request object that should contain either an array of a unique column name and column values or skyflowIds to fetch the records, as shown below:

#### Example: Get records by ID(s)
[Example](https://github.com/skyflowapi/skyflow-node/blob/release/24.10.1/samples/vault-api/get-records.ts) to get records using skyflowIds:
```javascript
const getIds: Array<string> = [
    'SKYFLOW_ID1',
    'SKYFLOW_ID2',
];

const tableName: string = 'TABLE_NAME';

const getRequest: GetRequest = new GetRequest(
    tableName,
    getIds,
);

const getOptions: GetOptions = new GetOptions();
//use setters of setting options refer to skyflow docs for more options
getOptions.setReturnTokens(true);

skyflowClient.vault('VAULT_ID').get(
    getRequest,
    getOptions
).then((response: GetResponse) => {
    console.log(response);
}).catch((error: SkyflowError) => {
    console.log(JSON.stringify(error));
});
```

Note: You cannot pass an array of skyflow_ids and unique column details together. Using column name and column value with `skyflow_ids` will return an error message.

#### Example: Get records by unique column values

[Example](https://github.com/skyflowapi/skyflow-node/blob/release/24.10.1/samples/vault-api/get-column-values.ts) to get records using unique column values:
```javascript
const columnValues: Array<string> = [
    'VALUE1',
    'VALUE2',
];

const tableName: string = 'TABLE_NAME';
//Name of the column. It must be configured as unique in the schema.
const columnName: string = 'COLUMN_NAME';  

const getRequest: GetColumnRequest = new GetColumnRequest(
    tableName,
    columnName,
    columnValues, //Column values of the records to return
);

const getOptions: GetOptions = new GetOptions();
//use setters of setting options refer to skyflow docs for more options
getOptions.setReturnTokens(true);

skyflowClient.vault('VAULT_ID').get(
    getRequest,
    getOptions,
).then((response: GetResponse) => {
    console.log(response);
}).catch((error: SkyflowError) => {
    console.log(JSON.stringify(error));
});
```

Response:

```json
{
    "data":[
        {
            "card_number":"4111111111111111",
            "expiry_date":"11/35",
            "fullname":"myname",
            "id":"f8d2-b557-4c6b-a12c-c5ebfd9"
        },
        {
            "card_number":"4111111111111111",
            "expiry_date":"10/23",
            "fullname":"sam",
            "id":"da53-95d5-4bdb-99db-8d8c5ff9"
        }
    ],
    "errors": [],
}
```

### Update records by ID

To update records in your vault by skyflow_id, use the `update(request, options)` method. The first parameter, `request`, is a update request that must have the table name and takes an object which contains `skyflowId` key to update as a value in the vault. The options parameter takes an object of optional parameters for the update and includes an update options object to return tokenized data for the updated fields. 

Call schema:
```js
// sample data
const updateData: Object = { skyflowId:'SKYFLOW_ID', field: 'VALUE' };

const tableName: string = 'TABLE_NAME';

const updateReq: UpdateRequest = new UpdateRequest(
    tableName,
    updateData,
);

const updateOptions: UpdateOptions = new UpdateOptions();

updateOptions.setReturnTokens(true);

skyflowClient.vault('VAULT_ID').update(
    updateReq,
    updateOptions,
).then((resp: UpdateResponse) => {
    console.log(resp);
    console.log(updateData)
}).catch((err: SkyflowError) => {
    console.log(JSON.stringify(err));
});
```

#### Example: Update records by ID

[Example](https://github.com/skyflowapi/skyflow-node/blob/release/24.10.1/samples/vault-api/Update.ts) to update by ID using `skyflowId`:

```js
// sample data
const updateData: Object = { skyflowId:'29fac46e-5e58-4403-b0da-123436cf4c3d',card_number: '12333333333333444444' };

const tableName: string = 'table1';

const updateReq: UpdateRequest = new UpdateRequest(
    tableName,
    updateData,
);

const updateOptions: UpdateOptions = new UpdateOptions();

updateOptions.setReturnTokens(true);

skyflowClient.vault('VAULT_ID').update(
    updateReq,
    updateOptions,
).then((resp: UpdateResponse) => {
    console.log(resp);
    console.log(updateData)
}).catch((err: SkyflowError) => {
    console.log(JSON.stringify(err));
});
```

Response:

```json
{
    "skyflowId": "29ebda8d-5272-4063-af58-15cc674e332b",
    "card_number": "93f28226-51b0-4f24-8151-78b5a61f028b",
}
```
### Delete

To delete data from the vault, use the `delete(request)` method of the Skyflow client. The `request` parameter takes an delete request object with list of `skyflowIds` and `table` to delete in the following format.

Call schema:

```js
const deleteIds: Array<string> = [
        'SKYFLOW_ID1',   // skyflow id of the record to delete
        'SKYFLOW_ID2',
        'SKYFLOW_ID3',
];

const tableName: string = 'TABLE_NAME';   // Table from which the record is to be deleted

const deleteRequest: DeleteRequest = new DeleteRequest(
    tableName,
    deleteIds,
);
```

[Example](https://github.com/skyflowapi/skyflow-node/blob/release/24.10.1/samples/vault-api/Delete.ts) to delete by ID using `skyflowIds`

```js
const deleteIds: Array<string> = [
    "29ebda8d-5272-4063-af58-15cc674e332b",
    "d5f4b926-7b1a-41df-8fac-7950d2cbd923"
];

const tableName: string = 'table1';   // TABLE_NAME 

const deleteRequest: DeleteRequest = new DeleteRequest(
    tableName,
    deleteIds,
);

// will return first Vault ID
skyflowClient.vault().delete(
    deleteRequest,
).then((resp: DeleteResponse) => {
    console.log(resp);
}).catch((err: SkyflowError) => {
    console.log(JSON.stringify(err));
});
```

Response:

```json
{
  "deletedIds": [
    "29ebda8d-5272-4063-af58-15cc674e332b",
    "d5f4b926-7b1a-41df-8fac-7950d2cbd923",
  ],
  "errors": [],
}
```

### Invoke Connection

Using Connection, you can integrate your server-side application with third party APIs and services without directly handling sensitive data. Prior to using a connection, you have to create a connection and have a connectionURL already generated. Once you have the connectionURL, you can invoke a connection by using the `invoke(request)` method. The config object must include a methodName. The other fields are optional.

```javascript
const body: Object = {
    'KEY1': 'VALUE1',
    'KEY2': 'VALUE2',
};

const pathParams: Object = {
    'KEY1': 'VALUE1',
    'KEY2': 'VALUE2',
};

const queryParams: Object = {
    'KEY1': 'VALUE1',
    'KEY2': 'VALUE2',
};

const header: Object = {
    'Content-Type': 'application/json',
};

const method: Method = RequestMethod.POST;

const invokeReq: InvokeConnectionRequest = new InvokeConnectionRequest(
    method,
    body,
    headers,
);
```

Supported content-types for the response:
  - `application/javascript` 
  - `text/plain`

Supported method names:

* GET:     `RequestMethod.GET`
* POST:    `RequestMethod.POST`
* PUT:     `RequestMethod.PUT`
* PATCH:   `RequestMethod.PATCH`
* DELETE:  `RequestMethod.DELETE`

**pathParams, queryParams, headers, body** are the JSON objects that will be sent through the gateway integration URL.

#### Example: Invoke Connection

An [example](https://github.com/skyflowapi/skyflow-node/blob/release/24.10.1/samples/vault-api/InvokeConnection.ts) of `invokeConnection`:

```javascript
const request = new InvokeRequest(
    method,
    body,
    headers,
    pathParams,
    queryParams,
);

skyflowClient.connection().invoke(
    request,
).then((resp: InvokeConnectionResponse) => {
    console.log(resp);
}).catch((err: SkyflowError) => {
    console.log(JSON.stringify(err));
});
```

Sample response:
```json
{
  "receivedTimestamp": "2021-11-05 13:43:12.534",
  "processingTimeinMs": "12",
  "resource": {
    "cvv2": "558",
  },
}
```

## Authentication and Authorization

### Service Account Bearer Token Generation
The [service account](https://github.com/skyflowapi/skyflow-node/tree/main/src/service-account) module uses a credentials file to generate service account tokens. See [Authentication](https://docs.skyflow.com/api-authentication/#create-a-service-account) for instructions on creating a service account.

The token generated from this module is valid for 60 minutes and lets you make API calls to the Data API as well as the Management API based on the permissions of the service account.

The `generateBearerToken(filepath)` function takes the service account credentials file path for token generation. Alternatively, you can send the entire service account credentials as a string, by using `generateBearerTokenFromCreds(credentials)` function.

Example using a service account credentials file path:

```javascript
import {generateBearerToken, isExpired} from 'skyflow-node';

const filepath = 'CREDENTIALS_FILE_PATH';
let bearerToken = '';

function getSkyflowBearerToken() {
  return new Promise((resolve, reject) => {
    try {
      // IF the bearer token is NOT expired, return it.
      if (!isExpired(bearerToken)) resolve(bearerToken);
      else {
        // OR ELSE call generateBearerToken() to generate from a credentials.json file
        generateBearerToken(filepath)
          .then(response => {
            bearerToken = response.accessToken;
            resolve(bearerToken);
          })
          .catch(error => {
            reject(error);
          });
      }
    } catch (e) {
      reject(e);
    }
  });
}

const tokens = async () => {
  console.log(await getSkyflowBearerToken());
};

tokens();
```

#### Example using service account credentials in code

<details>
<summary>
Example using a service account credentials in code
</summary>

[Example using a service account credentials JSON string:](https://github.com/skyflowapi/skyflow-node/blob/main/samples/service-account/TokenGenerationExample.ts):


```js
import { generateBearerTokenFromCreds, isExpired } from 'skyflow-node';

let credentials = {
    clientID: '<YOUR_CLIENT_ID>',
    clientName: '<YOUR_CLIENT_NAME>',
    keyID: '<YOUR_KEY_ID>',
    tokenURI: '<YOUR_TOKEN_URI>',
    privateKey: '<YOUR_PEM_PRIVATE_KEY>',
};
let bearerToken = '';

function getSkyflowBearerToken() {
    return new Promise(async (resolve, reject) => {
        try {
            // IF the bearer token is NOT expired, return it.
            if (!isExpired(bearerToken)) resolve(bearerToken);
            // OR ELSE call generateBearerTokenFromCreds() 
            else {
                let response = await generateBearerTokenFromCreds(
                    JSON.stringify(credentials)
                );
                // save it in memory as `bearerToken`
                bearerToken = response.accessToken;
                // and return the bearerToken
                resolve(bearerToken);
            }
        } catch (e) {
            // error
            reject(e);
        }
    });
}

// define a function to log the token, for testing
const tokens = async () => {
    console.log(await getSkyflowBearerToken());
};
// run the function
tokens();
```
</details>

#### Service Account Bearer Token Generation with Additional Context


Context-Aware Authorization enables you to embed context values into a Bearer token when you generate it, and reference those values in your policies for more dynamic access control of data in the vault or validating signed data tokens during detokenization. It can be used to track end user identity when making API calls using service accounts. 
 
When you create a service account with context_id enabled, you can pass an additional claim called ctx in the JWT assertion used to authenticate the service account.  This  ctx parameter should ideally map to the identifier of the end user accessing your service for audit logging purposes. On successful validation of the JWT assertion, Skyflow generates a bearer token in the JWT format. This resulting bearer token generated will have the context embedded as a claim. You can now use this context embedded bearer token to make API calls to Skyflow APIs. Additionally, the ctx value contained in the bearer token is also audit logged.

The Skyflow Node SDK generates the JWT assertion for you with the context embedded. To do so you must pass the value for the ‘ctx’ claim as part of the `options` parameter in the `generateBearerToken(filepath, options)` function.

`generateBearerToken(filepath, {ctx: '<CONTEXT_ID>'})`


<details>
<summary>
Example using a service account credentials file path
</summary>

```js
import { generateBearerToken, isExpired } from 'skyflow-node';

let filepath = 'CREDENTIALS_FILE_PATH'
let bearerToken = '';

function getSkyflowBearerToken() {
    return new Promise(async (resolve, reject) => {
        try {
            const options = {
                ctx: 'CONTEXT_ID',
            };
            if(!isExpired(bearerToken)) resolve (bearerToken);
            else {
                let response = await generateBearerToken(filepath, options);
                bearerToken = response.accessToken;
                resolve(bearerToken);
            }           
        } catch (e) {
            reject(e);
        }
    });
}

const tokens = async () => {
    console.log(await getSkyflowBearerToken());
};

tokens();
```
Alternatively, you can send the entire service account credentials as a string, by using the generateBearerTokenFromCreds(credentials, options) function.

[Example using a service account credentials JSON string:](https://github.com/skyflowapi/skyflow-node/blob/main/samples/service-account/TokenGenerationWithContextExample.ts)

```js
import { generateBearerTokenFromCreds, isExpired } from 'skyflow-node';

let credentials = {
    clientID: '<YOUR_CLIENT_ID>',
    clientName: '<YOUR_CLIENT_NAME>',
    keyID: '<YOUR_KEY_ID>',
    tokenURI: '<YOUR_TOKEN_URI>',
    privateKey: '<YOUR_PEM_PRIVATE_KEY>',
};
let bearerToken = '';

function getSkyflowBearerToken() {
    return new Promise(async (resolve, reject) => {
        try {
            const options = {
                ctx: 'CONTEXT_ID',
            }
            if (!isExpired(bearerToken)) resolve(bearerToken);
            else {
                let response = await generateBearerTokenFromCreds(
                    JSON.stringify(credentials),
                    options
                );
                bearerToken = response.accessToken;
                resolve(bearerToken);
            }
        } catch (e) {
            reject(e);
        }
    });
}

const tokens = async () => {
    console.log(await getSkyflowBearerToken());
};

tokens();
```
</details>

#### Service Account Scoped Bearer Token Generation 
When a service account has multiple roles, you can generate bearer tokens that are scoped to a specific role by providing the appropriate role ID.Generated bearer tokens are valid for 60 minutes and let you perform operations with the permissions associated with the specified role.

The role IDs are passed as part of the `options` in `generateBearerToken(filepath, options)` function, which takes the service account credentials file path and an optional `options` object for token generation. 


<details>
<summary>
Example using a service account credentials file path
</summary>

[Example using a service account credentials file path:](https://github.com/skyflowapi/skyflow-node/blob/main/samples/service-account/ScopedTokenGenerationExample.ts)

```js
import { generateBearerToken, isExpired } from 'skyflow-node';

let filepath = 'CREDENTIALS_FILE_PATH'
let bearerToken = '';

function getSkyflowBearerToken() {
    return new Promise(async (resolve, reject) => {
        try {
            const options = {
                roleIDs: ['ROLE_ID1', 'ROLE_ID2'],
            };
            if(!isExpired(bearerToken)) resolve (bearerToken);
            else {
                let response = await generateBearerToken(filepath, options);
                bearerToken = response.accessToken;
                resolve(bearerToken);
            }           
        } catch (e) {
            reject(e);
        }
    });
}

const tokens = async () => {
    console.log(await getSkyflowBearerToken());
};

tokens();
```
Alternatively, you can send the service account credentials as a string, by using the `generateBearerTokenFromCreds(credentials, options)` function.

Note:
By including context in the options, you can create scoped bearer tokens with the context JWT claim.


[Example using a service account credentials JSON string:](https://github.com/skyflowapi/skyflow-node/blob/main/samples/service-account/ScopedTokenGenerationExample.ts)

```js
import { generateBearerTokenFromCreds, isExpired } from 'skyflow-node';

let credentials = {
    clientID: '<YOUR_CLIENT_ID>',
    clientName: '<YOUR_CLIENT_NAME>',
    keyID: '<YOUR_KEY_ID>',
    tokenURI: '<YOUR_TOKEN_URI>',
    privateKey: '<YOUR_PEM_PRIVATE_KEY>',
};
let bearerToken = '';

function getSkyflowBearerToken() {
    return new Promise(async (resolve, reject) => {
        try {
            const options = {
                roleIDs: ['ROLE_ID1', 'ROLE_ID2'],
            };
            if (!isExpired(bearerToken)) resolve(bearerToken);
            else {
                let response = await generateBearerTokenFromCreds(
                    JSON.stringify(credentials),
                    options
                );
                bearerToken = response.accessToken;
                resolve(bearerToken);
            }
        } catch (e) {
            reject(e);
        }
    });
}

const tokens = async () => {
  console.log(await getSkyflowBearerToken());
};

tokens();
```

</details>


#### Skyflow Signed Data Tokens Generation
Skyflow generates data tokens when you insert sensitive data into the vault. With the signed data tokens feature, you can add additional context to these data tokens such as the identity of the end user accessing the information. This additional context is structured in the form of a JWT that need to be signed using a private key contained in the `tokenSignatureCredentials.json` credentials file that gets downloaded when you configure a service account to only support signed data tokens for detokenization. 
In a future release of this SDK we also plan to support an expiration period associated with the signed tokens making it very powerful when you want to detokenize data from your front end application. 

When the context aware bearer tokens along with the signed data tokens are sent to the detokenize endpoint, Skyflow’s governance engine performs the following checks: 
 - Validate the signature of the bearer token
 - Bearer token has not expired
 - Validate the signature of the signed data token
 - Signed data token has not expired
 - ctx value in the bearer token matches the ctx value in the signed token
 - Service account has permissions to detokenize data 

Only if these conditions are met, will the detokenize request be successful 

The data tokens are passed as part of the `options` in the `generateSignedDataTokens(filepath, options)` function, which takes the service account credentials file path and an options object for token generation. Alternatively, you can send the entire service account credentials as string, by using the `generateSignedDataTokensFromCreds(credentials, options)` function.

<details>
<summary>
Example using a service account credentials file path
</summary>

[Example using a service account credentials file path:](https://github.com/skyflowapi/skyflow-node/blob/main/samples/service-account/SignedTokenGenerationExample.ts)

```js
import { generateSignedDataTokens,isExpired } from 'skyflow-node';

let filepath = 'CREDENTIALS_FILE_PATH';
let bearerToken = '';

function getSkyflowBearerToken() {
    return new Promise(async (resolve, reject) => {
        try {
            const options = {
                ctx: 'CONTEXT_ID',
                dataTokens: ['DATA_TOKEN1', 'DATA_TOKEN2'],
                timeToLive: 90 // In seconds.
            };
            if(!isExpired(bearerToken)) resolve (bearerToken);
            else {
                let response = await generateSignedDataTokens(filepath, options);
                resolve(response);
            }           
        } catch (e) {
            reject(e);
        }
    });
}

const tokens = async () => {
    const tokenResponseFromFilePath = await getSignedTokenFromFilePath();
    tokenResponseFromFilePath.forEach((response)=>{
        console.log(`Data Token: ${response.token}`);
        console.log(`Signed Data Token: ${response.signedToken}`);
    });
};

tokens();
```

Note:
By including context in the `options`, you can create signed data tokens with the context JWT claim.

[Example using a service account credentials JSON string:](https://github.com/skyflowapi/skyflow-node/blob/main/samples/service-account/SignedTokenGenerationExample.ts)

```js
import { generateSignedDataTokensFromCreds, isExpired } from 'skyflow-node';

let credentials = {
    clientID: '<YOUR_CLIENT_ID>',
    clientName: '<YOUR_CLIENT_NAME>',
    keyID: '<YOUR_KEY_ID>',
    tokenURI: '<YOUR_TOKEN_URI>',
    privateKey: '<YOUR_PEM_PRIVATE_KEY>',
};
let bearerToken = '';

function getSkyflowBearerToken() {
    return new Promise(async (resolve, reject) => {
        try {
            const options = {
                ctx: 'CONTEXT_ID',
                dataTokens: ['DATA_TOKEN1', 'DATA_TOKEN2'],
                timeToLive: 90 // In seconds.
            };
            if(!isExpired(bearerToken)) resolve (bearerToken);
            else {
                let response = await generateSignedDataTokensFromCreds(
                    JSON.stringify(credentials),
                    options
                );
                resolve(response);
            }
        } catch (e) {
            reject(e);
        }
    });
}

const tokens = async () => {
    const tokenResponseFromCreds = await getSignedTokenFromCreds();
    tokenResponseFromCreds.forEach((response)=>{
        console.log(`Data Token: ${response.token}`);
        console.log(`Signed Data Token: ${response.signedToken}`);
    });
};

tokens();
```

</details>


### Logging
The Skyflow Node.js SDK provides useful logging. By default the logging level of the SDK is set to `LogLevel.ERROR`. This can be changed by setting logLevel as shown below:

```javascript
import { LogLevel } from 'skyflow-node';
```

```javascript
const client : Skyflow = Skyflow({
  vaultConfigs: [
    {
      // Id of the vault that the client should connect to.
      vaultId: 'string',
      // Id of the cluster that the client should connect to.
      clusterId: 'string',
      // environment to which the vault ID belongs
      env: Env.PROD,
      // vault level credentials
      credentials: {
        roles: ['string', 'string'], // optional, IDs for roles
        context: 'string', // optional, Id of the context 
        credentialsString: 'string', // credentials JSON as a stringified version
      },
    }
  ],
  // environment to which the vault ID belongs
  skyflowCredentials: {
       path: 'string', // optional, path to credentials json file
  },
  // Sets the Skyflow SDK log level to INFO
  logLevel: LogLevel.INFO, 
});
```

Current the following 5 log levels are supported:
* `DEBUG`:
   When `LogLevel.DEBUG` is passed, all level of logs will be printed(DEBUG, INFO, WARN, ERROR)  
* `INFO`:
   When `LogLevel.INFO` is passed, INFO logs for every event that has occurred during the SDK flow execution will be printed along with WARN and ERROR logs
* `WARN`:
   When `LogLevel.WARN` is passed, WARN and ERROR logs will be printed
* `ERROR`:
   When `LogLevel.ERROR` is passed, only ERROR logs will be printed.
* `OFF`:
   `LogLevel.OFF` can be used to turn off all logging from the Skyflow SDK.

**Note:**
* The ranking of logging levels are as follows: `DEBUG` < `INFO` < `WARN` < `ERROR`
* The default the logLevel for Skyflow SDK is `LogLevel.ERROR`.

## Reporting a vulnerability

If you discover a potential security issue in this project, please reach out to us at security@skyflow.com. Please do not create public GitHub issues or Pull Requests, as malicious actors could potentially view them.
