
# skyflow-node
skyflow-node is the Node.js version of Skyflow SDK for the JavaScript programming language.

[![CI](https://img.shields.io/static/v1?label=CI&message=passing&color=green?style=plastic&logo=github)](https://github.com/skyflowapi/skyflow-node/actions)
[![GitHub release](https://badge.fury.io/js/skyflow-node.svg)](https://www.npmjs.com/package/skyflow-node)
[![License](https://img.shields.io/github/license/skyflowapi/skyflow-node)](https://github.com/skyflowapi/skyflow-node/blob/master/LICENSE)


# Table of Contents

- [skyflow-node](#skyflow-node)
- [Table of Contents](#table-of-contents)
  - [Installation](#installation)
    - [Requirements](#requirements)
    - [Configuration](#configuration)
  - [Usage](#usage)
    - [Importing `skfylow-node`](#importing-skfylow-node)
    - [Service Account Token Generation](#service-account-token-generation)
    - [Service Account Bearer Token with Context Generation](#service-account-bearer-token-with-context-generation)
    - [Service Account Scoped Bearer Token Generation](#service-account-scoped-bearer-token-generation)
    - [Skyflow Signed Data Tokens Generation](#skyflow-signed-data-tokens-generation)
    - [Vault APIs](#vault-apis)
      - [Insert](#insert)
      - [Detokenize](#detokenize)
      - [Get By Id](#get-by-id)
      - [Invoke Connection](#invoke-connection)
    - [Logging](#logging)
  - [Reporting a Vulnerability](#reporting-a-vulnerability)
  
## Installation

### Requirements
- Node 7.6.0 and above

### Configuration

```sh
npm install skyflow-node

```
## Usage

### Importing `skfylow-node`

```
const { Skyflow, generateBearerToken } = require('skyflow-node');
```
Or using ES modules

```
import { Skyflow, generateBearerToken }  from 'skyflow-node';
```

### Service Account Token Generation
The [service account](https://github.com/skyflowapi/skyflow-node/tree/master/src/service-account) Node.js module uses a credentials file to generate service account tokens. See [API Authentication](https://docs.skyflow.com/developer-portal/getting-started/api-authentication/#step-1-create-a-service-account--assign-a-role) for instructions on creating a service account.

The token generated from this module is valid for 60 minutes and lets you make API calls to the Data API as well as the Management API based on the permissions of the Service Account.

The `GenerateBearerToken(filepath,options)` function takes the service account credentials file path and an  optional options object for token generation. Alternatively, you can also send the entire credentials as a string, by using `GenerateBearerTokenFromCreds(credentials,options)`

[Example using credentials file path](https://github.com/skyflowapi/skyflow-node/blob/master/samples/service-account/TokenGenerationExample.ts):

```javascript
import { generateBearerToken, isExpired } from "skyflow-node";

let filepath = "CREDENTIALS_FILE_PATH";
let bearerToken = "";

function getSkyflowBearerToken() {
    return new Promise(async (resolve, reject) => {
        try {
            if (!isExpired(bearerToken)) resolve(bearerToken);
            else {
                let response = await generateBearerToken(filepath);
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

[Example using credentials json string](https://github.com/skyflowapi/skyflow-node/blob/master/samples/service-account/samples/service-account/TokenGenerationExample.ts):

```js
import { generateBearerTokenFromCreds, isValid } from "skyflow-node";

let cred = {
    clientID: "<YOUR_clientID>",
    clientName: "<YOUR_clientName>",
    keyID: "<YOUR_keyID>",
    tokenURI: "<YOUR_tokenURI>",
    privateKey: "<YOUR_PEM_privateKey>",
};
let bearerToken = "";
function getSkyflowBearerToken() {
    return new Promise(async (resolve, reject) => {
        try {
            if (isValid(bearerToken)) resolve(bearerToken);
            else {
                let response = await generateBearerTokenFromCreds(
                    JSON.stringify(cred)
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

###  Service Account Bearer Token with Context Generation 

The service account generated with `context_id` identifier enabled can be used to generate bearer tokens with `context`, which is a `jwt` claim for a skyflow generated bearer token. The token generated from this service account will have a `context_identifier` claim and is valid for 60 minutes and lets you make API calls to the Data API as well as the Management API based on the permissions of the Service Account.

The context can be passed as part of the options in `GenerateBearerToken(filepath,options)`  function, which takes the service account credentials file path and an optional options object for token generation. Alternatively, you can also send the entire credentials as a string, by using `GenerateBearerTokenFromCreds(credentials,options)`

[Example using credentials file path](https://github.com/skyflowapi/skyflow-node/blob/master/samples/service-account/TokenGenerationWithContextExample.ts):

```javascript
import { generateBearerToken, isExpired } from "skyflow-node";

let filepath = "CREDENTIALS_FILE_PATH";
let bearerToken = "";

function getSkyflowBearerToken() {
    return new Promise(async (resolve, reject) => {
        try {
            const options = {
                context: "context_id",
            };
            if (!isExpired(bearerToken)) resolve(bearerToken);
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

[Example using credentials json string](https://github.com/skyflowapi/skyflow-node/blob/master/samples/service-account/samples/service-account/TokenGenerationWithContext.ts):

```js
import { generateBearerTokenFromCreds, isValid } from "skyflow-node";

let cred = {
    clientID: "<YOUR_clientID>",
    clientName: "<YOUR_clientName>",
    keyID: "<YOUR_keyID>",
    tokenURI: "<YOUR_tokenURI>",
    privateKey: "<YOUR_PEM_privateKey>",
};
let bearerToken = "";
function getSkyflowBearerToken() {
    return new Promise(async (resolve, reject) => {
        try {
            const options = {
                context: "context_id",
            };
            if (isValid(bearerToken)) resolve(bearerToken);
            else {
                let response = await generateBearerTokenFromCreds(
                    JSON.stringify(cred),
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
### Service Account Scoped Bearer Token Generation

A service account that has multiple roles can generate bearer tokens with access restricted to a specific role by providing the appropriate `roleID`. Generated bearer tokens are valid for 60 minutes and lets you perform operations with the permissions associated with the specified role.

The role ids can be passed as part of the options in `GenerateBearerToken(filepath,options)`  function, which takes the service account credentials file path and an optional options object for token generation. Alternatively, you can also send the entire credentials as a string, by using `GenerateBearerTokenFromCreds(credentials,options)`

[Example using credentials file path](https://github.com/skyflowapi/skyflow-node/blob/master/samples/service-account/ScopedTokenGenerationExample.ts):

```javascript
import { generateBearerToken, isExpired } from "skyflow-node";

let filepath = "CREDENTIALS_FILE_PATH";
let bearerToken = "";

function getSkyflowBearerToken() {
    return new Promise(async (resolve, reject) => {
        try {
            const options = {
                roleIDs: ["roleID1", "roleID2"],
            };
            if (!isExpired(bearerToken)) resolve(bearerToken);
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

token();
```
### Note: 
By including `context` in the options, scoped bearer token can be created with the `ctx` JWT claim.

Example:

```js
const options = {
  context: 'context_id',
  roleIDs: ["roleID1", "roleID2"],
}
```

[Example using credentials json string](https://github.com/skyflowapi/skyflow-node/blob/master/samples/service-account/samples/service-account/ScopedTokenGeneration.ts):

```js
import { generateBearerTokenFromCreds, isValid } from "skyflow-node";

let cred = {
    clientID: "<YOUR_clientID>",
    clientName: "<YOUR_clientName>",
    keyID: "<YOUR_keyID>",
    tokenURI: "<YOUR_tokenURI>",
    privateKey: "<YOUR_PEM_privateKey>",
};
let bearerToken = "";
function getSkyflowBearerToken() {
    return new Promise(async (resolve, reject) => {
        try {
            const options = {
                roleIDs: ["roleID1", "roleID2"],
            };
            if (isValid(bearerToken)) resolve(bearerToken);
            else {
                let response = await generateBearerTokenFromCreds(
                    JSON.stringify(cred),
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
### Skyflow Signed Data Tokens Generation

Skyflow generates data tokens when sensitive data is inserted into the vault. These data tokens can be digitally signed with the private key of the service account credentials, which adds an additional layer of protection. Signed tokens can be detokenized by passing the signed data token and a bearer token generated from service account credentials. The service account must have appropriate permissions and context to detokenize the signed data tokens.

The data tokens can be passed as part of the options in `GenerateSignedDataTokens(filepath,options)`  function, which takes the service account credentials file path and an options object for token generation. Alternatively, you can also send the entire credentials as a string, by using `GenerateSignedDataTokensFromCreds(credentials,options)`

[Example using credentials file path](https://github.com/skyflowapi/skyflow-node/blob/master/samples/service-account/SignedTokenGenerationExample.ts):

```javascript
import { generateSignedDataTokens } from "skyflow-node";

let filepath = "CREDENTIALS_FILE_PATH";
let bearerToken = "";

function getSkyflowBearerToken() {
    return new Promise(async (resolve, reject) => {
        try {
            const options = {
                 dataTokens: ['dataToken1','dataToken2'],
            };

            let response = await generateSignedDataTokens(filepath, options);
            resolve(response);
            
        } catch (e) {
            reject(e);
        }
    });
}

const tokens = async () => {
    console.log(await getSkyflowBearerToken());
};

token();
```

### Note: 
By including `context` in the options, signed data tokens can be created with the `ctx` JWT claim.

Example:

```js
const options = {
  context: 'context_id',
  dataTokens: ['dataToken1','dataToken2'],
}
```

[Example using credentials json string](https://github.com/skyflowapi/skyflow-node/blob/master/samples/service-account/SignedTokenGenerationExample.ts):

```javascript
import { generateSignedDataTokensFromCreds } from "skyflow-node";

let cred = {
    clientID: "<YOUR_clientID>",
    clientName: "<YOUR_clientName>",
    keyID: "<YOUR_keyID>",
    tokenURI: "<YOUR_tokenURI>",
    privateKey: "<YOUR_PEM_privateKey>",
};
let bearerToken = "";
function getSkyflowBearerToken() {
    return new Promise(async (resolve, reject) => {
        try {
            const options = {
                dataTokens: ['dataToken1','dataToken2'],
            };

            let response = await generateSignedDataTokensFromCreds(
                JSON.stringify(cred),
                options
            );
            resolve(response);

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

### Vault APIs
The [Vault](https://github.com/skyflowapi/skyflow-node/tree/master/src/vault-api) Node.js module is used to perform operations on the vault such as inserting records, detokenizing tokens, retrieving tokens for list of `skyflow_id's` and to invoke the connection.

To use this module, the Skyflow client must first be initialized as follows.  

```javascript
import { Skyflow, generateBearerToken, isExpired } from "skyflow-node";

const filepath = "LOCATION_OF_SERVICE_ACCOUNT_KEY_FILE";

// Initialize the Skyflow client
const client = Skyflow.init({
    // Id of the vault that the client should connect to
    vaultID: "string",
    // URL of the vault that the client should connect to
    vaultURL: "string",
    // Helper function generates a Skyflow bearer token
    getBearerToken: helperFunc,
});

```
For the `getBearerToken` parameter, pass in a helper function that retrieves a Skyflow bearer token from your backend. This function will be invoked when the SDK needs to insert or retrieve data from the vault. A sample implementation is shown below: 

For example, if the response of the consumer tokenAPI is in the below format

```
{
   "accessToken": string,
   "tokenType": string
}
```
then, your getBearerToken Implementation should be as below

```javascript
let bearerToken = "";

function getSkyflowBearerToken() {
    return new Promise(async (resolve, reject) => {
        try {
            if (!isExpired(bearerToken)) resolve(bearerToken);
            else {
                let response = await generateBearerToken(filepath);
                bearerToken = response.accessToken;
                resolve(bearerToken);
            }
        } catch (e) {
            reject(e);
        }
    });
}
```

All Vault APIs must be invoked using a client instance.

#### Insert

To insert data into your vault, use the `insert(records, options)` method. The first parameter records is a JSONObject that must have a records key and takes an array of records to be inserted into the vault as a value. The second parameter options is an optional object that provides further options for your insert call, `insert` method also support upsert operations. See below:

```javascript
data = {
    records: [{
        table: '<TABLE_NAME>',
        fields: {
            <FIELDNAME>: '<VALUE>'
        }
    }]
};

// Insert data. The insert function returns a Promise.
const response = client.insert(data, {
    tokens: true  // Indicates whether or not tokens should be returned for the inserted data. Defaults to 'true'.
    upsert: [ // upsert operations support in the vault.
      {
        table: "string", // table name.
        column: "value  ", // unique column in the table.
      }
    ]
});
```

An [example](https://github.com/skyflowapi/skyflow-node/blob/master/samples/vault-api/Insert.ts) of an insert call is given below:

```javascript
const response = client.insert({
    records: [{
        fields: {
            expiry_date: '12/2026',
            card_number: '411111111111111',
        },
        table: 'cards',
    }, ],
}, {
    tokens: true
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

Sample response:

```json
{
  "records": [
    {
      "table": "cards",
      "fields": {
        "card_number": "f37186-e7e2-466f-91e5-48e2bcbc1",
        "expiry_date": "1989cb56-63a-4482-adf-1f74cd1a5"
      }
    }
  ]
}
```
An [example](https://github.com/skyflowapi/skyflow-node/blob/master/samples/vault-api/UpsertSupport.ts) of insert call with `upsert` support is given below:
```javascript
const response = client.insert({
    records: [{
        fields: {
            expiry_date: '12/2026',
            card_number: '411111111111111',
        },
        table: 'cards',
    }],
}, {
    tokens: true,
    upsert: [
      {
          table:'cards',
          column:'card_number',
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

Sample response:

```json
{
  "records": [
    {
      "table": "cards",
      "fields": {
        "card_number": "f37186-e7e2-466f-91e5-48e2bcbc1",
        "expiry_date": "1989cb56-63a-4482-adf-1f74cd1a5"
      }
    }
  ]
}
```
#### Detokenize

In order to retrieve data from your vault using tokens that you have previously generated for that data, you can use the `detokenize(records)` method. The first parameter must have a records key that takes an array of tokens to be fetched from the vault, as shown below.

```javascript
data = {
    records: [{
        // Token for the record to be fetched
        'token': 'string'
    }]
}
```
An [example](https://github.com/skyflowapi/skyflow-node/blob/master/samples/vault-api/Detokenize.ts) of a detokenize call:

```javascript
const result = client.detokenize({
    records: [{
        token: '4017-f72b-4f5c-9b-8e719'
    }]
});

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
      "token": "110dc-6f76-19-bd3-9051051",
      "value": "1990-01-01"
    }
  ]
}
```

#### Get By Id
In order to retrieve data from your vault using SkyflowIDs, use the `getById(records)` method. The records parameter takes a JSONObject that should contain an array of SkyflowIDs to be fetched, as shown below:

```javascript
data = {
    records: [{
        // List of skyflow_ids for the records to be fetched
        ids: ['id1', 'id2'],
        // Name of table holding the above skyflow_ids
        table: 'NAME_OF_SKYFLOW_TABLE',
        // Redaction to be applied to retrieved data
        redaction: Skyflow.RedactionType,
    }]
};
```
There are 4 accepted values in `Skyflow.RedactionTypes`:
* `PLAIN_TEXT`
* `MASKED`
* `REDACTED`
* `DEFAULT`

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

#### Invoke Connection

Using the InvokeConnection method, you can integrate their server-side application with third party APIs and services without directly handling sensitive data. Prior to invoking the InvokeConnection method, you must have created a connection and have a connectionURL already generated. Once you have the connectionURL, you can invoke a connection by using the `invokeConnection(config)` method. The config object must include a connectionURL and methodName. The other fields are optional.

```javascript
data = {
    connectionURL: '<YOUR_CONNECTION_URL>',
    methodName: Skyflow.RequestMethod.POST,
    requestHeader: {
        Authorization: '<YOUR_CONNECTION_BASIC_AUTH>'
    },
    pathParams: {
        card_number: '<YOUR_CARD_NUMBER>'
    },
    requestBody: {
        expirationDate: {
            mm: '01',
            yy: '46'
        }
    }
};
```

`methodName` supports the following methods:
* GET
* POST
* PUT
* PATCH
* DELETE

**pathParams, queryParams, requestHeader, requestBody** are the JSON objects that will be sent through the gateway integration URL.

An [example](https://github.com/skyflowapi/skyflow-node/blob/master/samples/vault-api/InvokeConnection.ts) of `invokeConnection`:

```javascript
const response = client.invokeConnection({
    connectionURL: '<YOUR_CONNECTION_URL>',
    methodName: Skyflow.RequestMethod.POST,
    requestHeader: {
        'Content-Type': 'application/json',
        Authorization: '<YOUR_CONNECTION_BASIC_AUTH>'
    },
    pathParams: {
        card_number: '<YOUR_CARD_NUMBER>'
    },
    requestBody: {
        expirationDate: {
            mm: '01',
            yy: '46'
        }
    }
});

response.then(
    (res) => {
        console.log(JSON.stringify(res));
    }
).catch((err) => {
    console.log(JSON.stringify(err));
});
```

Sample response:
```json
{
  "receivedTimestamp": "2021-11-05 13:43:12.534",
  "processingTimeinMs": "12",
  "resource": {
    "cvv2": "558"
  }
}
```

### Logging
The Skyflow Node.js SDK provides useful logging. By default the logging level of the SDK is set to `LogLevel.ERROR`. This can be changed by using `setLogLevel(logLevel)` as shown below:

```javascript
import { setLogLevel } from "skyflow-node";

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
* The ranking of logging levels are as follows:  `DEBUG` < `INFO` < `WARN` < `ERROR`
* The default the logLevel for Skyflow SDK is `LogLevel.ERROR`.

## Reporting a Vulnerability

If you discover a potential security issue in this project, please reach out to us at security@skyflow.com. Please do not create public GitHub issues or Pull Requests, as malicious actors could potentially view them.
