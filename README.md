
# Description
skyflow-node is the Node.js version of Skyflow SDK for the JavaScript programming language.

## Prerequisites
* Requires Node version 6.9.0 or higher.

## Table of Contents
* [Service Account Token Generation](#service-account-token-generation)
* [Vault APIs](#vault-apis)
  *  [Insert](#insert)
  *  [Detokenize](#detokenize)
  *  [GetById](#get-by-id)
  *  [InvokeConnection](#invoke-connection)
* [Logging](#logging)

## Installation
```sh
npm install skyflow-node

```
## Usage

### Service Account Token Generation
[Service Account](https://github.com/skyflowapi/skyflow-node/tree/master/src/service-account) Node.js module is used to generate service account tokens from a service account credentials file. See [API Authentication](https://docs.skyflow.com/developer-portal/getting-started/api-authentication/#step-1-create-a-service-account--assign-a-role) for instructions on creating a service account.

The token generated from this module is valid for 60 minutes and can be used to make API calls to vault services as well as management API(s) based on the permissions of the service account.

The `GenerateBearerToken(filepath)` function takes the service acccount credentials file path for token generation. Alternatively, you can also send the entire credentials as string, by using `GenerateBearerTokenFromCreds(credentials)`

[Example](https://github.com/skyflowapi/skyflow-node/blob/master/samples/service-account/TokenGenerationExample.js):

```javascript
import {
    generateBearerToken
} from 'skyflow-node';

let filepath = 'LOCATION_OF_SERVICE_ACCOUNT_KEY_FILE';
let bearerToken = ""
function getSkyflowBearerToken() {
    return new Promise(async (resolve, reject) => {
        try {
            if (isValid(bearerToken)) resolve(bearerToken)
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

### Vault APIs
The [Vault](https://github.com/skyflowapi/skyflow-node/tree/master/src/vault-api) Node.js module is used to perform operations on the vault such as inserting records, detokenizing tokens, retrieving tokens for list of `skyflow_id's` and to invoke the connection.

To use this module, the Skyflow client must first be initialized as follows.  

```javascript
import {
    Skyflow,
    generateBearerToken,
    isValid
} from 'skyflow-node';
const filepath = 'LOCATION_OF_SERVICE_ACCOUNT_KEY_FILE';

// Initialize the Skyflow client
const client = Skyflow.init({
    // Id of the vault that the client should connect to
    vaultID: 'string',
    // URL of the vault that the client should connect to  
    vaultURL: 'string',
    // Helper function generates a Skyflow bearer token
    getBearerToken: helperFunc
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
let bearerToken = ""

function getSkyflowBearerToken() {
    return new Promise(async (resolve, reject) => {
        try {
            if (isValid(bearerToken)) resolve(bearerToken)
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
To insert data into the vault, use the `insert(records, options)` method of the Skyflow client. The records parameter takes an array of records to be inserted into the vault. The options parameter takes `tokens` as a parameter.

`tokens` indicates whether or not tokens should be returned for the inserted data. Defaults to 'True'.

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
    tokens: true
});
```

An example of an insert call is given below:

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

#### Detokenize

For retrieving using tokens, use the `detokenize(records)` method. The records parameter takes an object that contains records to be fetched as shown below.

```javascript
data = {
    records: [{
        // Token for the record to be fetched
        'token': 'string'
    }]
}
```
An example of a detokenize call:

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
To retrieve a record with a `skyflow_id`, use the `getById(records)` method. The records parameter takes an object that contains records to be fetched as shown below:

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

An example of `getById` call:
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
Using Skyflow connection, end-user applications can integrate checkout/card issuance flow with their apps/systems. To invoke a connection, use the `invokeConnection(config)` method of the Skyflow client.

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

An example of `invokeConnection`:

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
