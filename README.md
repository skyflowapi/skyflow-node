
# Description

  

skyflow-node is the Node.js version of Skyflow SDK for the JavaScript programming language.

  

Requires node version 6.9.0 or higher.

  

## Table of Contents

  

*  [Service Account Token Generation](#service-account-token-generation)

*  [Vault APIs](#vault-apis)

*  [Insert](#insert)

*  [Detokenize](#detokenize)

*  [GetById](#get-by-id)

*  [InvokeGateway](#invoke-gateway)

  

## Installation

  

```sh

npm install skyflow-node

```

  

## Usage

  

### Service Account Token Generation

  

[Service Account](https://github.com/skyflowapi/skyflow-node/tree/master/src/service-account) Node.js module is used to generate service account tokens from service account credentials file which is downloaded upon creation of service account. The token generated from this module is valid for 60 minutes and can be used to make API calls to vault services as well as management API(s) based on the permissions of the service account.

  

[Example](https://github.com/skyflowapi/skyflow-node/blob/master/samples/service-account/TokenGenerationExample.js):

  

```javascript

import {GenerateToken} from "skyflow-node";
var  filepath = "filepath_to_be_mentioned_here";

GenerateToken(filePath)
.then((res) => {
console.log(res);
})
.catch((err) => {
console.log(err);
});

```

  

### Vault APIs

The [Vault](https://github.com/skyflowapi/skyflow-node/tree/master/src/vault-api) Node.js module is used to perform operations on the vault such as inserting records, detokenizing tokens, retrieving tokens for a skyflow_id and to invoke gateway.

  

To use this module, the skyflow client must first be initialized as follows.

  

```javascript
  
import {Skyflow} from "skyflow-node";

//User defined function to provide access token to the vault apis
const client = Skyflow.init({
   vaultID: "string",          //Id of the vault that the client should connect to 
   vaultURL: "string",         //URL of the vault that the client should connect to
   getBearerToken: helperFunc  //helper function that retrieves a Skyflow bearer token from your backend
})


```

  

All Vault APIs must be invoked using a client instance.

  

#### Insert

To insert data into the vault from the integrated application, use the insert(records, options) method of the Skyflow client. The records parameter takes an array of records to be inserted into the vault. The options parameter takes  tokens  as parameter.
'tokens' indicates whether or not tokens should be returned for the inserted data. Defaults to 'True'.

```javascript

//Initialize Client

 data = {
        "records": [
            {
                "table": "<TABLE_NAME>",
                "fields": {
                    "<FIELDNAME>": "<VALUE>"
                }
            }
        ]
    }
const  response = client.insert(data,{tokens:true});

```

  

An example of an insert call is given below:

  

```javascript

const response = client.insert({
    records: [
      {
        fields: {
            cvv: "234",
            card_number: "411111111111111",
        },
        table: "cards",
      },
    ],
  },{tokens:true});
  response.then(
      (res) => {
        console.log(JSON.stringify(res));
      },
      (err) => {
        console.log(JSON.stringify(err));
      }
    )
    .catch((err) => {
      console.log(JSON.stringify(err));
    });

```

  

Sample response :

```json

{
"records": [
{
"table": "cards",
"fields": {
"card_number": "f37186-e7e2-466f-91e5-48e2bcbc1",
"cvv": "1989cb56-63a-4482-adf-1f74cd1a5",
},
}
]
}

```

  

#### Detokenize

  

For retrieving using tokens, use the detokenize(records) method. The records parameter takes an object that contains records to be fetched as shown below.

  

```javascript

client.detokenize({
	"records":[
		{
		"token": "string"  //token for the record to be fetched
		}
	]
})

```

  

An example of a detokenize call:

```javascript

const result = client.detokenize(
{"records": [{"token": "4017-f72b-4f5c-9b-8e719"}]}
)
 result.then((res) => {
            console.log("detokenize result: ");
            console.log(JSON.stringify(res));
        })
        .catch((err) => {
            console.log("detokenize error:")
            console.log(JSON.stringify(err));
        });

```

  

Sample response:

```javascript
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

  

For retrieving using SkyflowID's, use the getById(records) method. The records parameter takes an object that contains records to be fetched as shown below:

  

```javascript

client.getById({
	"records": [
		{
		"ids": ["id1","id2"], // List of SkyflowID's of the records to be fetched
		"table": str, // name of table holding the above skyflow_id's
		"redaction": Skyflow.RedactionType, // redaction to be applied to retrieved data
		}
	]
})

```

There are 4 accepted values in Skyflow.RedactionTypes:

-  `PLAIN_TEXT`

-  `MASKED`

-  `REDACTED`

-  `DEFAULT`

  

An example of getById call:
```javascript
skyflowIDs = [

"f8622-b557-4c6b-a12c-c0b0bfd9",

"da26de53-95d5-4db-99db-8d35ff9",

]

record = {"ids": skyflowIDs, "table": "cards", "redaction": RedactionType.PLAIN_TEXT}

invalidID = ["invalid skyflow ID"]
badRecord = {"ids": invalidID, "table": "cards", "redaction": RedactionType.PLAIN_TEXT}

records = {"records": [record, badRecord]}

  

const result = client.getById(records)
result.then((res) => {
        console.log("getByID result:");
        console.log(JSON.stringify(res));
  })
  .catch((err) => {
    console.log("getByID error: ");
    console.log(JSON.stringify(err));
  });
```

Sample response:

```javascript

{

"records": [

{

"fields": {

"card_number": "4111111111111111",

"cvv": "127",

"expiry_date": "11/35",

"fullname": "myname",

"skyflow_id": "f8d2-b557-4c6b-a12c-c5ebfd9"

},

"table": "cards"

},

{

"fields": {

"card_number": "4111111111111111",

"cvv": "317",

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

"skyflow_ids": ["invalid skyflow id"]

}

]

}

```

  

#### Invoke Connection

Using Skyflow connection, end-user applications can integrate checkout/card issuance flow with their apps/systems. To invoke gateway, use the invokeConnection(config) method of the Skyflow client.

  

```javascript
client.invokeConnection({
    connectionURL:"<YOUR_CONNECTION_URL>",
    methodName: Skyflow.RequestMethod.POST,
    requestHeader: {
      'Content-Type': 'application/json',
      'Authorization': '<YOUR_CONNECTION_BASIC_AUTH>'
    },
    pathParams: {
      card_number: "<YOUR_CARD_VALUE>"
    },
    queryParams:{
        "cvv":"123"
    },
    requestBody: {
      "expirationDate": {
        "mm": "01",
        "yy": "46"
      }
    }
  })

```

  

`methodName` supports the following methods:

- GET

- POST

- PUT

- PATCH

- DELETE

  

**pathParams, queryParams, requestHeader, requestBody** are the JSON objects that will be sent through the gateway integration url.

  

An example of invokeGateway:

```javascript
const response = client.invokeConnection({
    connectionURL:"<YOUR_GATEWAY_URL>",
    methodName: Skyflow.RequestMethod.POST,
    requestHeader: {
      'Content-Type': 'application/json',
      'Authorization': '<YOUR_CONNECTION_BASIC_AUTH>'
    },
    pathParams: {
      card_number: "<YOUR_CARD_VALUE>"
    },
    queryParams:{
        "cvv":"123"
    },
    requestBody: {
      "expirationDate": {
        "mm": "01",
        "yy": "46"
      }
    }
  })
response.then(
      (res) => {
        console.log(JSON.stringify(res));
      }
    )
    .catch((err) => {
      console.log(JSON.stringify(err));
    });

```

  

Sample response:

```javascript

{

"receivedTimestamp": "2021-11-05 13:43:12.534",

"processingTimeinMs": 12,

"resource": {

"cvv2": "558"

}

}

```