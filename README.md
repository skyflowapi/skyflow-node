
# Skyflow Node.js SDK

SDK for the Skyflow Data Privacy Vault.

[![CI](https://img.shields.io/static/v1?label=CI&message=passing&color=green?style=plastic&logo=github)](https://github.com/skyflowapi/skyflow-node/actions)
[![GitHub release](https://badge.fury.io/js/skyflow-node.svg)](https://www.npmjs.com/package/skyflow-node)
[![License](https://img.shields.io/github/license/skyflowapi/skyflow-node)](https://github.com/skyflowapi/skyflow-node/blob/master/LICENSE)


## Table of contents

- [Skyflow Node.js SDK](#skyflow-nodejs-sdk)
  - [Table of contents](#table-of-contents)
  - [Installation](#installation)
      - [Requirements](#requirements)
      - [Import / Require](#import--require)
  - [Vault APIs](#vault-apis)
    - [Insert: vault.insert()](#insert-vaultinsert)
      - [Example: Insert Records](#example-insert-records)
      - [Example: Upsert Records (update or insert)](#example-upsert-records-update-or-insert)
      - [Example: Insert with partial success support](#example-insert-with-partial-success-support)
    - [Detokenize: vault.detokenize()](#detokenize-vaultdetokenize)
      - [Detokenize example](#detokenize-example)
    - [Get By IDs: vault.getById()](#get-by-ids-vaultgetbyid)
      - [Example: Get Records by IDs](#example-get-records-by-ids)
    - [Get records by unique values: vault.get()](#get-records-by-unique-values-vaultget)
      - [Example: Get records by ID(s)](#example-get-records-by-ids-1)
      - [Example: Get records by unique field values](#example-get-records-by-unique-field-values)
    - [Update records by IDs](#update-records-by-ids)
      - [Example: Update records by IDs](#example-update-records-by-ids)
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
  - [Reporting a Vulnerability](#reporting-a-vulnerability)
  
## Installation

#### Requirements

- Node 12.22.12 and above

```sh
npm install skyflow-node
```

#### Import / Require

Depending on your project setup, you may use either the `require` method (common in Node.js projects) or the `import` statement (common in projects using ES modules).

#####Require

```javascript
const { Skyflow } = require('skyflow-node');
```

**ES modules**

```javascript
import { Skyflow }  from 'skyflow-node';
```

#####All imports

```javascript
import { Skyflow,                         // Vault client
          generateBearerToken, isExpired, // JWT auth helpers
          LogLevel, setLogLevel           // logging options
} from 'skyflow-node'
```


## Vault APIs
The [Vault](https://github.com/skyflowapi/skyflow-node/tree/master/src/vault-api) Node.js module is used to perform operations on the vault such as inserting records, detokenizing tokens, retrieving tokens for list of `skyflow_id`'s and to invoke the Connection.

To use this module, the Skyflow client must first be initialized as follows: 

```javascript
import { Skyflow } from 'skyflow-node';

// Initialize the Skyflow Vault client
const vault = Skyflow.init({
  // Id of the vault that the client should connect to.
  vaultID: 'string',
  // URL of the vault that the client should connect to.
  vaultURL: 'string',
  // Helper function generates a Skyflow bearer token.
  getBearerToken: auth,
});

// sample function to retrieve a bearer token from an environment variable
// customize this according to your environment and security posture
const auth = function () {
  return new Promise((resolve, reject) => {
    resolve(process.env.VAULT_BEARER_TOKEN);
  });
},
```

For the `getBearerToken` parameter, pass in a helper function that retrieves a Skyflow bearer token from your backend. This function will be invoked when the SDK needs to insert or retrieve data from the vault. 

All Vault APIs must be invoked using a vault client instance.

### Insert: vault.insert()

To insert data into your vault, use the `insert(data, options?)` method. 

```js
vault.insert(data, options?);
```

- **Records:** The first parameter records is a JSONObject that must have a records key and takes an array of records to be inserted into the vault as a value. 
- **Options:** The second parameter options is an optional object that provides further options for your insert call, more details below.

#### Example: Insert Records

An [example](https://github.com/skyflowapi/skyflow-node/blob/master/samples/vault-api/Insert.ts) of a simple insert call is given below:

```javascript
const result = await vault.insert(
  {
    // records to be inserted
    records: [
      {
        fields: { 
          // fields by name
          expiry_date: '12/2026',
          card_number: '411111111111111',
        },
        // table name
        table: 'cards',
      },
    ],
  },
  // options
  {
    // return tokens instead of real values
    tokens: true,
  }
);

```

**Sample response:**

```json
{
  "records": [
    {
      "table": "cards",
      "fields": {
        "card_number": "f37186-e7e2-466f-91e5-48e2bcbc1",
        "expiry_date": "1989cb56-63a-4482-adf-1f74cd1a5",
      },
    },
  ],
}
```

#### Example: Upsert Records (update or insert)

Insert call [example](https://github.com/skyflowapi/skyflow-node/blob/master/samples/vault-api/UpsertSupport.ts) with upsert support:

```javascript
const response = vault.insert({
  // records to be inserted
  records: [{
    fields: {
      expiry_date: '12/2026',
      card_number: '411111111111111',
    },
    table: 'cards',
  }],
}, {
  // optional options
  tokens: true,
  // To conditionally insert OR update based on a field
  upsert: [
    {
      table: 'cards',         // Name of the table in the vault.
      column: 'card_number',  // Name of the column in the vault. Must be defined as `unique`.
    }
  ]
});

response.then(
    (res) => {
        console.log(JSON.stringify(res));
    },
    (err) => {
        console.log(JSON.stringify(err));
    }
).catch((err) => {
    console.log(JSON.stringify(err));
});
```

Samples Response:
```json
{
  "records": [
    {
      "table": "cards",
      "fields": {
        "skyflow_id": "16419435-aa63-4823-aae7-19c6a2d6a19f",
        "card_number": "f3907186-e7e2-466f-91e5-48e12c2bcbc1",
        "cvv": "1989cb56-63da-4482-a2df-1f74cd0dd1a5",
      },
    }
  ]
}
```

#### Example: Insert with partial success support

Insert with partial success support

Insert call [example](https://github.com/skyflowapi/skyflow-node/blob/master/samples/vault-api/InsertWithContinueOnError.ts) with contiueOnError support:

```javascript
const response = vault.insert({
  records: [
    {
      fields: {
        expiry_date: '12/2026',
        card_number: '411111111111111',
        namee: 'john doe',
      },
      table: 'cards',
    },
    {
      fields: {
        expiry_date: '12/2027',
        card_number: '411111111111111',
        name: 'jane doe',
      },
      table: 'cards',
    }
  ],
},
{
  // return tokens instead of real values
  tokens: true,
  // Ignore failures and keep going. Response will include errors with index value.
  continueOnError: true,
});

response.then(
  (res) => {
    console.log(JSON.stringify(res));
  },
  (err) => {
    console.log(JSON.stringify(err));
  }
).catch((err) => {
  console.log(JSON.stringify(err));
});
```

**Sample Response:**

```json
{
  "records": [
    {
      "table": "cards",
      "fields": {
        "skyflow_id": "16419435-aa63-4823-aae7-19c6a2d6a19f",
        "card_number": "f3907186-e7e2-466f-91e5-48e12c2bcbc1",
        "expiry_date": "1989cb56-63da-4482-a2df-1f74cd0dd1a5",
        "name": "245d3a0f-a2d3-443b-8a20-8c17de86e186",
      },
      "request_index": 1,
    }
  ],
  "errors": [
    {
      "error": {
        "code":400,
        "description":"Invalid field present in JSON namee - requestId: 87fb2e32-6287-4e61-8304-9268df12bfe8",
        "request_index": 0,
      }
    }
  ]
}
```

### Detokenize: vault.detokenize()

Returns values for provided tokens.

In order to retrieve data from your vault using tokens that you have previously generated for that data, you can use the `detokenize(data)` method. The first parameter must have a records key that takes an array of tokens to be fetched from the vault, as shown below.

```javascript
data = {
  records: [{
    token: 'string',                 // Required, token for the record to be fetched.
    redaction: Skyflow.RedactionType // Optional, redaction type to be applied ex: Skyflow.RedactionType.PLAIN_TEXT
  }]
}
```

`Skyflow.RedactionType` accepts one of four values:
* `PLAIN_TEXT`
* `MASKED`
* `REDACTED`
* `DEFAULT`

Note:
- `redaction` defaults to Skyflow.RedactionType.PLAIN_TEXT.

#### Detokenize example

An [example](https://github.com/skyflowapi/skyflow-node/blob/master/samples/vault-api/Detokenize.ts) of a detokenize call:

```javascript
const result = await vault.detokenize({
  records: [
    {
      token: '4017-f72b-4f5c-9b-8e719',
      redaction: Skyflow.RedactionType.PLAIN_TEXT
    },
  ],
});
```

Sample response:

```json
{
  "records": [
    {
      "token": "110dc-6f76-19-bd3-9051051",
      "value": "1990-01-01",
    },
  ],
}
```

### Get By IDs: vault.getById()

In order to retrieve data from your vault using SkyflowIDs, use the `getById(records)` method. The records parameter takes a JSON Object that should contain an array of SkyflowIDs to be fetched, as shown below:

```javascript
data = {
    records: [{
        // List of skyflow_ids for the records to be fetched
        ids: ['id1', 'id2'],
        // Name of table holding the above skyflow_ids
        table: 'NAME_OF_SKYFLOW_TABLE',
        // Redaction to be applied to retrieved data
        redaction: Skyflow.RedactionType.PLAIN_TEXT,
    }]
};
```

`Skyflow.RedactionType` accepts one of four values:
* `PLAIN_TEXT`
* `MASKED`
* `REDACTED`
* `DEFAULT`

You must apply a redaction type to retrieve data.

#### Example: Get Records by IDs

An [example](https://github.com/skyflowapi/skyflow-node/blob/master/samples/vault-api/GetById.ts) of `getById` call:

```javascript
let skyflowIds = [
    'f8622-b557-4c6b-a12c-c0b0bfd9',
    'da26de53-95d5-4db-99db-8d35ff9'
];

let record = {
    ids: skyflowIds,
    table: 'cards',
    redaction: RedactionType.PLAIN_TEXT
};

let invalidIds = ['invalid Skyflow ID'];
let badRecord = {
    ids: invalidIds,
    table: 'cards',
    'redaction': RedactionType.PLAIN_TEXT
};

let records = {
    records: [record, badRecord]
};

const result = client.getById(records);
result.then(
    (res) => {
        console.log(JSON.stringify(res));
    }).catch((err) => {
    console.log(JSON.stringify(err));
});
```

Sample response:

```json
{
  "records": [
    {
      "fields": {
        "card_number": "4111111111111111",
        "expiry_date": "11/35",
        "fullname": "myname",
        "skyflow_id": "f8d2-b557-4c6b-a12c-c5ebfd9"
      },
      "table": "cards"
    },
    {
      "fields": {
        "card_number": "4111111111111111",
        "expiry_date": "10/23",
        "fullname": "sam",
        "skyflow_id": "da53-95d5-4bdb-99db-8d8c5ff9"
      },
      "table": "cards"
    }
  ],
  "errors": [
    {
      "error": {
        "code": "404",
        "description": "No Records Found"
      },
      "skyflow_ids": [
        "invalid Skyflow ID"
      ]
    }
  ]
}
```

### Get records by unique values: vault.get()

To retrieve data from your vault using SkyflowIDs or unique column values, use the `get(records)` method. The `records` parameter takes a JSONObject that should contain either an array of SkyflowIDs or a unique column name and values to fetch the records, as shown below:

```javascript
data = {
  records: [
    {
      // List of skyflow_ids for the records to fetch.
      ids: ['SKYFLOW_ID_1', 'SKYFLOW_ID_2'], // Optional
      // Name of table holding the records in the vault.
      table: 'NAME_OF_SKYFLOW_TABLE',
      // Redaction type to apply to retrieved data.
      redaction: Skyflow.RedactionType,
      // Unique column name in the vault.
      columnName: 'UNIQUE_COLUMN_NAME', // Optional
      // List of given unique column values.
      columnValues: ['<COLUMN_VALUE_1>', '<COLUMN_VALUE_2>', '<COLUMN_VALUE_3>'], // Required if column name is provided
    },
  ],
};
```

Note: You cannot pass an array of skyflow_ids and unique column details together. Using column name and column value with `skyflow_ids` will return an error message.

#### Example: Get records by ID(s)

[Example](https://github.com/skyflowapi/skyflow-node/blob/master/samples/vault-api/Get.ts) to get records using skyflowIds:
```javascript
let skyflowIds = [
    'f8622-b557-4c6b-a12c-c0b0bfd9',
    'da26de53-95d5-4db-99db-8d35ff9',
];

let record = {
    ids: skyflowIds,
    table: 'cards',
    redaction: RedactionType.PLAIN_TEXT,
};

let records = {
    records: [record],
};

const result = vault.get(records);
result
    .then((res) => {
        console.log(JSON.stringify(res));
    })
    .catch((err) => {
        console.log(JSON.stringify(err));
    });
```

Response:

```json
{
    "records":[
        {
            "fields":{
                "card_number":"4111111111111111",
                "expiry_date":"11/35",
                "fullname":"myname",
                "id":"f8d2-b557-4c6b-a12c-c5ebfd9"
            },
            "table":"cards"
        },
        {
            "fields":{
                "card_number":"4111111111111111",
                "expiry_date":"10/23",
                "fullname":"sam",
                "id":"da53-95d5-4bdb-99db-8d8c5ff9"
            },
            "table":"cards"
        }
    ]
}
```

#### Example: Get records by unique field values

[Example](https://github.com/skyflowapi/skyflow-node/blob/master/samples/vault-api/Get.ts) to get records using unique column names and values:

```javascript
let record = {
    table: 'cards',
    redaction: RedactionType.PLAIN_TEXT,
    columnName: 'card_id',
    columnValues: ['123', '456'],
};

let records = {
    records: [record],
};

const result = vault.get(records);
result
    .then((res) => {
        console.log(JSON.stringify(res));
    })
    .catch((err) => {
        console.log(JSON.stringify(err));
    });
```

Response:
```json
{
    "records":[
        {
            "fields":{
                "card_id":"123",
                "expiry_date":"11/35",
                "fullname":"myname",
                "id":"f8d2-b557-4c6b-a12c-c5ebfd9"
            },
            "table":"cards"
        },
        {
            "fields":{
                "card_id":"456",
                "expiry_date":"10/23",
                "fullname":"sam",
                "id":"da53-95d5-4bdb-99db-8d8c5ff9"
            },
            "table":"cards"
        }
    ]
}
```

### Update records by IDs

To update records in your vault by skyflow_id, use the `update(records, options)` method. The first parameter, `records`, is a JSONObject that must have a records key and takes an array of records to update as a value in the vault. The options parameter takes an object of optional parameters for the update and includes an option to return tokenized data for the updated fields. 

Call schema:
```js
const updateInput = {
  records: [ // Array of records to update.
    {
      id: '<SKYFLOW_ID>', // Skyflow_id of record to update.
      table: '<TABLE_NAME>', // Table name of given Skyflow_id. 
      fields: {  // Fields to update.
        '<FIELD_NAME_1>': '<FIELD_VALUE_1>', 
        '<FIELD_NAME_2>': '<FIELD_VALUE_2>',
      },
    },
  ]
};

const options = { // Optional
  // Option to return updated field tokens in response.
  // Defaults to 'true'.
  tokens: true,
}
```

#### Example: Update records by IDs

[Example](https://github.com/skyflowapi/skyflow-node/blob/master/samples/vault-api/Update.ts) to update by ID using `skyflow_ids`:

```js
const updateInput = {
  records: [
    {
      id: '29ebda8d-5272-4063-af58-15cc674e332b', // Valid record id.
      table: 'cards',
      fields: {
        card_number: '5105105105105100',
        cardholder_name: 'Thomas',
        expiration_date: '07/2032',
        ssn: '123-45-6722',          
      },   
    },    
  ],
};

const options = { tokens: true };

const response = vault.update(updateInput, options);
console.log(response);
```

Response:

```json
{
  "records":[
    {
      "id": "29ebda8d-5272-4063-af58-15cc674e332b",
      "fields":{
        "card_number": "93f28226-51b0-4f24-8151-78b5a61f028b",
        "cardholder_name": "0838fd08-9b51-4db2-893c-48542f3b121e",
        "expiration_date": "91d7ee77-262f-4d5d-8286-062b694c81fd",
        "ssn": "e28bf55d-f3d8-49a6-aad9-71a13db54b82",
      },
      "table": "cards",
    }
  ]
}
```
### Delete

To delete data from the vault, use the `delete(records, options?)` method of the Skyflow client. The `records` parameter takes an array of records with `id` and `table` to delete in the following format. The `options` parameter is optional and takes an object of deletion parameters. Currently, there are no supported deletion parameters.

Call schema:

```js
const deleteInput = {
  records: [
    {
      id: "<SKYFLOW_ID_1>", // skyflow id of the record to delete
      table: "<TABLE_NAME>" // Table from which the record is to be deleted
    },
    {
      // ...additional records here
    },
  ]
};

const options = {
  // Optional
}
```

[Example](https://github.com/skyflowapi/skyflow-node/blob/master/samples/vault-api/Delete.ts) to delete by ID using `skyflow_ids`

```js
const deleteInput = {
  records: [
    {
      id: "29ebda8d-5272-4063-af58-15cc674e332b",
      table: "cards",
    },
    {
      id: "d5f4b926-7b1a-41df-8fac-7950d2cbd923",
      table: "cards",
    }
  ],
};

const options = {};

const response = skyflowClient.delete(deleteInput, options);
console.log(response);
```

Response:

```json
{
  "records": [
    {
     "skyflow_id": "29ebda8d-5272-4063-af58-15cc674e332b",
     "deleted": true,
    },
    {
     "skyflow_id": "29ebda8d-5272-4063-af58-15cc674e332b",
     "deleted": true,
    }
  ]
}
```

### Invoke Connection

Using Connection, you can integrate your server-side application with third party APIs and services without directly handling sensitive data. Prior to using a connection, you have to create a connection and have a connectionURL already generated. Once you have the connectionURL, you can invoke a connection by using the `invokeConnection(config)` method. The config object must include a connectionURL and methodName. The other fields are optional.

```javascript
data = {
  connectionURL: '<YOUR_CONNECTION_URL>',
  methodName: Skyflow.RequestMethod.POST,
  requestHeader: {
    Authorization: '<YOUR_CONNECTION_BASIC_AUTH>',
  },
  pathParams: {
    card_number: '<YOUR_CARD_NUMBER>',
  },
  requestBody: {
    expirationDate: {
      mm: '01',
      yy: '46',
    },
  },
};
```

Supported content-types for the response:
  - `application/javascript` 
  - `text/plain`

Supported method names:

* GET:     `Skyflow.RequestMethod.GET`
* POST:    `Skyflow.RequestMethod.POST`
* PUT:     `Skyflow.RequestMethod.PUT`
* PATCH:   `Skyflow.RequestMethod.PATCH`
* DELETE:  `Skyflow.RequestMethod.DELETE`

**pathParams, queryParams, requestHeader, requestBody** are the JSON objects that will be sent through the gateway integration URL.

#### Example: Invoke Connection

An [example](https://github.com/skyflowapi/skyflow-node/blob/master/samples/vault-api/InvokeConnection.ts) of `invokeConnection`:

```javascript
const result = client.invokeConnection({
  connectionURL: '<YOUR_CONNECTION_URL>',
  methodName: Skyflow.RequestMethod.POST,
  requestHeader: {
    'Content-Type': 'application/json',
    Authorization: '<YOUR_CONNECTION_BASIC_AUTH>',
  },
  pathParams: {
    card_number: '<YOUR_CARD_NUMBER>',
  },
  requestBody: {
    expirationDate: {
      mm: '01',
      yy: '46',
    },
  },
});

result
  .then(response => {
    console.log(JSON.stringify(response));
  })
  .catch(error => {
    // Note: only text/plain and application/json errors are supported
    console.log(JSON.stringify(error));
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
The [service account](https://github.com/skyflowapi/skyflow-node/tree/master/src/service-account) module uses a credentials file to generate service account tokens. See [API Authentication](https://docs.skyflow.com/api-authentication/#create-a-service-account) for instructions on creating a service account.

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

[Example using a service account credentials JSON string:](https://github.com/skyflowapi/skyflow-node/blob/master/samples/service-account/TokenGenerationExample.ts):


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

[Example using a service account credentials JSON string:](https://github.com/skyflowapi/skyflow-node/blob/master/samples/service-account/TokenGenerationWithContextExample.ts)

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

[Example using a service account credentials file path:](https://github.com/skyflowapi/skyflow-node/blob/master/samples/service-account/ScopedTokenGenerationExample.ts)

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


[Example using a service account credentials JSON string:](https://github.com/skyflowapi/skyflow-node/blob/master/samples/service-account/ScopedTokenGenerationExample.ts)

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

[Example using a service account credentials file path:](https://github.com/skyflowapi/skyflow-node/blob/master/samples/service-account/SignedTokenGenerationExample.ts)

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

[Example using a service account credentials JSON string:](https://github.com/skyflowapi/skyflow-node/blob/master/samples/service-account/SignedTokenGenerationExample.ts)

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
The Skyflow Node.js SDK provides useful logging. By default the logging level of the SDK is set to `LogLevel.ERROR`. This can be changed by using `setLogLevel(logLevel)` as shown below:

```javascript
import { setLogLevel, LogLevel } from 'skyflow-node';
```

```javascript
// Sets the Skyflow SDK log level to INFO
setLogLevel(LogLevel.INFO);
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

## Reporting a Vulnerability

If you discover a potential security issue in this project, please reach out to us at security@skyflow.com. Please do not create public GitHub issues or Pull Requests, as malicious actors could potentially view them.
