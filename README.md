# Skyflow Node SDK

Node.js API Client for the Skyflow Platform API.

Requires node version 6.9.0 or higher.

## Installation

```sh
npm install skyflow-node
```


## Usage

All usage of this SDK begins with the creation of a client, the client handles the authentication and communication with the Skyflow API.

To get started create a skyflow client in one of the following ways
```javascript
import {connect} from 'skyflow-node';

const client = connect(workspaceUrl, vaultId, credentials, options) 
// credentials is your service account json file which can be downloaded from skyflow studio
//options are optional parameters
```
Options object can include
```
{
    accessToken : 'your access token', // your access jwt. Defaults to generating a new token from given credentials
    browser : true, // if you are using this client from front end, Defaults to false
}
```

All interactions with the Skyflow Platform API is done through client methods.  

## Table of Contents

* [Auth](#auth)  
* [Records](#records)
  * [Insert Records](#insert-records)
  * [Get All Records](#get-records)
  * [Get Record](#get-record)
  * [Delete Record](#delete-record)
  * [Delete All Records](#delete-record)
  * [Update Records](#update-records)
* [Tokens](#tokens)


### Auth

```
client.getAccessToken()
.then(res => {
    //returns access token if credentials are valid
})
.catch(err => {
     
})
```

### Records

#### Insert Records

```javascript
client.bulkInsertRecords('<your table name', 
   [
        {
            "field1": "<field value>",
            "field2": "<field value>",
        }
    ]
    
)
    .then(res => {
        console.log(res) // returns the token id and tokens of each column values
    })
    .catch(err => console.log(err.data.error))
```
#### Get All Records

To get the record values back pass in the id token of respective rows, 

```javascript
client.bulkGetRecords('<table name>', options)
    .then(res => {
        console.log(res)
    })
    .catch(err => console.log(err));
```
Options is a non mandatory argument. It could have some or all of the below fields
```javascript
const options = {
    skyflowIds : ['skyflow-id'] , //array of skyflow ids of the records you want to retrieve. Defaults to all records
    redaction: 'DEFAULT', //Redaction format of the retrieved data. Possible values are 'DEFAULT', 'MASKED', 'REDACTED', 'PLAIN_TEXT'
    tokenization: true, // If you want to retrieve tokens along with data
    fields: ['field names'],// Array of field names you want to retrieve. Defaults to all
    offset: number, // Record Offset of the first record to be retrieved. Defaults to 0  
    limit: number, // limit of records to be retrieved. Defaults to 25
               
}
```

#### Get Record

To get the record values back pass in the id token of respective rows, 

```javascript
client.getRecord('<table name>', '<skyflow-id>', options)
    .then(res => {
        console.log(res)
    })
    .catch(err => console.log(err));
```
Options is a non mandatory argument. It could have some or all of the below fields
```javascript
const options = {
  
    redaction: 'DEFAULT', //Redaction format of the retrieved data. Possible values are 'DEFAULT', 'MASKED', 'REDACTED', 'PLAIN_TEXT'
    tokenization: true, // If you want to retrieve tokens along with data
    fields: ['field names'],// Array of field names you want to retrieve. Defaults to all
    
               
}
```
#### Delete Record

This api deletes the record permanently from the vault. 

```javascript
client.deleteRecord('<table name>', '<skyflow-id>')
    .then(res => {
        console.log(res) //returns back the id if operation is successful
    })
    .catch(err => console.log(err));


```


#### Delete Records

This api deletes all the records permanently from the vault. 

```javascript
client.bulkDeleteRecords('<table name>', skyflowIds)
    .then(res => {
        console.log(res) //returns back the id if operation is successful
    })
    .catch(err => console.log(err));


```

#### Update Records

This api can be used to update some or all the ros of the record. 

```javascript

let recordFields = [
    {
    name : 'field name',
    value : 'field new value'
    }
]

client.updateRecord('<table name>', '<skyflow-id>', recordFields)
    .then(res => {
        console.log(res) //updated token values
    })
    .catch(err => console.log(err));
```
#### Get Record By Token

This api can be used to retrieve the data with the tokens. 

```javascript 
await client.getRecordByToken('<token>')
    .then(res => {
        console.log(res)
    })
    .catch(e => {
        console.log(e)
    });
```


#### Bulk Get Records By Tokens
This api can be used to retrieve multiple records at once with tokens. 

```javascript 
await client.getBulkRecordsByTokens([<tokens>])
    .then(res => {
        console.log(res)
    })
    .catch(e => {
        console.log(e)
    });
```


As an alternative to promises, you can also send a function as the last argument to all the above APIs which will act as a callback.
