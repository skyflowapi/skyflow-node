
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
    - [Service Account Bearer Token Generation](#Service-Account-Bearer-Token-Generation)
    - [Service Account Bearer Token Generation with Additional Context](#Service-Account-Bearer-Token-Generation-with-Additional-Context)
    - [Service Account Scoped Bearer Token Generation](#Service-Account-Scoped-Bearer-Token-Generation)
    - [Skyflow Signed Data Tokens Generation](#Skyflow-Signed-Data-Tokens-Generation)
    - [Vault APIs](#vault-apis)
      - [Insert](#insert)
      - [Detokenize](#detokenize)
      - [Get By Id](#get-by-id)
      - [Update](#update)
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

### Importing `skyflow-node`

```
const { Skyflow, generateBearerToken } = require("skyflow-node");
```
Or using ES modules

```
import { Skyflow, generateBearerToken }  from "skyflow-node";
```

### Service Account Bearer Token Generation
The [service account](https://github.com/skyflowapi/skyflow-node/tree/master/src/service-account) module uses a credentials file to generate service account tokens. See [API Authentication](https://docs.skyflow.com/developer-portal/getting-started/api-authentication/#step-1-create-a-service-account--assign-a-role) for instructions on creating a service account.

The token generated from this module is valid for 60 minutes and lets you make API calls to the Data API as well as the Management API based on the permissions of the service account.

The `generateBearerToken(filepath)` function takes the service account credentials file path for token generation. Alternatively, you can send the entire service account credentials as a string, by using `generateBearerTokenFromCreds(credentials)` function.

Example using a service account credentials file path:

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

[Example using a service account credentials JSON string:](https://github.com/skyflowapi/skyflow-node/blob/master/samples/service-account/TokenGenerationExample.ts)

```js
import { generateBearerTokenFromCreds, isValid } from "skyflow-node";

let credentials = {
    clientID: "<YOUR_CLIENT_ID>",
    clientName: "<YOUR_CLIENT_NAME>",
    keyID: "<YOUR_KEY_ID>",
    tokenURI: "<YOUR_TOKEN_URI>",
    privateKey: "<YOUR_PEM_PRIVATE_KEY>",
};
let bearerToken = "";

function getSkyflowBearerToken() {
    return new Promise(async (resolve, reject) => {
        try {
            if (isValid(bearerToken)) resolve(bearerToken);
            else {
                let response = await generateBearerTokenFromCreds(
                    JSON.stringify(credentials)
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
### Service Account Bearer Token Generation with Additional Context
Context-Aware Authorization enables you to embed context values into a Bearer token when you generate it, and reference those values in your policies for more dynamic access control of data in the vault or validating signed data tokens during detokenization. It can be used to track end user identity when making API calls using service accounts. 
 
When you create a service account with context_id enabled, you can pass an additional claim called ctx in the JWT assertion used to authenticate the service account.  This  ctx parameter should ideally map to the identifier of the end user accessing your service for audit logging purposes. On successful validation of the JWT assertion, Skyflow generates a bearer token in the JWT format. This resulting bearer token generated will have the context embedded as a claim. You can now use this context embedded bearer token to make API calls to Skyflow APIs. Additionally, the ctx value contained in the bearer token is also audit logged.

The Skyflow Node SDK generates the JWT assertion for you with the context embedded. To do so you must pass the value for the ‘ctx’ claim as part of the `options` parameter in the `generateBearerToken(filepath, options)` function.

`generateBearerToken(filepath, {context: “<context_id>”})`

Full example using a service account credentials file path:

```js
import { generateBearerToken, isExpired } from "skyflow-node";

let filepath = "CREDENTIALS_FILE_PATH"
let bearerToken = "";

function getSkyflowBearerToken() {
    return new Promise(async (resolve, reject) => {
        try {
            const options = {
                context: "CONTEXT_ID",
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
import { generateBearerTokenFromCreds, isValid } from "skyflow-node";

let credentials = {
    clientID: "<YOUR_CLIENT_ID>",
    clientName: "<YOUR_CLIENT_NAME>",
    keyID: "<YOUR_KEY_ID>",
    tokenURI: "<YOUR_TOKEN_URI>",
    privateKey: "<YOUR_PEM_PRIVATE_KEY>",
};
let bearerToken = "";

function getSkyflowBearerToken() {
    return new Promise(async (resolve, reject) => {
        try {
            const options = {
                context: "CONTEXT_ID",
            }
            if (isValid(bearerToken)) resolve(bearerToken);
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
### Service Account Scoped Bearer Token Generation 
When a service account has multiple roles, you can generate bearer tokens that are scoped to a specific role by providing the appropriate role ID.Generated bearer tokens are valid for 60 minutes and let you perform operations with the permissions associated with the specified role.

The role IDs are passed as part of the `options` in `generateBearerToken(filepath, options)` function, which takes the service account credentials file path and an optional `options` object for token generation. 

[Example using a service account credentials file path:](https://github.com/skyflowapi/skyflow-node/blob/master/samples/service-account/ScopedTokenGenerationExample.ts)

```js
import { generateBearerToken, isExpired } from "skyflow-node";

let filepath = "CREDENTIALS_FILE_PATH"
let bearerToken = "";

function getSkyflowBearerToken() {
    return new Promise(async (resolve, reject) => {
        try {
            const options = {
                roleIDs: ["ROLE_ID1", "ROLE_ID2"],
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
import { generateBearerTokenFromCreds, isValid } from "skyflow-node";

let credentials = {
    clientID: "<YOUR_CLIENT_ID>",
    clientName: "<YOUR_CLIENT_NAME>",
    keyID: "<YOUR_KEY_ID>",
    tokenURI: "<YOUR_TOKEN_URI>",
    privateKey: "<YOUR_PEM_PRIVATE_KEY>",
};
let bearerToken = "";

function getSkyflowBearerToken() {
    return new Promise(async (resolve, reject) => {
        try {
            const options = {
                roleIDs: ["ROLE_ID1", "ROLE_ID2"],
            };
            if (isValid(bearerToken)) resolve(bearerToken);
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

### Skyflow Signed Data Tokens Generation
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

[Example using a service account credentials file path:](https://github.com/skyflowapi/skyflow-node/blob/master/samples/service-account/SignedTokenGenerationExample.ts)

```js
import { generateSignedDataTokens } from "skyflow-node";

let filepath = "CREDENTIALS_FILE_PATH";
let bearerToken = "";

function getSkyflowBearerToken() {
    return new Promise(async (resolve, reject) => {
        try {
            const options = {
                dataTokens: ["DATA_TOKEN1", "DATA_TOKEN2"],
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
    console.log(await getSkyflowBearerToken());
};

tokens();
```

Note:
By including context in the `options`, you can create signed data tokens with the context JWT claim.

[Example using a service account credentials JSON string:](https://github.com/skyflowapi/skyflow-node/blob/master/samples/service-account/SignedTokenGenerationExample.ts)

```js
import { generateSignedDataTokensFromCreds, isValid} from "skyflow-node";

let credentials = {
    clientID: "<YOUR_CLIENT_ID>",
    clientName: "<YOUR_CLIENT_NAME>",
    keyID: "<YOUR_KEY_ID>",
    tokenURI: "<YOUR_TOKEN_URI>",
    privateKey: "<YOUR_PEM_PRIVATE_KEY>",
};
let bearerToken = "";

function getSkyflowBearerToken() {
    return new Promise(async (resolve, reject) => {
        try {
            const options = {
                dataTokens: ["DATA_TOKEN2", "DATA_TOKEN2"],,
            };
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

To insert data into your vault, use the `insert(records, options)` method. The first parameter records is a JSONObject that must have a records key and takes an array of records to be inserted into the vault as a value. The second parameter options is an optional object that provides further options for your insert call, insert method also supports upsert operations, shown below.

See below:

```javascript
data = {
    records: [{
        table: "<TABLE_NAME>",
        fields: {
            <FIELDNAME>: "<VALUE>"
        }
    }]
};

// The insert function inserts data into the vault and returns a promise.
const response = client.insert(data, {
    tokens: true  // A boolean that indicates if tokens should be returned for the inserted data. The default value is true.
    upsert:[ // An array that defines support for upsert operations in the vault.
        {
            table: "<TABLE_NAME>", // A table name.
            column: "value", // A unique column in the table.
        }
    ]
});
```

An [example](https://github.com/skyflowapi/skyflow-node/blob/master/samples/vault-api/Insert.ts) of an insert call is given below:

```javascript
const response = client.insert({
    records: [{
        fields: {
            expiry_date: "12/2026",
            card_number: "411111111111111",
        },
        table: "cards",
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
Insert call example with upsert support:

```javascript
const response = client.insert({
    records: [{
        fields: {
            expiry_date: "12/2026",
            card_number: "411111111111111",
        },
        table: "cards",
    }, ],
}, {
    tokens: true,
    upsert: [
        {
            table: "cards",
            column: "card_number",
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

#### Detokenize

In order to retrieve data from your vault using tokens that you have previously generated for that data, you can use the `detokenize(records)` method. The first parameter must have a records key that takes an array of tokens to be fetched from the vault, as shown below.

```javascript
data = {
    records: [{
        // Token for the record to be fetched
        "token": "string"
    }]
}
```
An [example](https://github.com/skyflowapi/skyflow-node/blob/master/samples/vault-api/Detokenize.ts) of a detokenize call:

```javascript
const result = client.detokenize({
    records: [{
        token: "4017-f72b-4f5c-9b-8e719"
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
To retrieve data from your vault using SkyflowIDs or unique column values, use the getById(records) method. The `records` parameter takes a JSONObject that should contain either an array of SkyflowIDs or a unique column name and values to fetch the records, as shown below:

```javascript
data = {
  records: [
    {
      // List of skyflow_ids for the records to fetch.
      ids: ["SKYFLOW_ID_1", "SKYFLOW_ID_2"], // Optional
      // Name of table holding the records in the vault.
      table: "NAME_OF_SKYFLOW_TABLE",
      // Redaction type to apply to retrieved data.
      redaction: Skyflow.RedactionType,
      // Unique column name in the vault.
      columnName: "UNIQUE_COLUMN_NAME", // Optional
      // List of given unique column values.
      columnValues: ["<COLUMN_VALUE_1>", "<COLUMN_VALUE_2>", "<COLUMN_VALUE_3>"], // Required if column name is provided
    },
  ],
};
```
`Skyflow.RedactionTypes` accept four values:
* `PLAIN_TEXT`
* `MASKED`
* `REDACTED`
* `DEFAULT`

You must apply a redaction type to retrieve data

Note: You cannot pass an array of skyflow_ids and unique column details together. Using column name and column value with `skyflow_ids` will return an error message.

[Example](https://github.com/skyflowapi/skyflow-node/blob/master/samples/vault-api/GetById.ts) to get records using skyflow_ids:
```javascript
let skyflowIds = [
    "f8622-b557-4c6b-a12c-c0b0bfd9",
    "da26de53-95d5-4db-99db-8d35ff9",
];

let record = {
    ids: skyflowIds,
    table: "cards",
    redaction: RedactionType.PLAIN_TEXT,
};

let records = {
    records: [record],
};

const result = client.getById(records);
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
[Example](https://github.com/skyflowapi/skyflow-node/blob/master/samples/vault-api/GetById.ts) to get records using unique column names and values:

```javascript
let record = {
    table: "cards",
    redaction: RedactionType.PLAIN_TEXT,
    columnName: "card_id",
    columnValues: ["123", "456"],
};

let records = {
    records: [record],
};

const result = client.getById(records);
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

#### Update
To update records in your vault by skyflow_id, use the `update(records, options)` method. The first parameter, `records`, is a JSONObject that must have a records key and takes an array of records to update as a value in the vault. The options parameter takes an object of optional parameters for the update and includes an option to return tokenized data for the updated fields. 

Call schema:
```js
const updateInput = {
  records: [ // Array of records to update.
    {
      id: "<SKYFLOW_ID>", // Skyflow_id of record to update.
      table: "<TABLE_NAME>", // Table name of given Skyflow_id. 
      fields: {  // Fields to update.
        "<FIELD_NAME_1>": "<FIELD_VALUE_1>", 
        "<FIELD_NAME_2>": "<FIELD_VALUE_2>",
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

[Example](https://github.com/skyflowapi/skyflow-node/blob/master/samples/vault-api/Update.ts) to update by ID using `skyflow_ids`
```js
const updateInput = {
  records: [
    {
      id: "29ebda8d-5272-4063-af58-15cc674e332b", // Valid record id.
      table: "cards",
      fields: {
        card_number: "5105105105105100",
        cardholder_name: "Thomas",
        expiration_date: "07/2032",
        ssn: "123-45-6722",          
      },   
    },    
  ],
};

const options = { tokens: true };

const response = skyflowClient.update(updateInput, options);
console.log(response);
```
Response:
```js
{
  "records":[
    {
      "id":"29ebda8d-5272-4063-af58-15cc674e332b",
      "fields":{
        "card_number":"93f28226-51b0-4f24-8151-78b5a61f028b",
        "cardholder_name":"0838fd08-9b51-4db2-893c-48542f3b121e",
        "expiration_date":"91d7ee77-262f-4d5d-8286-062b694c81fd",
        "ssn":"e28bf55d-f3d8-49a6-aad9-71a13db54b82",
      },
      "table":"cards",
    }
  ]
}
```
#### Invoke Connection

Using the InvokeConnection method, you can integrate their server-side application with third party APIs and services without directly handling sensitive data. Prior to invoking the InvokeConnection method, you must have created a connection and have a connectionURL already generated. Once you have the connectionURL, you can invoke a connection by using the `invokeConnection(config)` method. The config object must include a connectionURL and methodName. The other fields are optional.

```javascript
data = {
    connectionURL: "<YOUR_CONNECTION_URL>",
    methodName: Skyflow.RequestMethod.POST,
    requestHeader: {
        Authorization: "<YOUR_CONNECTION_BASIC_AUTH>"
    },
    pathParams: {
        card_number: "<YOUR_CARD_NUMBER>"
    },
    requestBody: {
        expirationDate: {
            mm: "01",
            yy: "46"
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
    connectionURL: "<YOUR_CONNECTION_URL>",
    methodName: Skyflow.RequestMethod.POST,
    requestHeader: {
        "Content-Type": "application/json",
        Authorization: "<YOUR_CONNECTION_BASIC_AUTH>"
    },
    pathParams: {
        card_number: "<YOUR_CARD_NUMBER>"
    },
    requestBody: {
        expirationDate: {
            mm: "01",
            yy: "46"
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
