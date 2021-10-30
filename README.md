# Description

skyflow-node is the Node.js version of Skyflow SDK for the JavaScript programming language.

Requires node version 6.9.0 or higher.

## Installation

```sh
npm install skyflow-node
```

## Usage

### Service Account Token Generation

[This](https://github.com/skyflowapi/skyflow-node-sdk/tree/master/src/service-account) Node.js module is used to generate service account tokens from service account credentials file which is downloaded upon creation of service account. The token generated from this module is valid for 60 minutes and can be used to make API calls to vault services as well as management API(s) based on the permissions of the service account.

[Example](https://github.com/skyflowapi/skyflow-node-sdk/blob/master/samples/service-account/TokenGenerationExample.js):

```javascript
const skyflow = require("skyflow-node");

var filepath = "filepath_to_be_mentioned_here";

skyflow
  .GenerateToken(filePath)
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });
```
