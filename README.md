# skyflow-sdk-nodejs

Node.js API Client for the [Skyflow Platform API].

Requires Node.js version 6.9.0 or higher.

Need help? Contact [developers@skyflow.com](mailto:skyflow@skyflow.com) or use the [Skyflow Developer Forum](#https://dev.skyflow.com/).

## Installation

```sh
npm install @skyflow/skyflow-sdk-nodejs
```

## JsDocs

You can view the entire JsDocs for this project here: https://dev.skyflow.com/skyflow-sdk-nodejs/jsdocs/

## Usage

All usage of this SDK begins with the creation of a client, the client handles the authentication and communication with the Skyflow API.  To create a client, you need to provide it with your Skyflow Domain and an API token.  To obtain those, see [Getting Started With the Skyflow APIs](https://developer.skyflow.com/code/rest/).

We also include an opt-in [default request executor](#default-request-executor) that you can configure, which will automatically handle rate limiting retries for you:

```javascript
const skyflow = require('@skyflow/skyflow-sdk-nodejs');

const client = new skyflow.Client({
    appId, 
    appSecret
});
```

It is also possible to provide configuration through environment variables or YAML files.  Please see [Configuration](#configuration) for examples.

All interactions with the [Skyflow Platform API] is done through client methods.  Some examples are below, but for a full
 list of methods please refer to the JsDoc page for the [Client].



## Table of Contents

* [Examples](#examples)
  * [Vault](#vaults)
    * [Create a Vault](#create-a-vault)
    * [Get a Vault](#get-a-vault)
    * [Update a Vault](#update-a-vault)
    * [Delete a Vault](#delete-a-vault)
    * [List All Org Vaults](#list-all-org-vaults)
    * [Search for Vaults](#search-for-vaults) 
  * [Applications](#applications)
    * [Create an Application](#create-an-application)
    * [Get an Application](#get-an-application)
    * [Delete an Application](#delete-an-application)
    * [Update an Application](#update-an-application)
    * [Search an Application](#search-an-application)
    * [Get Application secret](#get-application-secret)

* [Notebook](#notebook)
  * [Create a notebook](#create-notebook)
  * [Get a Notebook](#get-notebook)
  * [Delete Notebook](#delete-notebook)
  * [Update Notebook](#update-notebook)
  * [Search for notebook](#search-a-notebook)
 
* [Models](#models)
* [Policies](#policies)
* [Records](#records)
  * [Query Records](#query-records)
  * [Create Record](#Create-record)
  * [Get Records](#get-records)
  * [Delete Record](#delete-record)
  * [Update Records](#update-records)
* [Tokens](#tokens)
* [Users](#users)

## Examples

This library is a wrapper for the [Skyflow Platform API], which should be referred to as the source-of-truth for what is and isn't possible with the API.  In the following sections we show you how to use your client to perform some common operations with the [Skyflow Platform API].

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) if you would like to propose changes to this library.

[Sessions: Create Session with Session Token]: https://developer.skyflow.com/docs/api/resources/sessions.html#create-session-with-session-token
[Sessions: Session Properties]: https://developer.skyflow.com/docs/api/resources/sessions.html#session-properties
[Sessions: Session Operations]: https://developer.skyflow.com/docs/api/resources/sessions.html#session-operations
[Applications]: https://developer.skyflow.com/docs/api/resources/apps/
[Applications: Application User Profile]: https://developer.skyflow.com/docs/api/resources/apps/#application-user-profile-object
[Applications: Add Application]: https://developer.skyflow.com/docs/api/resources/apps/#add-application
[Applications: User Operations]:https://developer.skyflow.com/docs/api/resources/apps/#application-user-operations
[Basic Authentication Application]: https://developer.skyflow.com/docs/api/resources/apps/#add-basic-authentication-application
[Client]: https://developer.skyflow.com/skyflow-sdk-nodejs/jsdocs/Client.html
[DefaultRequestExecutor]: src/default-request-executor.js
[Groups: Add Group]: https://developer.skyflow.com/docs/api/resources/groups.html#add-group
[isomorphic-fetch]: https://github.com/matthew-andrews/isomorphic-fetch
[Skyflow Developer Forum]: https://devforum.skyflow.com/
[Skyflow Platform API]: https://developer.skyflow.com/docs/api/getting_started/api_test_client.html
[Pagination]: https://developer.skyflow.com/docs/api/getting_started/design_principles.html#pagination
[Rate Limiting at Skyflow]: https://developer.skyflow.com/docs/api/getting_started/rate-limits
[RequestExecutor]: src/request-executor.js
[System Log API]: https://developer.skyflow.com/docs/api/resources/system_log
[Users API Reference]: https://developer.skyflow.com/docs/api/resources/users.html
[Users: Create User]: https://developer.skyflow.com/docs/api/resources/users.html#create-user
[Users: Get User]: https://developer.skyflow.com/docs/api/resources/users.html#get-user
[Users: Lifecycle Operations]: https://developer.skyflow.com/docs/api/resources/users.html#lifecycle-operations
[Users: List Users]: https://developer.skyflow.com/docs/api/resources/users.html#list-users
[Users: Update User]: https://developer.skyflow.com/docs/api/resources/users.html#update-user
[Skyflow NodeJS Management SDK JSDoc Site]: https://developer.skyflow.com/skyflow-sdk-nodejs/jsdocs/
