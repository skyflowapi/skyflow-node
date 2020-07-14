# Skyflow Node SDK

Node.js API Client for the Skyflow Platform API.

Requires node version 6.9.0 or higher.

## Installation

```sh
npm install skyflow
```


## Usage

All usage of this SDK begins with the creation of a client, the client handles the authentication and communication with the Skyflow API.

To get started create a skyflow client in one of the following ways
```javascript
import {connect} from 'skyflow';

const client = connect(orgid, <skyflow username>, <skyflow password>, <app id>, <app secret> , options) 
//options are optional parameters
```
Options object can include
```
{
    accessToken : 'your access token', // your access jwt. Defaults to generating a new token from given credentials
    browser : true, // if you are using this client from front end, Defaults to false
    prodApp : false //if this is a production application. Default to false

}
```

All interactions with the [Skyflow Platform API] is done through client methods.  Some examples are below, but for a full
 list of methods please refer to the JsDoc page for the [Client].



## Table of Contents

* [Auth](#auth)  
* [Records](#records)
  * [Insert Records](#insert-records)
  * [Get Records](#get-records)
  * [Delete Records](#delete-records)
  * [Update Records](#update-records)
  * [Bulk Insert Records](#bulk-insert)


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
client.insertRecord('<your vault id', 
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


#### Get Records

To get the record values back pass in the id token of respective rows, 

```javascript
client.getRecord('<vault id>', '<token>')
    .then(res => {
        console.log(res)
    })
    .catch(err => console.log(err));
```

#### Delete Records

This api deletes the record permanently from the vault. 

```javascript
client.deleteRecord('<vault id>', '<token>')
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

client.updateRecord('<vault id>', '<token>', recordFields)
    .then(res => {
        console.log(res) //updated token values
    })
    .catch(err => console.log(err));
```

#### Bulk Insert

This can be used to add multiple records at once. 
```javascript

let records = {
    records : [
        {
            fields : [
                {
                    name : 'field name',
                    value : 'field value'
                }
            ]

        }
    ]
}

client.insertBulkRecord('<vault id>', records)
    .then(res => {
        console.log(res)
    })
    .catch(err => console.log(err));

```