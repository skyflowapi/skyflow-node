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

const client = connect(accountName, workspaceName, vaultId, credentials, options) 
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
client.insertRecord('<your table name', 
   [
        {
            "name": "<field name>",
            "value": "<field value>"
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
client.getRecords('<table name>')
    .then(res => {
        console.log(res)
    })
    .catch(err => console.log(err));
```

#### Get Record

To get the record values back pass in the id token of respective rows, 

```javascript
client.getRecord('<table name>', '<skyflow-id>')
    .then(res => {
        console.log(res)
    })
    .catch(err => console.log(err));
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
client.deleteRecords('<table name>')
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

