# skyflow-sdk-nodejs

Node.js API Client for the [Skyflow Platform API].

Requires Node.js version 6.9.0 or higher.

## Installation

```sh
npm install @skyflow/skyflow-node-sdk
```

## JsDocs

You can view the entire JsDocs for this project here: https://dev.skyflow.com/skyflow-sdk-nodejs/jsdocs/

## Usage

All usage of this SDK begins with the creation of a client, the client handles the authentication and communication with the Skyflow API.  To create a client, you need to provide it with your Skyflow Domain and an API token.  To obtain those, see [Getting Started With the Skyflow APIs](https://developer.skyflow.com/code/rest/).

To get started create a skyflow client in one of the following ways
```javascript
const skyflow = require('@skyflow/skyflow-sdk-nodejs');

const client = new skyflow.Client({
    appId, 
    appSecret,
    orgUrl,
    bearerToken, //optional
    username,
    password, //use this if you don't have a token

});
```



```javascript
const skyflow = require('@skyflow/skyflow-sdk-nodejs');

const client = new skyflow.Client()
.setAppId('your-app-id')
.setAppSecret('your-app-secret')
.setBearerToken('bearer-token')
.setOrgUrl('your skyflow org url')
.setUsername('your user name')
.setPassword('your password')
```

All interactions with the [Skyflow Platform API] is done through client methods.  Some examples are below, but for a full
 list of methods please refer to the JsDoc page for the [Client].



## Table of Contents

* [Examples](#examples)
  
* [Records](#records)
  * [Insert Records](#insert-records)
  * [Get Records](#get-records)



### Records

#### Insert Records

```javascript
client.insertRecords('<your vault id', '<your notebook name>', [
    {
        "fields": [
            {
                "name": "<field name>",
                "value": "<field value>"
            }
        ]
    },
])
    .then(res => {
        console.log(res)
    })
    .catch(err => console.log(err.data.error))
